import SwiftUI

@main
struct LinkUpApp: App {
    @StateObject private var nativeServices = NativeServices()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(nativeServices)
                .task {
                    nativeServices.prepare()
                }
        }
    }
}
