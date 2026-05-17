import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var nativeServices: NativeServices
    @State private var canGoBack = false
    @State private var isLoading = true
    @State private var loadError: String?
    @State private var reloadToken = UUID()

    private let appURL = URL(string: "https://linkuprides.com")!

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.03, green: 0.09, blue: 0.09)
                    .ignoresSafeArea()

                LinkUpWebView(
                    url: appURL,
                    reloadToken: reloadToken,
                    canGoBack: $canGoBack,
                    isLoading: $isLoading,
                    loadError: $loadError
                )
                .ignoresSafeArea(edges: .bottom)

                if let loadError {
                    OfflineView(message: loadError) {
                        self.loadError = nil
                        reloadToken = UUID()
                    }
                    .padding()
                }

                if isLoading && loadError == nil {
                    LaunchOverlay()
                }
            }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        NotificationCenter.default.post(name: .linkUpGoBack, object: nil)
                    } label: {
                        Label("Back", systemImage: "chevron.left")
                    }
                    .disabled(!canGoBack)
                }

                ToolbarItem(placement: .principal) {
                    Image("LinkUpLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 32, height: 32)
                        .accessibilityLabel("LinkUp")
                }

                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button {
                        reloadToken = UUID()
                    } label: {
                        Label("Reload", systemImage: "arrow.clockwise")
                    }

                    ShareLink(item: appURL) {
                        Label("Share", systemImage: "square.and.arrow.up")
                    }
                }
            }
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarBackground(Color(red: 0.03, green: 0.09, blue: 0.09), for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .safeAreaInset(edge: .bottom) {
                if nativeServices.shouldShowPermissionNudge {
                    PermissionNudge()
                        .environmentObject(nativeServices)
                }
            }
        }
    }
}

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
        .background(Color(red: 0.03, green: 0.09, blue: 0.09))
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
        .background(Color(red: 0.04, green: 0.12, blue: 0.12))
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundStyle(Color.white.opacity(0.08)),
            alignment: .top
        )
    }
}
