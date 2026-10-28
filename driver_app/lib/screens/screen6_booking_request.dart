import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen6BookingRequest extends StatelessWidget {
  const Screen6BookingRequest({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final request = provider.currentRequest;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.rejectBooking(),
        ),
        title: Text(
          'New Booking Request',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Map Canvas Simulation with Distance Overlay
            Expanded(
              child: Container(
                margin: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.lightBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Stack(
                  children: [
                    // Simulated Map Route Background
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                            ),
                            child: const Icon(Icons.map_rounded, color: AppColors.oceanBlue, size: 40),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Incoming Intercity Booking Route',
                            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'Pickup is ${request.pickupDistanceKm} km away from your location',
                            style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),

                    // Distance Pill (Figma Screen 6)
                    Positioned(
                      top: 14,
                      left: 14,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.oceanBlue,
                          borderRadius: BorderRadius.circular(16),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.oceanBlue.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.near_me_rounded, color: Colors.white, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '${request.pickupDistanceKm} km',
                              style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Route & Customer Card Container (Figma Screen 6)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
                border: Border(top: BorderSide(color: AppColors.lightBorder)),
              ),
              child: Column(
                children: [
                  // Pickup Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: AppColors.emeraldGreenLight,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.emeraldGreen, width: 2),
                        ),
                        child: const Icon(Icons.trip_origin_rounded, color: AppColors.emeraldGreen, size: 12),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('PICKUP LOCATION', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                            Text(request.pickupLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ],
                  ),

                  Container(
                    margin: const EdgeInsets.only(left: 11, top: 4, bottom: 4),
                    width: 2,
                    height: 18,
                    color: AppColors.lightBorder,
                  ),

                  // Drop Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: AppColors.crimsonRedLight,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.crimsonRed, width: 2),
                        ),
                        child: const Icon(Icons.location_on_rounded, color: AppColors.crimsonRed, size: 14),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('DROP LOCATION', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                            Text(request.dropLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const Divider(color: AppColors.lightBorder, height: 24),

                  // Approx Amount & Customer Contact
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('APPROX. AMOUNT', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                          const SizedBox(height: 2),
                          Text(
                            request.approxAmountRange,
                            style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 18, fontWeight: FontWeight.w900),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('CONTACT', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                              Text(request.customerPhone, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                            ],
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: AppColors.emeraldGreenLight,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.phone_rounded, color: AppColors.emeraldGreen, size: 18),
                          ),
                        ],
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Accept & Reject Action Buttons (Figma Screen 6)
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: 50,
                          child: ElevatedButton(
                            onPressed: () => provider.acceptBooking(),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.oceanBlue,
                              elevation: 4,
                              shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: Text(
                              'Accept',
                              style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: SizedBox(
                          height: 50,
                          child: OutlinedButton(
                            onPressed: () => provider.rejectBooking(),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppColors.crimsonRed, width: 1.2),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            child: Text(
                              'Reject',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.crimsonRed, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
