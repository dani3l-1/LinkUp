import SafariServices
import SwiftUI
import WebKit

extension Notification.Name {
    static let linkUpGoBack = Notification.Name("linkUpGoBack")
    static let linkUpNavigate = Notification.Name("linkUpNavigate")
    static let linkUpRequestLocation = Notification.Name("linkUpRequestLocation")
    static let linkUpRequestNotifications = Notification.Name("linkUpRequestNotifications")
    static let linkUpStartTracking = Notification.Name("linkUpStartTracking")
    static let linkUpStopTracking = Notification.Name("linkUpStopTracking")
}

struct LinkUpWebView: UIViewRepresentable {
    let url: URL
    let reloadToken: UUID
    let pushToken: String?
    @Binding var canGoBack: Bool
    @Binding var isLoading: Bool
    @Binding var firstLoadDone: Bool
    @Binding var loadError: String?
    @Binding var popupURL: URL?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.websiteDataStore = .default()

        // JS bridge — uses weak proxy to avoid retain cycle with WKUserContentController
        let controller = configuration.userContentController
        controller.add(WeakScriptHandler(context.coordinator), name: "linkupBridge")

        let preferences = WKWebpagePreferences()
        preferences.allowsContentJavaScript = true
        configuration.defaultWebpagePreferences = preferences

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.customUserAgent = "LinkUp iOS App"
        webView.load(URLRequest(url: url, cachePolicy: .returnCacheDataElseLoad, timeoutInterval: 20))

