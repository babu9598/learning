import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../models/vehicle_model.dart';
import '../providers/booking_provider.dart';

class Screen15PaymentSuccessReceipt extends StatelessWidget {
  const Screen15PaymentSuccessReceipt({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final booking = provider.booking;
    final isGoods = provider.serviceType == ServiceType.goodsTruck;
    final totalFare = isGoods ? provider.getTruckFare(booking.selectedVehicle) : provider.getTaxiFare(booking.selectedVehicle);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  const SizedBox(height: 12),
                  // Glowing Success Icon
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.emeraldGreenLight,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.emeraldGreen, width: 2),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.emeraldGreen.withOpacity(0.2),
                          blurRadius: 16,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: const Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 44),
                  ),
                  const SizedBox(height: 14),
                  Text(
                    'Payment Successful!',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Your official digital tax invoice has been generated.',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 12),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlueLight,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                    ),
                    child: Text(
                      'Txn ID: ${booking.transactionId ?? 'UPI9920194821'}',
                      style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Digital Invoice Card
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(20),
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
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'OFFICIAL TRIP RECEIPT',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.8),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.emeraldGreenLight,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.3)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.verified_rounded, color: AppColors.emeraldGreen, size: 12),
                                  const SizedBox(width: 4),
                                  Text('PAID & VERIFIED', style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 9, fontWeight: FontWeight.w800)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _buildRow('Passenger / Consignor', provider.userName),
                        const SizedBox(height: 6),
                        _buildRow('Intercity Route', '${provider.pickupCity} ➔ ${provider.dropCity}'),
                        const SizedBox(height: 6),
                        _buildRow('Service Type', isGoods ? 'Logistics Freight • ${booking.selectedVehicle.name}' : 'Drop Taxi • ${booking.selectedVehicle.name}'),
                        const SizedBox(height: 6),
                        _buildRow('Billed Distance', '${provider.tripDistanceKm} km'),
                        const SizedBox(height: 6),
                        _buildRow('Payment Mode', 'Instant UPI / Wallet Auto-debit'),
                        const Divider(color: AppColors.lightBorder, height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('Total Amount Paid', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w700)),
                            Text('₹$totalFare', style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 20, fontWeight: FontWeight.w900)),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Bottom Actions
              Column(
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Tax invoice downloaded successfully to Downloads!'),
                                backgroundColor: AppColors.oceanBlue,
                              ),
                            );
                          },
                          icon: const Icon(Icons.download_rounded, size: 18, color: AppColors.oceanBlue),
                          label: Text('Download PDF', style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.w700)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.lightBorder),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Invoice link copied to clipboard for sharing!'),
                                backgroundColor: AppColors.oceanBlue,
                              ),
                            );
                          },
                          icon: const Icon(Icons.share_rounded, size: 18, color: AppColors.oceanBlue),
                          label: Text('Share Invoice', style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.w700)),
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: AppColors.lightBorder),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => provider.resetToHome(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.oceanBlue,
                        elevation: 4,
                        shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Text(
                        'Return to Dashboard',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w800),
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

  Widget _buildRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w500)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w700),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
