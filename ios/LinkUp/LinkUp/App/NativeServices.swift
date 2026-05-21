import CoreLocation
import SwiftUI
import UserNotifications

final class NativeServices: NSObject, ObservableObject, CLLocationManagerDelegate, UNUserNotificationCenterDelegate {
    @Published private(set) var shouldShowPermissionNudge = false
    @Published private(set) var pushToken: String?
    @Published var pendingNavigationURL: URL?

    private let locationManager = CLLocationManager()
    private let nudgeDismissedKey = "linkup.notificationNudgeDismissed"

    func prepare() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        UNUserNotificationCenter.current().delegate = self

        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            DispatchQueue.main.async {
                self?.shouldShowPermissionNudge = settings.authorizationStatus == .notDetermined
                    && !(UserDefaults.standard.bool(forKey: self?.nudgeDismissedKey ?? ""))
                if settings.authorizationStatus == .authorized {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }

    func requestNotifications() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { [weak self] granted, _ in
            DispatchQueue.main.async {
                self?.shouldShowPermissionNudge = false
                if granted {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }
    }

    func requestLocationWhenNeeded() {
        guard locationManager.authorizationStatus == .notDetermined else { return }
        locationManager.requestWhenInUseAuthorization()
    }

    func dismissPermissionNudge() {
        UserDefaults.standard.set(true, forKey: nudgeDismissedKey)
        shouldShowPermissionNudge = false
    }

    func handleRemotePushToken(_ deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        DispatchQueue.main.async { self.pushToken = token }
    }

    // MARK: - UNUserNotificationCenterDelegate

    // Show banners even when the app is in the foreground
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }

    // Route notification taps to the correct in-app page
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                didReceive response: UNNotificationResponse,
                                withCompletionHandler completionHandler: @escaping () -> Void) {
        let userInfo = response.notification.request.content.userInfo
        if let urlString = userInfo["url"] as? String, let url = URL(string: urlString) {
            DispatchQueue.main.async { self.pendingNavigationURL = url }
        }
        completionHandler()
    }
}
