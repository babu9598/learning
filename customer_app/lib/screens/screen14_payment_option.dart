import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../models/booking_model.dart';
import '../providers/booking_provider.dart';

class Screen14PaymentOption extends StatefulWidget {
  const Screen14PaymentOption({super.key});

  @override
  State<Screen14PaymentOption> createState() => _Screen14PaymentOptionState();
}

class _Screen14PaymentOptionState extends State<Screen14PaymentOption> {
  PaymentMethod selectedMethod = PaymentMethod.upi;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final booking = provider.booking;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(13),
        ),
        title: Text(
          'Select Payment Method',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.oceanBlue, AppColors.deepBlue],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.oceanBlue.withOpacity(0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('TOTAL AMOUNT PAYABLE', style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                            const SizedBox(height: 2),
                            Text('₹${booking.finalFare}', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900)),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.lock_rounded, color: Colors.white, size: 12),
                              const SizedBox(width: 4),
                              Text('100% Encrypted', style: GoogleFonts.inter(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  _buildPaymentTile(PaymentMethod.upi, 'UPI (Google Pay, PhonePe, Paytm)', '⚡ Instant 1-Click Payment via UPI Apps'),
                  _buildPaymentTile(PaymentMethod.card, 'Credit / Debit Card', '💳 Visa, Mastercard, RuPay & Corporate Cards'),
                  _buildPaymentTile(PaymentMethod.wallet, 'DropTaxi Wallet (Balance: ₹${provider.walletBalance.toStringAsFixed(0)})', '👛 1-Tap Deduction with Cashback Points'),
                  _buildPaymentTile(PaymentMethod.cash, 'Cash to Driver', '💵 Pay physical cash upon reaching destination'),
                ],
              ),

              // Bottom Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.processPayment(selectedMethod), // Process payment & go to Receipt
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 4,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.verified_rounded, color: Colors.white, size: 18),
                      const SizedBox(width: 8),
                      Text(
                        'Pay ₹${booking.finalFare} Securely',
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

  Widget _buildPaymentTile(PaymentMethod method, String title, String subtitle) {
    final isSelected = selectedMethod == method;

    return GestureDetector(
      onTap: () => setState(() => selectedMethod = method),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.oceanBlueLight : AppColors.lightCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
            width: isSelected ? 1.8 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: isSelected ? AppColors.oceanBlue : AppColors.textDark, width: 2),
                color: isSelected ? AppColors.oceanBlue : Colors.transparent,
              ),
              child: isSelected
                  ? const Center(child: Icon(Icons.check, size: 13, color: Colors.white))
                  : null,
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
