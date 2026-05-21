import SwiftUI

@main
struct LinkUpApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var nativeServices = NativeServices()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(nativeServices)
                .task {
                    nativeServices.prepare()
                    appDelegate.nativeServices = nativeServices
                }
        }
    }
}

// UIApplicationDelegate handles APNs callbacks that SwiftUI App lifecycle can't yet receive
final class AppDelegate: NSObject, UIApplicationDelegate {
    var nativeServices: NativeServices?

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        nativeServices?.handleRemotePushToken(deviceToken)
    }

    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("[LinkUp] APNs registration failed: \(error.localizedDescription)")
    }
}
