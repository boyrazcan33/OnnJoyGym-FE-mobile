# Onnjoy - Fitness & Wellness Platform

A comprehensive fitness platform with web and mobile applications for connecting fitness enthusiasts, finding workout partners, and accessing fitness content.

## Project Structure

```
onnjoy/
├── frontend/         # Angular web application
├── mobile/          # Capacitor mobile app
└── README.md        # This file
```

## Frontend

Angular 18 web application with SSR support, Angular Material UI, and Auth0 authentication.

### Development server

```bash
cd frontend
npm install
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Mobile

Capacitor-based mobile application that wraps the Angular frontend for iOS and Android platforms.

### Development Strategy

**Phase 1 (3 days):** Capacitor mobile app development  
**Phase 2 (Fallback):** PWA enhancement if Capacitor timeline not met

### Setup (Coming Soon)

```bash
cd mobile
npm install
npm run dev          # Development with live reload
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
```

See `mobile/README.md` for detailed setup plan and timeline.

## Features

- 🏋️ **Gym Management** - Find and manage gym preferences
- 👥 **Workout Buddies** - Connect with fitness partners  
- 🏆 **Clubs & Leaderboards** - Join fitness communities and compete
- 📹 **Video Content** - Access workout videos and tutorials
- 📊 **Progress Tracking** - Monitor fitness goals and achievements
- 🔐 **Secure Auth** - Auth0 integration for user management

## Tech Stack

- **Frontend:** Angular 18, TypeScript, Angular Material, SCSS
- **Mobile:** Capacitor, Cordova plugins
- **Auth:** Auth0 JWT
- **Build:** Angular CLI, Capacitor CLI
- **Testing:** Karma, Jasmine
