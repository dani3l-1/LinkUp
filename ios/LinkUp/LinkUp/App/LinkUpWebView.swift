import SwiftUI
import WebKit

extension Notification.Name {
    static let linkUpGoBack = Notification.Name("linkUpGoBack")
}

struct LinkUpWebView: UIViewRepresentable {
    let url: URL
    let reloadToken: UUID
    @Binding var canGoBack: Bool
    @Binding var isLoading: Bool
    @Binding var loadError: String?

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.websiteDataStore = .default()

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

        context.coordinator.webView = webView
        context.coordinator.backObserver = NotificationCenter.default.addObserver(
            forName: .linkUpGoBack,
            object: nil,
            queue: .main
        ) { [weak webView] _ in
            if webView?.canGoBack == true {
                webView?.goBack()
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
    }

    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        var parent: LinkUpWebView
        weak var webView: WKWebView?
        var lastReloadToken: UUID
        var backObserver: NSObjectProtocol?

        init(_ parent: LinkUpWebView) {
            self.parent = parent
            self.lastReloadToken = parent.reloadToken
        }

        deinit {
            if let backObserver {
                NotificationCenter.default.removeObserver(backObserver)
            }
        }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            parent.isLoading = true
            parent.loadError = nil
            parent.canGoBack = webView.canGoBack
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            parent.isLoading = false
            parent.canGoBack = webView.canGoBack
        }

        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            handle(error, webView: webView)
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            handle(error, webView: webView)
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
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

        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            presentAlert(message: message, completion: completionHandler)
        }

        private func handle(_ error: Error, webView: WKWebView) {
            let nsError = error as NSError
            if nsError.code == NSURLErrorCancelled { return }
            parent.isLoading = false
            parent.canGoBack = webView.canGoBack
            parent.loadError = "Check your connection and try again."
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
