import SafariServices
import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var nativeServices: NativeServices
    @State private var canGoBack = false
    @State private var isLoading = true
    @State private var firstLoadDone = false
    @State private var loadError: String?
    @State private var reloadToken = UUID()
    @State private var popupURL: URL?

    private let appURL = URL(string: "https://linkuprides.com")!

    var body: some View {
        ZStack {
            Color(red: 0.03, green: 0.09, blue: 0.09)
                .ignoresSafeArea()

            LinkUpWebView(
                url: appURL,
                reloadToken: reloadToken,
                pushToken: nativeServices.pushToken,
                canGoBack: $canGoBack,
                isLoading: $isLoading,
                firstLoadDone: $firstLoadDone,
                loadError: $loadError,
                popupURL: $popupURL
            )
            .ignoresSafeArea()

            if let loadError {
                OfflineView(message: loadError) {
                    self.loadError = nil
                    reloadToken = UUID()
                }
                .padding()
            }

            if !firstLoadDone && loadError == nil {
                LaunchOverlay()
            }
        }
        .safeAreaInset(edge: .bottom, spacing: 0) {
            if nativeServices.shouldShowPermissionNudge {
                PermissionNudge()
                    .environmentObject(nativeServices)
                    .ignoresSafeArea(edges: .bottom)
            }
        }
        .sheet(isPresented: Binding(
            get: { popupURL != nil },
            set: { if !$0 { popupURL = nil } }
        )) {
            if let url = popupURL {
                SafariView(url: url)
                    .ignoresSafeArea()
            }
        }
        .onReceive(nativeServices.$pendingNavigationURL.compactMap { $0 }) { url in
            NotificationCenter.default.post(name: .linkUpNavigate, object: url)
            nativeServices.pendingNavigationURL = nil
        }
        .onReceive(NotificationCenter.default.publisher(for: .linkUpRequestLocation)) { _ in
            nativeServices.requestLocationWhenNeeded()
        }
        .onReceive(NotificationCenter.default.publisher(for: .linkUpRequestNotifications)) { _ in
            nativeServices.requestNotifications()
        }
    }
}

// MARK: - Private views

private struct LaunchOverlay: View {
    var body: some View {
        VStack(spacing: 18) {
            Image("LinkUpLogo")
                .resizable()
                .scaledToFit()
                .frame(width: 92, height: 92)
                .shadow(color: .white.opacity(0.12), radius: 18)

            ProgressView()
                .tint(.white)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 0.03, green: 0.09, blue: 0.09).ignoresSafeArea())
    }
}

private struct OfflineView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 18) {
            Image("LinkUpLogo")
                .resizable()
                .scaledToFit()
                .frame(width: 74, height: 74)

            Text("LinkUp is having trouble loading")
                .font(.title2.bold())
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)

            Text(message)
                .font(.body)
                .foregroundStyle(.white.opacity(0.7))
                .multilineTextAlignment(.center)

            Button("Try Again", action: retry)
                .font(.headline)
                .foregroundStyle(.black)
                .padding(.horizontal, 26)
                .padding(.vertical, 13)
                .background(Color(red: 0.23, green: 0.81, blue: 0.81))
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .padding(28)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}

private struct PermissionNudge: View {
    @EnvironmentObject private var nativeServices: NativeServices

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "bell.badge")
                .font(.title3)
                .foregroundStyle(Color(red: 0.23, green: 0.81, blue: 0.81))

            VStack(alignment: .leading, spacing: 2) {
                Text("Stay updated")
                    .font(.subheadline.bold())
                    .foregroundStyle(.white)
                Text("Enable notifications for ride and chat updates.")
                    .font(.caption)
                    .foregroundStyle(.white.opacity(0.72))
            }

            Spacer()

            Button("Enable") {
                nativeServices.requestNotifications()
            }
            .font(.caption.bold())
            .foregroundStyle(.black)
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Color(red: 0.23, green: 0.81, blue: 0.81))
            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))

            Button {
                nativeServices.dismissPermissionNudge()
            } label: {
                Image(systemName: "xmark")
                    .foregroundStyle(.white.opacity(0.72))
            }
        }
        .padding()
        .background(Color(red: 0.04, green: 0.12, blue: 0.12).ignoresSafeArea())
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(Color.white.opacity(0.08)),
            alignment: .top
        )
    }
}

private struct SafariView: UIViewControllerRepresentable {
    let url: URL
    func makeUIViewController(context: Context) -> SFSafariViewController {
        SFSafariViewController(url: url)
    }
    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {}
}
