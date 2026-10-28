import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen8SearchingLoading extends StatefulWidget {
  const Screen8SearchingLoading({super.key});

  @override
  State<Screen8SearchingLoading> createState() => _Screen8SearchingLoadingState();
}

class _Screen8SearchingLoadingState extends State<Screen8SearchingLoading> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();

    // Auto progress after 3.5 seconds
    Future.delayed(const Duration(milliseconds: 3500), () {
      if (mounted) {
        final provider = Provider.of<BookingProvider>(context, listen: false);
        provider.driverMatched();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Bar
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlueLight,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: AppColors.emeraldGreen,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'DISPATCH ENGINE LIVE',
                          style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                    onPressed: () => provider.setScreen(6),
                  ),
                ],
              ),

              // Center Radar Animation
              Column(
                children: [
                  AnimatedBuilder(
                    animation: _controller,
                    builder: (context, child) {
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 180 * (1 + _controller.value * 0.4),
                            height: 180 * (1 + _controller.value * 0.4),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppColors.oceanBlue.withOpacity(1 - _controller.value),
                                width: 2,
                              ),
                            ),
                          ),
                          Container(
                            width: 120,
                            height: 120,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3), width: 1.5),
                            ),
                          ),
                          Container(
                            width: 70,
                            height: 70,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: AppColors.oceanBlue,
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.oceanBlue.withOpacity(0.3),
                                  blurRadius: 16,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Icon(Icons.local_taxi_rounded, color: Colors.white, size: 32),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 30),
                  Text(
                    'Finding nearby driver...',
                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Broadcasting trip to verified captains within 5km radius.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildStagePill('Searching', true),
                      _buildDivider(true),
                      _buildStagePill('Connecting', true),
                      _buildDivider(true),
                      _buildStagePill('Confirming', true),
                    ],
                  ),
                ],
              ),

              // Bottom Instant Match Simulator Button
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => provider.driverMatched(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.oceanBlue,
                        elevation: 4,
                        shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.flash_on_rounded, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            'Connect Verified Driver Instantly',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextButton(
                    onPressed: () => provider.setScreen(3),
                    child: Text('Cancel Search', style: GoogleFonts.inter(color: AppColors.crimsonRed, fontSize: 13, fontWeight: FontWeight.w600)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStagePill(String title, bool active) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: active ? AppColors.oceanBlue : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        title,
        style: GoogleFonts.inter(color: active ? Colors.white : AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildDivider(bool active) {
    return Container(
      width: 16,
      height: 2,
      color: active ? AppColors.oceanBlue : AppColors.lightBorder,
    );
  }
}
