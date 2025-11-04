# Onnjoy Mobile App

Capacitor-based mobile application that wraps the Angular frontend for iOS and Android.

## Setup Plan (3-day timeline)

### Day 1: Capacitor Foundation
- [ ] Initialize Capacitor project
- [ ] Configure build pipeline to use `../frontend/dist/`
- [ ] Basic iOS/Android project setup
- [ ] Test basic app shell

### Day 2: Mobile Features
- [ ] Configure native plugins (camera, geolocation, push notifications)
- [ ] Mobile-specific UI adjustments
- [ ] Test on device/simulator
- [ ] Performance optimization

### Day 3: Polish & Deploy
- [ ] App icons and splash screens
- [ ] Build for production
- [ ] Test deployment pipeline
- [ ] Documentation

## Fallback: PWA Enhancement
If Capacitor timeline isn't met, enhance frontend with:
- Service worker for offline support
- Web app manifest for installability
- Push notification setup (web)

## Commands (TBD)
```bash
npm run dev          # Development with live reload
npm run build        # Build for production
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

## Dependencies (TBD)
- @capacitor/core
- @capacitor/cli
- @capacitor/ios
- @capacitor/android
- Native plugins as needed