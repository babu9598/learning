import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/booking_provider.dart';

class Screen7TruckBookingDetails extends StatefulWidget {
  const Screen7TruckBookingDetails({super.key});

  @override
  State<Screen7TruckBookingDetails> createState() => _Screen7TruckBookingDetailsState();
}

class _Screen7TruckBookingDetailsState extends State<Screen7TruckBookingDetails> {
  String selectedGoods = AppConstants.goodsTypes[0];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final booking = provider.booking;
    final truck = booking.selectedVehicle;
    final fare = provider.getTruckFare(truck);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(5),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Freight Logistics Details',
              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w800),
            ),
            Text(
              'Intercity Goods Movement',
              style: GoogleFonts.plusJakartaSans(color: AppColors.cargoGold, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Dynamic Pickup & Drop Hub Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightCard,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.lightBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  color: AppColors.cargoGoldLight,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.cargoGold, width: 2),
                                ),
                                child: const Icon(Icons.warehouse_rounded, color: AppColors.cargoGold, size: 14),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('LOADING HUB', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                                    const SizedBox(height: 2),
                                    Text('${provider.pickupCity} Industrial Logistics Yard', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          Container(
                            margin: const EdgeInsets.only(left: 13, top: 4, bottom: 4),
                            width: 2,
                            height: 20,
                            color: AppColors.lightBorder,
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 28,
                                height: 28,
                                decoration: BoxDecoration(
                                  color: AppColors.emeraldGreenLight,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.emeraldGreen, width: 2),
                                ),
                                child: const Icon(Icons.place_rounded, color: AppColors.emeraldGreen, size: 16),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('UNLOADING DESTINATION', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                                    const SizedBox(height: 2),
                                    Text('${provider.dropCity} Commercial Terminal', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Goods Type Selector
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
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('CARGO / GOODS CATEGORY', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                          const SizedBox(height: 6),
                          DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: selectedGoods,
                              isExpanded: true,
                              dropdownColor: AppColors.lightCard,
                              icon: const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.textSecondary),
                              items: AppConstants.goodsTypes.map((type) {
                                return DropdownMenuItem<String>(
                                  value: type,
                                  child: Row(
                                    children: [
                                      const Icon(Icons.inventory_2_rounded, color: AppColors.cargoGold, size: 16),
                                      const SizedBox(width: 10),
                                      Text(type, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                                    ],
                                  ),
                                );
                              }).toList(),
                              onChanged: (val) {
                                if (val != null) setState(() => selectedGoods = val);
                              },
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Freight Vehicle Specs
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
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: AppColors.cargoGoldLight,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.cargoGold.withOpacity(0.4)),
                            ),
                            child: const Center(
                              child: Icon(Icons.local_shipping_rounded, color: AppColors.cargoGold, size: 28),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(truck.name, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w700)),
                                Text('Max Payload: ${truck.payloadCapacity ?? '1.5 Tons'} • ${truck.subtitle}', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppColors.cargoGoldLight,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.cargoGold.withOpacity(0.4)),
                            ),
                            child: Text(
                              '₹${truck.ratePerKm}/km',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.cargoGold, fontSize: 11, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Route & Cargo Fare Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightCard,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.cargoGold.withOpacity(0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.cargoGold.withOpacity(0.08),
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
                              Text('Freight Estimate (${provider.tripDistanceKm} km)', style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600)),
                              Text('₹$fare', style: GoogleFonts.plusJakartaSans(color: AppColors.cargoGold, fontSize: 22, fontWeight: FontWeight.w900)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Includes transit insurance, live GPS seal tracking, and fast-track highway toll access.',
                            style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom CTA
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: AppColors.lightBorder)),
              ),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.startSearching(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.cargoGold,
                    elevation: 4,
                    shadowColor: AppColors.cargoGold.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Dispatch Logistics Truck',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w800),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
