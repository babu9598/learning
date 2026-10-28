# 📱 RideNLoad - Customer Mobile App (Flutter)

A cross-platform **Flutter & Dart** mobile application for **RideNLoad** (DropTaxi & Goods Truck - iOS & Android), implementing all **15 screens** matching the official Figma design system.

---

## 🎨 Complete 15-Screen Architecture

| # | Screen File | Description |
|---|---|---|
| **1** | [`screen1_login.dart`](lib/screens/screen1_login.dart) | Login with +91 phone number, Google & Apple OAuth buttons |
| **2** | [`screen2_signup.dart`](lib/screens/screen2_signup.dart) | Account registration (Name, Phone, Email) |
| **3** | [`screen3_home.dart`](lib/screens/screen3_home.dart) | Home dashboard with Drop Taxi & Goods Truck hero cards |
| **4** | [`screen4_taxi_selection.dart`](lib/screens/screen4_taxi_selection.dart) | Sedan, SUV, Innova, Mini vehicle selection |
| **5** | [`screen5_truck_selection.dart`](lib/screens/screen5_truck_selection.dart) | 3-Wheeler, Tata ACE, Pickups (8ft/9ft/17ft), Tata 407 |
| **6** | [`screen6_taxi_booking_details.dart`](lib/screens/screen6_taxi_booking_details.dart) | Route summary (494 km, 7h 30m), fare range (₹3,200–3,800) |
| **7** | [`screen7_truck_booking_details.dart`](lib/screens/screen7_truck_booking_details.dart) | Goods category selector, route summary, calculated fare |
| **8** | [`screen8_searching_loading.dart`](lib/screens/screen8_searching_loading.dart) | Animated radar sweep & driver broadcast simulation |
| **9** | [`screen9_driver_details_tracking.dart`](lib/screens/screen9_driver_details_tracking.dart) | Driver card (Ramesh Kumar ⭐4.8), ETA 12 min, Call/Chat |
| **10** | [`screen10_otp_sharing.dart`](lib/screens/screen10_otp_sharing.dart) | 4-Digit OTP security code display (`[1][2][3][4]`) |
| **11** | [`screen11_booking_confirmed.dart`](lib/screens/screen11_booking_confirmed.dart) | Booking confirmation (#DT256789) & summary |
| **12** | [`screen12_live_trip_tracking.dart`](lib/screens/screen12_live_trip_tracking.dart) | Live highway navigation, ETA (2h 15m), SOS button |
| **13** | [`screen13_trip_completed.dart`](lib/screens/screen13_trip_completed.dart) | Fare Summary (Base ₹3,200 + Tolls ₹200 + Tip ₹100 = ₹3,500) |
| **14** | [`screen14_payment_option.dart`](lib/screens/screen14_payment_option.dart) | Payment selection (UPI, Card, Cash, Wallet) |
| **15** | [`screen15_payment_success_receipt.dart`](lib/screens/screen15_payment_success_receipt.dart) | Payment success, Txn ID, Download & Share receipt |

---

## 🚀 How to Run the Flutter App

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.0.0 or higher)
- Android Studio / Xcode / VS Code

### 1. Install Dependencies
```bash
cd flutter_customer_app
flutter pub get
```

### 2. Run on Android Device / Emulator
```bash
flutter run -d android
```

### 3. Run on iOS Simulator / iPhone (macOS)
```bash
flutter run -d ios
```

### 4. Run in Chrome / Web
```bash
flutter run -d chrome
```

---

## 📂 Project Structure

```
flutter_customer_app/
├── lib/
│   ├── constants/
│   │   ├── app_colors.dart         # Ocean Blue, Navy Dark, Emerald, Amber tokens
│   │   └── app_constants.dart      # Taxi & Truck catalogs, mock drivers & data
│   ├── models/
│   │   ├── booking_model.dart      # Complete booking state model
│   │   ├── driver_model.dart       # Driver profile model
│   │   └── vehicle_model.dart      # Vehicle specifications model
│   ├── providers/
│   │   └── booking_provider.dart   # Central Provider state management
│   ├── screens/                    # All 15 Screen implementations
│   │   ├── screen1_login.dart
│   │   ├── screen2_signup.dart
│   │   ├── screen3_home.dart
│   │   ├── screen4_taxi_selection.dart
│   │   ├── screen5_truck_selection.dart
│   │   ├── screen6_taxi_booking_details.dart
│   │   ├── screen7_truck_booking_details.dart
│   │   ├── screen8_searching_loading.dart
│   │   ├── screen9_driver_details_tracking.dart
│   │   ├── screen10_otp_sharing.dart
│   │   ├── screen11_booking_confirmed.dart
│   │   ├── screen12_live_trip_tracking.dart
│   │   ├── screen13_trip_completed.dart
│   │   ├── screen14_payment_option.dart
│   │   └── screen15_payment_success_receipt.dart
│   └── main.dart                   # App entry point, Theme & Screen Router
└── pubspec.yaml                    # Flutter dependencies & assets config
```