        let refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor(red: 0.23, green: 0.81, blue: 0.81, alpha: 1)
        refreshControl.addTarget(context.coordinator, action: #selector(Coordinator.handleRefresh(_:)), for: .valueChanged)
        webView.scrollView.addSubview(refreshControl)
        context.coordinator.refreshControl = refreshControl
        context.coordinator.webView = webView

        context.coordinator.backObserver = NotificationCenter.default.addObserver(
            forName: .linkUpGoBack, object: nil, queue: .main
        ) { [weak webView] _ in
            webView?.canGoBack == true ? webView?.goBack() : nil
        }

        context.coordinator.navigateObserver = NotificationCenter.default.addObserver(
            forName: .linkUpNavigate, object: nil, queue: .main
        ) { [weak webView, weak coordinator = context.coordinator] notification in
            guard let url = notification.object as? URL else { return }
            if url.host == coordinator?.parent.url.host {
                webView?.load(URLRequest(url: url))
            } else {
                UIApplication.shared.open(url)
            }
        }

        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        if context.coordinator.lastReloadToken != reloadToken {
            context.coordinator.lastReloadToken = reloadToken
            loadError = nil
            webView.load(URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData, timeoutInterval: 20))
        }
        if let token = pushToken, token != context.coordinator.lastInjectedPushToken {
            context.coordinator.lastInjectedPushToken = token
            context.coordinator.injectPushToken(token, into: webView)
        }
    }

    // MARK: - Coordinator

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        var parent: LinkUpWebView
        weak var webView: WKWebView?
        var lastReloadToken: UUID
        var lastInjectedPushToken: String?
        var refreshControl: UIRefreshControl?
        var backObserver: NSObjectProtocol?
        var navigateObserver: NSObjectProtocol?

        init(_ parent: LinkUpWebView) {
            self.parent = parent
            self.lastReloadToken = parent.reloadToken
        }

        deinit {
            [backObserver, navigateObserver].compactMap { $0 }.forEach {
                NotificationCenter.default.removeObserver($0)
            }
        }

        // MARK: - WKScriptMessageHandler (messages from web JS)

        func userContentController(_ userContentController: WKUserContentController,
                                   didReceive message: WKScriptMessage) {
            guard let body = message.body as? [String: Any],
                  let action = body["action"] as? String else { return }
            DispatchQueue.main.async {
                switch action {
                case "requestLocation":
                    NotificationCenter.default.post(name: .linkUpRequestLocation, object: nil)
                case "requestNotifications":
                    NotificationCenter.default.post(name: .linkUpRequestNotifications, object: nil)
                case "startTracking":
                    if let tripId = body["tripId"] as? String {
                        NotificationCenter.default.post(name: .linkUpStartTracking, object: tripId)
                    }
                case "stopTracking":
                    NotificationCenter.default.post(name: .linkUpStopTracking, object: nil)
                default:
                    break
                }
            }
        }

        @objc func handleRefresh(_ sender: UIRefreshControl) {
            parent.loadError = nil
            webView?.reload()
        }

        // MARK: - Injection helpers

        func injectPushToken(_ token: String, into webView: WKWebView) {
            let js = """
            window.dispatchEvent(new CustomEvent('linkupnative', {
              detail: { action: 'pushToken', token: \(jsString(token)) }
            }));
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }

        private func injectBridge(into webView: WKWebView) {
            let js = """
            (function() {
              if (window.LinkUpNative) return;
              window.LinkUpNative = {
                isNative: true,
                platform: 'ios',
                postMessage: function(payload) {
                  if (window.webkit?.messageHandlers?.linkupBridge) {
                    window.webkit.messageHandlers.linkupBridge.postMessage(payload);
                  }
                }
              };
              window.dispatchEvent(new CustomEvent('linkupnative', { detail: { action: 'ready' } }));
            })();
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }

        private func injectSafeAreaInsets(into webView: WKWebView) {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = scene.windows.first else { return }
            let i = window.safeAreaInsets
            let js = """
            var r = document.documentElement.style;
            r.setProperty('--native-safe-top', '\(i.top)px');
            r.setProperty('--native-safe-bottom', '\(i.bottom)px');
            r.setProperty('--native-safe-left', '\(i.left)px');
            r.setProperty('--native-safe-right', '\(i.right)px');
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }

        private func jsString(_ value: String) -> String {
            let escaped = value
                .replacingOccurrences(of: "\\", with: "\\\\")
                .replacingOccurrences(of: "'", with: "\\'")
            return "'\(escaped)'"
        }

        // MARK: - WKNavigationDelegate

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.loadError = nil
            parent.canGoBack = webView.canGoBack
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
            parent.firstLoadDone = true
            parent.canGoBack = webView.canGoBack
            refreshControl?.endRefreshing()
            injectBridge(into: webView)
            injectSafeAreaInsets(into: webView)
            if let token = parent.pushToken {
                injectPushToken(token, into: webView)
                lastInjectedPushToken = token
            }
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            handle(error, webView: webView)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            handle(error, webView: webView)
        }

        func webView(_ webView: WKWebView,
                     decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let targetURL = navigationAction.request.url else {
                decisionHandler(.cancel)
                return
            }
            if targetURL.host == parent.url.host || targetURL.scheme == "about" {
                decisionHandler(.allow)
                return
            }
            UIApplication.shared.open(targetURL)
            decisionHandler(.cancel)
        }

        // MARK: - WKUIDelegate

        func webView(_ webView: WKWebView,
                     runJavaScriptAlertPanelWithMessage message: String,
                     initiatedByFrame frame: WKFrameInfo,
                     completionHandler: @escaping () -> Void) {
            presentAlert(message: message, completion: completionHandler)
        }

        func webView(_ webView: WKWebView,
                     runJavaScriptConfirmPanelWithMessage message: String,
                     initiatedByFrame frame: WKFrameInfo,
                     completionHandler: @escaping (Bool) -> Void) {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let controller = scene.windows.first?.rootViewController else {
                completionHandler(false)
                return
            }
            let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(false) })
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(true) })
            controller.present(alert, animated: true)
        }

        func webView(_ webView: WKWebView,
                     runJavaScriptTextInputPanelWithPrompt prompt: String,
                     defaultText: String?,
                     initiatedByFrame frame: WKFrameInfo,
                     completionHandler: @escaping (String?) -> Void) {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let controller = scene.windows.first?.rootViewController else {
                completionHandler(nil)
                return
            }
            let alert = UIAlertController(title: nil, message: prompt, preferredStyle: .alert)
            alert.addTextField { $0.text = defaultText }
            alert.addAction(UIAlertAction(title: "Cancel", style: .cancel) { _ in completionHandler(nil) })
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completionHandler(alert.textFields?.first?.text) })
            controller.present(alert, animated: true)
        }

        // Handle window.open() — open URL in an in-app Safari sheet
        func webView(_ webView: WKWebView,
                     createWebViewWith configuration: WKWebViewConfiguration,
                     for navigationAction: WKNavigationAction,
                     windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url {
                DispatchQueue.main.async { self.parent.popupURL = url }
            }
            return nil
        }

        // MARK: - Private

        private func handle(_ error: Error, webView: WKWebView) {
            let nsError = error as NSError
            if nsError.code == NSURLErrorCancelled { return }
            parent.isLoading = false
            parent.canGoBack = webView.canGoBack
            parent.loadError = "Check your connection and try again."
            refreshControl?.endRefreshing()
        }

        private func presentAlert(message: String, completion: @escaping () -> Void) {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let controller = scene.windows.first?.rootViewController else {
                completion()
                return
            }
            let alert = UIAlertController(title: "LinkUp", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in completion() })
            controller.present(alert, animated: true)
        }
    }
}

// Breaks the WKUserContentController → Coordinator retain cycle
private final class WeakScriptHandler: NSObject, WKScriptMessageHandler {
    weak var delegate: WKScriptMessageHandler?
    init(_ delegate: WKScriptMessageHandler) { self.delegate = delegate }
    func userContentController(_ userContentController: WKUserContentController,
                               didReceive message: WKScriptMessage) {
        delegate?.userContentController(userContentController, didReceive: message)
    }
}
