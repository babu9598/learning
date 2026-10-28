import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen12DriverProfile extends StatelessWidget {
  const Screen12DriverProfile({super.key});

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
          'Driver Profile',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Profile Header Card (Figma Screen 12)
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
                            color: AppColors.oceanBlue.withOpacity(0.3),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Container(
                            width: 64,
                            height: 64,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Center(
                              child: Text('RK', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            driver.name,
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            'Driver ID: ${driver.driverCode}',
                            style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 12, fontWeight: FontWeight.w600),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.emeraldGreen.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.white.withOpacity(0.6)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.verified_rounded, color: Colors.white, size: 14),
                                const SizedBox(width: 4),
                                Text(
                                  'VERIFIED PARTNER',
                                  style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Menu Options (Figma Screen 12)
                    _buildProfileItem(
                      icon: Icons.folder_shared_rounded,
                      title: 'Documents',
                      subtitle: 'KYC, Licence, RC & Fitness Certificate',
                      onTap: () {
                        provider.setRegistrationStep(4);
                        provider.setScreen(3);
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildProfileItem(
                      icon: Icons.directions_car_filled_rounded,
                      title: 'Vehicle Details',
                      subtitle: '${driver.vehicleModel} • ${driver.vehicleNumber}',
                      onTap: () {
                        provider.setRegistrationStep(3);
                        provider.setScreen(3);
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildProfileItem(
                      icon: Icons.account_balance_rounded,
                      title: 'Bank Details',
                      subtitle: 'HDFC Bank • Instant daily settlements',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Bank settlement account verified.')),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildProfileItem(
                      icon: Icons.support_agent_rounded,
                      title: 'Support',
                      subtitle: '24x7 Driver Partner toll-free helpline',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Dialing 24x7 Partner Support: 1800-419-8800')),
                        );
                      },
                    ),
                    const SizedBox(height: 10),
                    _buildProfileItem(
                      icon: Icons.settings_rounded,
                      title: 'Settings',
                      subtitle: 'App preferences, notifications & language',
                      onTap: () {},
                    ),

                    const SizedBox(height: 20),

                    // Logout Button (Figma Screen 12)
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        onPressed: () => provider.logout(),
                        icon: const Icon(Icons.logout_rounded, color: AppColors.crimsonRed, size: 18),
                        label: Text(
                          'Logout',
                          style: GoogleFonts.plusJakartaSans(color: AppColors.crimsonRed, fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.crimsonRed, width: 1.2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
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
                  _buildNavItem(Icons.account_balance_wallet_rounded, 'Earnings', false, () => provider.setScreen(14)),
                  _buildNavItem(Icons.person_rounded, 'Profile', true, () => provider.setScreen(12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileItem({required IconData icon, required String title, required String subtitle, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.lightCard,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: AppColors.lightBorder),
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
                color: AppColors.oceanBlueLight,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.oceanBlue, size: 20),
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
            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textDark, size: 14),
          ],
        ),
      ),
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
