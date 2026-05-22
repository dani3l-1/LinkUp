import CoreLocation
import SwiftUI
import UserNotifications
import WebKit

final class NativeServices: NSObject, ObservableObject, CLLocationManagerDelegate, UNUserNotificationCenterDelegate {
    @Published private(set) var shouldShowPermissionNudge = false
    @Published private(set) var pushToken: String?
    @Published var pendingNavigationURL: URL?

    private let locationManager = CLLocationManager()
    private let trackingLocationManager = CLLocationManager()
    private static let nudgeDismissedKey = "linkup.notificationNudgeDismissed"
    private var backgroundTripId: String?

    func prepare() {
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest

        trackingLocationManager.delegate = self

        UNUserNotificationCenter.current().delegate = self

        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            DispatchQueue.main.async {
                self?.shouldShowPermissionNudge = settings.authorizationStatus == .notDetermined
                    && !UserDefaults.standard.bool(forKey: Self.nudgeDismissedKey)
                if settings.authorizationStatus == .authorized {
                    UIApplication.shared.registerForRemoteNotifications()
                }
            }
        }

        NotificationCenter.default.addObserver(self, selector: #selector(handleStartTracking(_:)),
                                               name: .linkUpStartTracking, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(handleStopTracking),
                                               name: .linkUpStopTracking, object: nil)
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
        UserDefaults.standard.set(true, forKey: Self.nudgeDismissedKey)
        shouldShowPermissionNudge = false
    }

    func handleRemotePushToken(_ deviceToken: Data) {
        let token = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
        DispatchQueue.main.async { self.pushToken = token }
    }

    // MARK: - Background Trip Tracking

    @objc private func handleStartTracking(_ notification: Notification) {
        guard let tripId = notification.object as? String else { return }
        startBackgroundTracking(tripId: tripId)
    }

    @objc private func handleStopTracking() {
        stopBackgroundTracking()
    }

    private func startBackgroundTracking(tripId: String) {
        backgroundTripId = tripId
        trackingLocationManager.desiredAccuracy = kCLLocationAccuracyBest
        trackingLocationManager.distanceFilter = 15

        let status = trackingLocationManager.authorizationStatus
        if status == .authorizedAlways {
            trackingLocationManager.allowsBackgroundLocationUpdates = true
            trackingLocationManager.pausesLocationUpdatesAutomatically = false
        } else {
            // Ask for Always so background updates work; falls back to foreground-only if denied
            trackingLocationManager.requestAlwaysAuthorization()
        }

        trackingLocationManager.startUpdatingLocation()
    }

    private func stopBackgroundTracking() {
        trackingLocationManager.stopUpdatingLocation()
        backgroundTripId = nil
    }

    // MARK: - CLLocationManagerDelegate

    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        guard manager === trackingLocationManager, backgroundTripId != nil else { return }
        if manager.authorizationStatus == .authorizedAlways {
            manager.allowsBackgroundLocationUpdates = true
            manager.pausesLocationUpdatesAutomatically = false
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard manager === trackingLocationManager,
              let tripId = backgroundTripId,
              let location = locations.last else { return }

        // Native only posts when JS is suspended; foreground sends are handled by watchPosition in the web layer
        guard UIApplication.shared.applicationState == .background else { return }

        postLocationToServer(tripId: tripId, location: location)
    }

    private func postLocationToServer(tripId: String, location: CLLocation) {
        guard let url = URL(string: "https://linkuprides.com/api/trips/track/\(tripId)/location") else { return }

        WKWebsiteDataStore.default().httpCookieStore.getAllCookies { [weak self] cookies in
            var request = URLRequest(url: url, timeoutInterval: 10)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("LinkUp iOS App", forHTTPHeaderField: "User-Agent")

            let cookieHeader = cookies
                .filter { $0.domain.contains("linkuprides.com") }
                .map { "\($0.name)=\($0.value)" }
                .joined(separator: "; ")
            if !cookieHeader.isEmpty {
                request.setValue(cookieHeader, forHTTPHeaderField: "Cookie")
            }

            var body: [String: Any] = [
                "lat": location.coordinate.latitude,
                "lng": location.coordinate.longitude,
                "accuracy": location.horizontalAccuracy,
            ]
            if location.speed >= 0 { body["speed"] = location.speed }
            if location.course >= 0 { body["heading"] = location.course }
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)

            URLSession.shared.dataTask(with: request) { [weak self] _, response, _ in
                guard let self else { return }
                if let http = response as? HTTPURLResponse, http.statusCode == 410 || http.statusCode == 404 {
                    DispatchQueue.main.async { self.stopBackgroundTracking() }
                }
            }.resume()
        }
    }

    // MARK: - UNUserNotificationCenterDelegate

    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        completionHandler([.banner, .sound, .badge])
    }

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
