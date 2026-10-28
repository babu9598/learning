import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen14Earnings extends StatefulWidget {
  const Screen14Earnings({super.key});

  @override
  State<Screen14Earnings> createState() => _Screen14EarningsState();
}

class _Screen14EarningsState extends State<Screen14Earnings> {
  String selectedFilter = '7 Days';

  final List<Map<String, dynamic>> _chartData = [
    {'day': '6 Sep', 'amount': 1200.0, 'height': 50.0},
    {'day': '7 Sep', 'amount': 1800.0, 'height': 75.0},
    {'day': '8 Sep', 'amount': 1500.0, 'height': 60.0},
    {'day': '9 Sep', 'amount': 2100.0, 'height': 90.0},
    {'day': '10 Sep', 'amount': 1400.0, 'height': 55.0},
    {'day': '11 Sep', 'amount': 2300.0, 'height': 95.0},
    {'day': '12 Sep', 'amount': 2180.0, 'height': 88.0},
  ];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final driver = provider.driver;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(4),
        ),
        title: Text(
          'Earnings Dashboard',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Total Earnings Hero Card (Figma Screen 14)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
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
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'TOTAL EARNINGS',
                                style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text('1 Sep – 12 Sep', style: GoogleFonts.inter(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w600)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '₹ ${driver.totalEarnings.toInt()}',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900),
                          ),
                          const SizedBox(height: 14),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildMiniStat('Today', '₹ ${driver.todayEarnings.toInt()}'),
                              _buildMiniStat('Completed', '${driver.completedRides} rides'),
                              _buildMiniStat('Pending', '₹ ${driver.pendingAmount.toInt()}'),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Filter Pills (7 Days, 30 Days, Custom - Figma Screen 14)
                    Row(
                      children: ['7 Days', '30 Days', 'Custom'].map((filter) {
                        final isSel = selectedFilter == filter;

                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: ChoiceChip(
                            label: Text(
                              filter,
                              style: GoogleFonts.inter(
                                color: isSel ? Colors.white : AppColors.textPrimary,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            selected: isSel,
                            selectedColor: AppColors.oceanBlue,
                            backgroundColor: AppColors.lightCard,
                            side: BorderSide(color: isSel ? AppColors.oceanBlue : AppColors.lightBorder),
                            onSelected: (_) => setState(() => selectedFilter = filter),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 16),

                    // Weekly Bar Chart Container (Figma Screen 14)
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
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'WEEKLY PERFORMANCE',
                                style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                              ),
                              Text(
                                'Avg: ₹ 1,780/day',
                                style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),

                          // Interactive Bars
                          SizedBox(
                            height: 140,
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: _chartData.map((item) {
                                final isHighest = item['day'] == '11 Sep';

                                return Column(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: [
                                    Text(
                                      '₹${(item['amount'] as double).toInt()}',
                                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.w600),
                                    ),
                                    const SizedBox(height: 6),
                                    Container(
                                      width: 22,
                                      height: item['height'] as double,
                                      decoration: BoxDecoration(
                                        color: isHighest ? AppColors.oceanBlue : AppColors.cloudySkyDark,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      item['day'] as String,
                                      style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 10, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                );
                              }).toList(),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Daily Payout Action
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              backgroundColor: AppColors.oceanBlue,
                              content: Text('Instant Payout of ₹1,250 transferred to linked HDFC Bank account!'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.account_balance_wallet_rounded, color: Colors.white, size: 18),
                        label: Text(
                          'Request Daily Payout',
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
                  ],
                ),
              ),
            ),

            // Fixed Bottom Navigation Bar
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.lightBorder)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(Icons.home_rounded, 'Home', false, () => provider.setScreen(4)),
                  _buildNavItem(Icons.receipt_long_rounded, 'My Orders', false, () => provider.setScreen(13)),
                  _buildNavItem(Icons.account_balance_wallet_rounded, 'Earnings', true, () => provider.setScreen(14)),
                  _buildNavItem(Icons.person_rounded, 'Profile', false, () => provider.setScreen(12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniStat(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 10)),
        Text(value, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: active ? AppColors.oceanBlue : AppColors.textMuted, size: 22),
            const SizedBox(height: 3),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                color: active ? AppColors.oceanBlue : AppColors.textMuted,
                fontSize: 10,
                fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
