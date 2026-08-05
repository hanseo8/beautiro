# Beautiro Mobile (Expo)

Native companion app for the Beautiro web platform. It uses the same PostgreSQL-backed API as https://www.beautiro.com.

## Features

- Email/password sign up and login
- Google sign-in via system browser
- Consultation booking
- Booking history for logged-in users
- Secure session storage with Expo SecureStore

## Setup

```bash
cd mobile
npm install
```

Create `.env` if needed:

```env
EXPO_PUBLIC_API_URL=https://www.beautiro.com
```

For local API testing against `npm run dev`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
```

## Run

```bash
npm run start
```

Then press `i` for iOS simulator or `a` for Android emulator.

## Google sign-in on mobile

The app opens the web Google OAuth flow in the device browser. After login, return to the app and log in with email/password, or extend deep-link handling with the `beautiro://` scheme later.

## Build

Use EAS Build when ready for App Store / Play Store distribution:

```bash
npx eas-cli build --platform all
```
