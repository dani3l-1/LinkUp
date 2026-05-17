import CoreLocation
import SwiftUI
import UserNotifications

final class NativeServices: NSObject, ObservableObject, CLLocationManagerDelegate {
    @Published private(set) var shouldShowPermissionNudge = false

    private let locationManager = CLLocationManager()
    private let nudgeDismissedKey = "linkup.notificationNudgeDismissed"

    func prepare() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest

        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            DispatchQueue.main.async {
                self?.shouldShowPermissionNudge = settings.authorizationStatus == .notDetermined
                    && !UserDefaults.standard.bool(forKey: self?.nudgeDismissedKey ?? "")
            }
        }
    }

    func requestNotifications() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { [weak self] _, _ in
            DispatchQueue.main.async {
                self?.shouldShowPermissionNudge = false
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
}
