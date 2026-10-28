import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/driver_provider.dart';

class Screen11AmountCollection extends StatefulWidget {
  const Screen11AmountCollection({super.key});

  @override
  State<Screen11AmountCollection> createState() => _Screen11AmountCollectionState();
}

class _Screen11AmountCollectionState extends State<Screen11AmountCollection> {
  PaymentMethodType selectedMethod = PaymentMethodType.cash;

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
          onPressed: () => provider.setScreen(10),
        ),
        title: Text(
          'Payment Details',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Amount to Collect Hero Card (Figma Screen 11)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [AppColors.oceanBlue, AppColors.deepBlue],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(22),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.oceanBlue.withOpacity(0.35),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'AMOUNT TO COLLECT',
                          style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '₹ ${request.finalAmount.toInt()}',
                          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Customer will pay you directly for this ride',
                          style: GoogleFonts.inter(color: AppColors.cloudySkyLight, fontSize: 11),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  Text(
                    'PAYMENT METHOD',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                  ),
                  const SizedBox(height: 10),

                  // Payment Options (Cash, UPI, Card - Figma Screen 11)
                  _buildMethodOption(
                    PaymentMethodType.cash,
                    'Cash',
                    'Physical cash received directly from rider',
                    Icons.money_rounded,
                  ),
                  const SizedBox(height: 10),
                  _buildMethodOption(
                    PaymentMethodType.upi,
                    'UPI',
                    'Direct UPI QR Code or PhonePe / Google Pay',
                    Icons.qr_code_2_rounded,
                  ),
                  const SizedBox(height: 10),
                  _buildMethodOption(
                    PaymentMethodType.card,
                    'Card',
                    'Card / In-app digital wallet settlement',
                    Icons.credit_card_rounded,
                  ),
                ],
              ),

              // Bottom Collect Payment Button (Figma Screen 11)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    provider.collectPayment(selectedMethod);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppColors.emeraldGreen,
                        content: Text('✅ ₹${request.finalAmount.toInt()} Collected & Added to Today\'s Earnings!'),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.emeraldGreen,
                    elevation: 4,
                    shadowColor: AppColors.emeraldGreen.withOpacity(0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Collect Payment (₹ ${request.finalAmount.toInt()})',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
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

  Widget _buildMethodOption(PaymentMethodType type, String title, String subtitle, IconData icon) {
    final isSelected = selectedMethod == type;

    return InkWell(
      onTap: () => setState(() => selectedMethod = type),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.oceanBlueLight : AppColors.lightCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: isSelected ? Colors.white : AppColors.lightSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: isSelected ? AppColors.oceanBlue : AppColors.textSecondary, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                  Text(subtitle, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                ],
              ),
            ),
            Icon(
              isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
              color: isSelected ? AppColors.oceanBlue : AppColors.textDark,
            ),
          ],
        ),
      ),
    );
  }
}
