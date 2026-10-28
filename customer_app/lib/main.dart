import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'constants/app_colors.dart';
import 'providers/booking_provider.dart';

// Screens 1 to 15
import 'screens/screen1_login.dart';
import 'screens/screen2_signup.dart';
import 'screens/screen3_home.dart';
import 'screens/screen4_taxi_selection.dart';
import 'screens/screen5_truck_selection.dart';
import 'screens/screen6_taxi_booking_details.dart';
import 'screens/screen7_truck_booking_details.dart';
import 'screens/screen8_searching_loading.dart';
import 'screens/screen9_driver_details_tracking.dart';
import 'screens/screen10_otp_sharing.dart';
import 'screens/screen11_booking_confirmed.dart';
import 'screens/screen12_live_trip_tracking.dart';
import 'screens/screen13_trip_completed.dart';
import 'screens/screen14_payment_option.dart';
import 'screens/screen15_payment_success_receipt.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => BookingProvider()),
      ],
      child: const VaaGoCustomerApp(),
    ),
  );
}

class VaaGoCustomerApp extends StatelessWidget {
  const VaaGoCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RideNLoad - Taxi + Goods Truck + More',
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
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: AppColors.textPrimary,
          elevation: 0,
          iconTheme: IconThemeData(color: AppColors.textPrimary),
        ),
      ),

      home: const MainScreenRouter(),
    );
  }
}

class MainScreenRouter extends StatelessWidget {
  const MainScreenRouter({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);

    switch (provider.currentScreen) {
      case 1:
        return const Screen1Login();
      case 2:
        return const Screen2Signup();
      case 3:
        return const Screen3Home();
      case 4:
        return const Screen4TaxiSelection();
      case 5:
        return const Screen5TruckSelection();
      case 6:
        return const Screen6TaxiBookingDetails();
      case 7:
        return const Screen7TruckBookingDetails();
      case 8:
        return const Screen8SearchingLoading();
      case 9:
        return const Screen9DriverDetailsTracking();
      case 10:
        return const Screen10OtpSharing();
      case 11:
        return const Screen11BookingConfirmed();
      case 12:
        return const Screen12LiveTripTracking();
      case 13:
        return const Screen13TripCompleted();
      case 14:
        return const Screen14PaymentOption();
      case 15:
        return const Screen15PaymentSuccessReceipt();
      default:
        return const Screen3Home();
    }
  }
}

