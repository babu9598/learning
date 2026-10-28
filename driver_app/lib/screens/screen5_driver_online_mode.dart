import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/driver_provider.dart';

class Screen5DriverOnlineMode extends StatefulWidget {
  const Screen5DriverOnlineMode({super.key});

  @override
  State<Screen5DriverOnlineMode> createState() => _Screen5DriverOnlineModeState();
}

class _Screen5DriverOnlineModeState extends State<Screen5DriverOnlineMode> with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();

    // Auto-trigger sample incoming booking request after 3.5 seconds
    Future.delayed(const Duration(milliseconds: 3500), () {
      if (mounted) {
        final provider = Provider.of<DriverProvider>(context, listen: false);
        if (provider.currentScreen == 5) {
          provider.triggerNewBookingRequest();
        }
      }
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(4),
        ),
        title: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
          decoration: BoxDecoration(
            color: AppColors.emeraldGreenLight,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.4)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.emeraldGreen, shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Text(
                'Online',
                style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Title & Radar Graphic
              Column(
                children: [
                  const SizedBox(height: 10),
                  Text(
                    'You are online.',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Waiting for bookings in your area...',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 36),

                  // Radar Pulse Graphic (Figma Screen 5)
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 170 * (1 + _pulseController.value * 0.35),
                            height: 170 * (1 + _pulseController.value * 0.35),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.oceanBlue.withOpacity(1 - _pulseController.value),
                                width: 2,
                              ),
                            ),
                          ),
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.oceanBlueLight,
                              border: Border.all(color: AppColors.cloudySky),
                            ),
                          ),
                          Container(
                            width: 76,
                            height: 76,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.oceanBlue,
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.oceanBlue.withOpacity(0.35),
                                  blurRadius: 16,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Icon(
                                provider.driver.serviceType == DriverServiceType.goodsTruck ? Icons.local_shipping_rounded : Icons.local_taxi_rounded,
                                color: Colors.white,
                                size: 36,
                              ),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),

              // 3 Steps Guide (Figma Screen 5)
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(22),
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
                    _buildStepRow(Icons.notifications_active_rounded, '1', 'Get Ride Requests', 'Real-time outstation bookings'),
                    const Divider(color: AppColors.lightBorder, height: 20),
                    _buildStepRow(Icons.check_circle_outline_rounded, '2', 'Accept the Ride', 'Verify route and customer details'),
                    const Divider(color: AppColors.lightBorder, height: 20),
                    _buildStepRow(Icons.payments_outlined, '3', 'Earn More', 'Guaranteed one-way fare + instant payout'),
                  ],
                ),
              ),

              // Bottom Actions: Trigger Request & Go Offline
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      onPressed: () => provider.triggerNewBookingRequest(),
                      icon: const Icon(Icons.flash_on_rounded, color: Colors.white, size: 18),
                      label: Text(
                        'Simulate Incoming Booking Request',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.oceanBlue,
                        elevation: 4,
                        shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: OutlinedButton(
                      onPressed: () => provider.toggleOnlineStatus(false),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.crimsonRed, width: 1.2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Text(
                        'Go Offline',
                        style: GoogleFonts.plusJakartaSans(color: AppColors.crimsonRed, fontSize: 14, fontWeight: FontWeight.bold),
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

  Widget _buildStepRow(IconData icon, String num, String title, String subtitle) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: const BoxDecoration(
            color: AppColors.oceanBlueLight,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(num, style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontWeight: FontWeight.bold, fontSize: 14)),
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
              Text(subtitle, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
            ],
          ),
        ),
        Icon(icon, color: AppColors.oceanBlue, size: 20),
      ],
    );
  }
}
