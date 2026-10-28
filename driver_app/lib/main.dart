import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'constants/app_colors.dart';
import 'providers/driver_provider.dart';

// 14 Driver Screens
import 'screens/screen1_driver_login.dart';
import 'screens/screen2_driver_signup.dart';
import 'screens/screen3_driver_registration.dart';
import 'screens/screen4_driver_home.dart';
import 'screens/screen5_driver_online_mode.dart';
import 'screens/screen6_booking_request.dart';
import 'screens/screen7_otp_accept.dart';
import 'screens/screen8_booking_confirmation.dart';
import 'screens/screen9_ride_live_location.dart';
import 'screens/screen10_ride_complete.dart';
import 'screens/screen11_amount_collection.dart';
import 'screens/screen12_driver_profile.dart';
import 'screens/screen13_my_orders.dart';
import 'screens/screen14_earnings.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => DriverProvider()),
      ],
      child: const VaaGoDriverApp(),
    ),
  );
}

class VaaGoDriverApp extends StatelessWidget {
  const VaaGoDriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RideNLoad Partner - Taxi + Goods Truck + More',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.lightCanvas,
        primaryColor: AppColors.oceanBlue,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
        colorScheme: const ColorScheme.light(
          primary: AppColors.oceanBlue,
          secondary: AppColors.cloudySkyDark,
          surface: AppColors.lightCard,
          surfaceContainerHighest: AppColors.lightSurface,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.textPrimary,
          elevation: 0,
          iconTheme: IconThemeData(color: AppColors.textPrimary),
        ),
      ),
      home: const DriverScreenRouter(),
    );
  }
}

class DriverScreenRouter extends StatelessWidget {
  const DriverScreenRouter({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);

    switch (provider.currentScreen) {
      case 1:
        return const Screen1DriverLogin();
      case 2:
        return const Screen2DriverSignup();
      case 3:
        return const Screen3DriverRegistration();
      case 4:
        return const Screen4DriverHome();
      case 5:
        return const Screen5DriverOnlineMode();
      case 6:
        return const Screen6BookingRequest();
      case 7:
        return const Screen7OtpAccept();
      case 8:
        return const Screen8BookingConfirmation();
      case 9:
        return const Screen9RideLiveLocation();
      case 10:
        return const Screen10RideComplete();
      case 11:
        return const Screen11AmountCollection();
      case 12:
        return const Screen12DriverProfile();
      case 13:
        return const Screen13MyOrders();
      case 14:
        return const Screen14Earnings();
      default:
        return const Screen4DriverHome();
    }
  }
}
