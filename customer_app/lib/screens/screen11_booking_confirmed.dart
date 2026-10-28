import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen11BookingConfirmed extends StatelessWidget {
  const Screen11BookingConfirmed({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final booking = provider.booking;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  const SizedBox(height: 20),
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.emeraldGreenLight,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.emeraldGreen, width: 2),
                    ),
                    child: const Icon(Icons.check_rounded, color: AppColors.emeraldGreen, size: 44),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Booking Confirmed!',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Your trip has been booked and captain is en route.',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlueLight,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                    ),
                    child: Text(
                      'BOOKING ID: ${booking.bookingId}',
                      style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.lightBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlueLight,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.local_taxi_rounded, color: AppColors.oceanBlue, size: 20),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                '${booking.driver?.name ?? "Ramesh Kumar"} • ${booking.driver?.vehicleModel ?? "Toyota Etios"}',
                                style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                        const Divider(color: AppColors.lightBorder, height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Route', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                            Text(
                              '${provider.pickupCity.split(',')[0]} ➔ ${provider.dropCity.split(',')[0]}',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Bottom Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.startTrip(), // Go to Live Trip Tracking
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 4,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.navigation_rounded, color: Colors.white, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Track Ride on Live GPS',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
