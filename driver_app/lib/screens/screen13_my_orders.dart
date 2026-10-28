import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/driver_provider.dart';

class Screen13MyOrders extends StatefulWidget {
  const Screen13MyOrders({super.key});

  @override
  State<Screen13MyOrders> createState() => _Screen13MyOrdersState();
}

class _Screen13MyOrdersState extends State<Screen13MyOrders> {
  OrderStatus selectedTab = OrderStatus.all;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final orders = provider.orders;

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
          'My Orders',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter Tabs (All, Completed, Ongoing, Cancelled - Figma Screen 13)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              color: Colors.white,
              child: Row(
                children: [
                  _buildFilterTab(OrderStatus.all, 'All'),
                  const SizedBox(width: 8),
                  _buildFilterTab(OrderStatus.completed, 'Completed'),
                  const SizedBox(width: 8),
                  _buildFilterTab(OrderStatus.ongoing, 'Ongoing'),
                  const SizedBox(width: 8),
                  _buildFilterTab(OrderStatus.cancelled, 'Cancelled'),
                ],
              ),
            ),

            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  final isGoods = order['isGoods'] as bool? ?? false;

                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
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
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: isGoods ? AppColors.cargoGoldLight : AppColors.oceanBlueLight,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(
                                      isGoods ? Icons.local_shipping_rounded : Icons.local_taxi_rounded,
                                      color: isGoods ? AppColors.cargoGold : AppColors.oceanBlue,
                                      size: 18,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          order['orderId'] as String,
                                          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                                        ),
                                        Text(
                                          '${order['pickup']} ➔ ${order['drop']}',
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              order['amount'] as String,
                              style: GoogleFonts.plusJakartaSans(
                                color: isGoods ? AppColors.cargoGold : AppColors.oceanBlue,
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),

                        const Divider(color: AppColors.lightBorder, height: 20),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              order['date'] as String,
                              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.emeraldGreenLight,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 12),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Completed',
                                    style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 10, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                },
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
                  _buildNavItem(Icons.receipt_long_rounded, 'My Orders', true, () => provider.setScreen(13)),
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

  Widget _buildFilterTab(OrderStatus status, String label) {
    final isSelected = selectedTab == status;

    return Expanded(
      child: InkWell(
        onTap: () => setState(() => selectedTab = status),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.oceanBlue : AppColors.lightSurface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(
              color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.inter(
                color: isSelected ? Colors.white : AppColors.textSecondary,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
            ),
          ),
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
