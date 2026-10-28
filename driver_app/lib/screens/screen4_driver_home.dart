import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/driver_provider.dart';

class Screen4DriverHome extends StatelessWidget {
  const Screen4DriverHome({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final driver = provider.driver;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Bar: Avatar, Greeting, Online/Offline Switch
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [AppColors.oceanBlue, AppColors.deepBlue],
                                ),
                                shape: BoxShape.circle,
                                border: Border.all(color: AppColors.cloudySky, width: 1.5),
                              ),
                              child: const Center(
                                child: Text(
                                  'RK',
                                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Hello, ${driver.name.split(' ')[0]}',
                                  style: GoogleFonts.plusJakartaSans(
                                    color: AppColors.textPrimary,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'Driver Partner',
                                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                      decoration: BoxDecoration(
                                        color: AppColors.emeraldGreenLight,
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.4)),
                                      ),
                                      child: Text(
                                        'VERIFIED',
                                        style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 8, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),

                        // Online / Offline Switch Pill (Figma Screen 4 style)
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppColors.lightSurface,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: AppColors.lightBorder),
                          ),
                          child: Row(
                            children: [
                              InkWell(
                                onTap: () => provider.toggleOnlineStatus(true),
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: driver.isOnline ? AppColors.emeraldGreen : Colors.transparent,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 6,
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: driver.isOnline ? Colors.white : AppColors.emeraldGreen,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Online',
                                        style: GoogleFonts.inter(
                                          color: driver.isOnline ? Colors.white : AppColors.textDark,
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              InkWell(
                                onTap: () => provider.toggleOnlineStatus(false),
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: !driver.isOnline ? AppColors.crimsonRed : Colors.transparent,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    'Offline',
                                    style: GoogleFonts.inter(
                                      color: !driver.isOnline ? Colors.white : AppColors.textDark,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Metrics Banner: Today's Earnings & Completed Rides
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.lightCard,
                              borderRadius: BorderRadius.circular(20),
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
                                Text('TODAY\'S EARNINGS', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                                const SizedBox(height: 4),
                                Text(
                                  '₹ ${driver.todayEarnings.toInt().toString()}',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.lightCard,
                              borderRadius: BorderRadius.circular(20),
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
                                Text('COMPLETED RIDES', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.6)),
                                const SizedBox(height: 4),
                                Text(
                                  '${driver.completedRides}',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 20, fontWeight: FontWeight.w900),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 22),

                    // Primary Service Mode Toggle (Drop Taxi vs Goods Truck)
                    Text(
                      'ACTIVE VEHICLE MODE',
                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                    ),
                    const SizedBox(height: 10),

                    Row(
                      children: [
                        // Drop Taxi Service Card
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              provider.updateServiceType(DriverServiceType.dropTaxi);
                              provider.toggleOnlineStatus(true);
                            },
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              height: 140,
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: driver.serviceType == DriverServiceType.dropTaxi ? AppColors.oceanBlue : AppColors.lightBorder,
                                  width: driver.serviceType == DriverServiceType.dropTaxi ? 2 : 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: driver.serviceType == DriverServiceType.dropTaxi ? AppColors.oceanBlue.withOpacity(0.12) : Colors.black.withOpacity(0.02),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppColors.oceanBlueLight,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(Icons.local_taxi_rounded, color: AppColors.oceanBlue, size: 24),
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('Drop Taxi', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
                                      Text('Passenger Ride', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(width: 12),

                        // Goods Truck Service Card
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              provider.updateServiceType(DriverServiceType.goodsTruck);
                              provider.toggleOnlineStatus(true);
                            },
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              height: 140,
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: driver.serviceType == DriverServiceType.goodsTruck ? AppColors.cargoGold : AppColors.lightBorder,
                                  width: driver.serviceType == DriverServiceType.goodsTruck ? 2 : 1,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: driver.serviceType == DriverServiceType.goodsTruck ? AppColors.cargoGold.withOpacity(0.12) : Colors.black.withOpacity(0.02),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: AppColors.cargoGoldLight,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(Icons.local_shipping_rounded, color: AppColors.cargoGold, size: 24),
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('Goods Truck', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
                                      Text('Cargo Transport', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Quick Action: Search for Incoming Rides Banner
                    InkWell(
                      onTap: () => provider.setScreen(5), // Online Mode
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.oceanBlueLight,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.cloudySky),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.oceanBlue.withOpacity(0.08),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlue,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(Icons.radar_rounded, color: Colors.white, size: 22),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Online Dispatch Radar',
                                    style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    'Waiting for new outstation & freight bookings',
                                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.oceanBlue, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Fixed Bottom Navigation Bar (Figma Screen 4)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.lightBorder)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(Icons.home_rounded, 'Home', true, () => provider.setScreen(4)),
                  _buildNavItem(Icons.receipt_long_rounded, 'My Orders', false, () => provider.setScreen(13)),
                  _buildNavItem(Icons.account_balance_wallet_rounded, 'Earnings', false, () => provider.setScreen(14)),
                  _buildNavItem(Icons.person_rounded, 'Profile', false, () => provider.setScreen(12)),
                ],
              ),
            ),
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
