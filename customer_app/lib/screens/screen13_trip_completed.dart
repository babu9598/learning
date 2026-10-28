import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen13TripCompleted extends StatefulWidget {
  const Screen13TripCompleted({super.key});

  @override
  State<Screen13TripCompleted> createState() => _Screen13TripCompletedState();
}

class _Screen13TripCompletedState extends State<Screen13TripCompleted> {
  int rating = 5;

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
                  const SizedBox(height: 10),
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.emeraldGreenLight,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.emeraldGreen, width: 2),
                    ),
                    child: const Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 44),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Trip Completed Successfully!',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.w800),
                  ),
                  Text(
                    'Thank you for traveling with RideNLoad • Taxi + Goods Truck',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
                  ),
                  const SizedBox(height: 18),

                  // Route Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.lightBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.03),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('BOOKING ID', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold)),
                            Text(booking.bookingId, style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 13, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        Text(
                          '${provider.pickupCity.split(',')[0]} ➔ ${provider.dropCity.split(',')[0]}',
                          style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Fare Summary
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.4)),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.oceanBlue.withOpacity(0.06),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('FINAL FARE BREAKDOWN', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlueLight,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(booking.selectedVehicle.name, style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.bold)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildFareRow('Base One-Way Fare (${booking.distanceKm} km)', '₹${booking.baseFare}'),
                        const SizedBox(height: 6),
                        _buildFareRow('Toll & Highway Charges', '₹${booking.tollCharges}'),
                        const SizedBox(height: 6),
                        _buildFareRow('Driver Allowance & Tip', '₹${booking.driverTip}'),
                        const Divider(color: AppColors.lightBorder, height: 18),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Total Amount Payable', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                            Text('₹${booking.finalFare}', style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 20, fontWeight: FontWeight.w900)),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Driver Rating
                  Text('Rate your driver & trip experience', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12)),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [1, 2, 3, 4, 5].map((s) {
                      return IconButton(
                        icon: Icon(
                          s <= rating ? Icons.star_rounded : Icons.star_border_rounded,
                          color: AppColors.cargoGold,
                          size: 32,
                        ),
                        onPressed: () => setState(() => rating = s),
                      );
                    }).toList(),
                  ),
                ],
              ),

              // Bottom Proceed to Payment Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.setScreen(14), // Go to Payment Option
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
                        'Proceed to Payment (₹${booking.finalFare})',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.payment_rounded, color: Colors.white, size: 18),
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

  Widget _buildFareRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
