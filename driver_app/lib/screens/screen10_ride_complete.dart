import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen10RideComplete extends StatelessWidget {
  const Screen10RideComplete({super.key});

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

                  // Large Checkmark (Figma Screen 10)
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
                    child: const Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 48),
                  ),

                  const SizedBox(height: 18),

                  Text(
                    'Ride Completed',
                    style: GoogleFonts.plusJakartaSans(
                      color: AppColors.textPrimary,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Thank you for your safe trip delivery',
                    style: GoogleFonts.inter(
                      color: AppColors.textMuted,
                      fontSize: 13,
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Trip Summary Card (Figma Screen 10)
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
                        Row(
                          children: [
                            const Icon(Icons.person_outline_rounded, color: AppColors.oceanBlue, size: 20),
                            const SizedBox(width: 10),
                            Text(
                              request.customerName,
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),

                        const Divider(color: AppColors.lightBorder, height: 24),

                        // Route
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('From', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                            Text(request.pickupLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('To', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                            Text(request.dropLocation, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
                          ],
                        ),

                        const Divider(color: AppColors.lightBorder, height: 24),

                        // Fare Amount
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Fare Amount', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                            Text(
                              '₹ ${request.finalAmount.toInt()}',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 22, fontWeight: FontWeight.w900),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Bottom Actions: Collect Payment & Go to Home
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => provider.proceedToAmountCollection(), // Go to Amount Collection
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.oceanBlue,
                        elevation: 4,
                        shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Collect Payment (₹ ${request.finalAmount.toInt()})',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 8),
                          const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => provider.setScreen(4), // Go to Home
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.lightBorder),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Text(
                        'Go to Home',
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
