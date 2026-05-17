# LinkUp iOS

This is the native iOS project for LinkUp. It uses SwiftUI and WebKit to load the production LinkUp app with native app structure around it: branded launch, toolbar controls, offline handling, notification opt-in, and iOS permission descriptions.

## Open in Xcode

```bash
open ios/LinkUp/LinkUp.xcodeproj
```

Before App Store submission:

- Set the Apple Developer Team in Xcode.
- Confirm the bundle identifier, currently `com.linkuprides.LinkUp`.
- Add real App Store screenshots and privacy answers in App Store Connect.
- Test login, checkout, location sharing, camera/photo upload, push notification permission, and offline behavior on a physical iPhone.

Apple can still reject apps that are only a thin website wrapper. Keep native features visible and useful, and make sure LinkUp feels like an app on iOS.
