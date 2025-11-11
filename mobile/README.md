# Onnjoy Mobile App

Capacitor-based mobile application that wraps the Angular frontend for iOS and Android.

## Quick Start

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Build Frontend
```bash
cd ../frontend
npm run build
cd ../mobile
```

### 3. Add Platforms
```bash
# Add iOS (requires macOS with Xcode)
npm run add:ios

# Add Android (requires Android Studio)
npm run add:android
```

### 4. Sync and Open
```bash
# Sync web assets and open iOS
npm run ios

# Or open Android
npm run android
```

## Available Commands

```bash
npm run build        # Build frontend and sync to mobile
npm run sync         # Sync web assets to native projects
npm run ios          # Open iOS project in Xcode
npm run android      # Open Android project in Android Studio
npm run dev          # Quick sync and open iOS
```

## Configuration

- **App ID:** com.onnjoy.gym
- **App Name:** OnnJoy
- **Web Directory:** ../frontend/dist/frontend_onnjoy/browser

## Plugins Included

- @capacitor/app - App state and URL handling
- @capacitor/haptics - Haptic feedback
- @capacitor/keyboard - Keyboard control
- @capacitor/status-bar - Status bar styling
- @capacitor/splash-screen - Splash screen management

## Development Workflow

1. Make changes to Angular app in `../frontend`
2. Run `npm run build` from mobile directory
3. Test in simulator/device using `npm run ios` or `npm run android`

## Requirements

- **iOS:** macOS with Xcode 14+
- **Android:** Android Studio with SDK 22+
- **Node:** 18+ (same as frontend)

## Next Steps

- [ ] Add app icons and splash screens
- [ ] Configure push notifications
- [ ] Add camera/geolocation plugins as needed
- [ ] Test on physical devices
- [ ] Configure code signing for distribution