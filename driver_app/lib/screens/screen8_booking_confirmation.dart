import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen8BookingConfirmation extends StatelessWidget {
  const Screen8BookingConfirmation({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final request = provider.currentRequest;

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

                  // Success Checkmark Icon (Figma Screen 8)
                  Container(
                    width: 76,
                    height: 76,
                    decoration: BoxDecoration(
                      color: AppColors.emeraldGreenLight,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.emeraldGreen, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.emeraldGreen.withOpacity(0.2),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.check_rounded, color: AppColors.emeraldGreen, size: 48),
                  ),

                  const SizedBox(height: 18),

                  Text(
                    'Booking Confirmed',
                    style: GoogleFonts.plusJakartaSans(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Ride has been accepted & verified successfully',
                    style: GoogleFonts.inter(
                      color: AppColors.textMuted,
                      fontSize: 13,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Customer Details Card (Figma Screen 8)
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(22),
                      border: Border.all(color: AppColors.lightBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Customer Profile Header
                        Row(
                          children: [
                            Container(
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlueLight,
                                shape: BoxShape.circle,
                                border: Border.all(color: AppColors.cloudySky),
                              ),
                              child: const Center(
                                child: Icon(Icons.person_rounded, color: AppColors.oceanBlue, size: 24),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    request.customerName,
                                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    request.customerPhone,
                                    style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: AppColors.emeraldGreenLight,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'RIDER VERIFIED',
                                style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 9, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),

                        const Divider(color: AppColors.lightBorder, height: 26),

                        // Route Details
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              margin: const EdgeInsets.only(top: 3),
                              decoration: const BoxDecoration(color: AppColors.emeraldGreen, shape: BoxShape.circle),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('PICKUP', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold)),
                                  Text(request.pickupLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                          ],
                        ),

                        Container(
                          margin: const EdgeInsets.only(left: 4, top: 4, bottom: 4),
                          width: 2,
                          height: 16,
                          color: AppColors.lightBorder,
                        ),

                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 10,
                              height: 10,
                              margin: const EdgeInsets.only(top: 3),
                              decoration: const BoxDecoration(color: AppColors.crimsonRed, shape: BoxShape.circle),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('DROP', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold)),
                                  Text(request.dropLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const Divider(color: AppColors.lightBorder, height: 26),

                        // Vehicle & Approx Fare
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.drive_eta_rounded, color: AppColors.oceanBlue, size: 18),
                                const SizedBox(width: 6),
                                Text(
                                  request.vehicleLabel,
                                  style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('APPROX. FARE', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                                Text(
                                  request.approxAmountRange,
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 15, fontWeight: FontWeight.w900),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Bottom Start Live Trip CTA Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.startLiveTrip(), // Go to Live Location Navigation
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 4,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Start Live Trip Navigation',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.navigation_rounded, color: Colors.white, size: 18),
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
