import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/booking_provider.dart';

class Screen4TaxiSelection extends StatelessWidget {
  const Screen4TaxiSelection({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(3),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Select Drop Taxi',
              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              '${provider.pickupCity.split(',')[0]} ➔ ${provider.dropCity.split(',')[0]} (${provider.tripDistanceKm} km)',
              style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Top Route Banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: const BoxDecoration(
                color: AppColors.lightSurface,
                border: Border(bottom: BorderSide(color: AppColors.lightBorder)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        const Icon(Icons.verified_rounded, color: AppColors.emeraldGreen, size: 16),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            'One-Way Outstation Fare (No Return Charge)',
                            style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '~${provider.tripDuration}',
                    style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: AppConstants.taxiVehicles.length,
                itemBuilder: (context, index) {
                  final vehicle = AppConstants.taxiVehicles[index];
                  final isSelected = provider.selectedVehicle.id == vehicle.id;
                  final calculatedFare = (provider.tripDistanceKm * vehicle.ratePerKm * 0.75).round();

                  return GestureDetector(
                    onTap: () => provider.selectVehicle(vehicle),
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightCard,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
                          width: isSelected ? 2 : 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: isSelected ? AppColors.oceanBlue.withOpacity(0.15) : Colors.black.withOpacity(0.03),
                            blurRadius: isSelected ? 12 : 6,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 72,
                                height: 58,
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: isSelected ? AppColors.oceanBlueLight : AppColors.lightSurface,
                                  borderRadius: BorderRadius.circular(14),
                                  border: Border.all(color: isSelected ? AppColors.oceanBlue.withOpacity(0.4) : AppColors.lightBorder),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(10),
                                  child: Image.asset(
                                    vehicle.imageUrl,
                                    fit: BoxFit.contain,
                                    errorBuilder: (_, __, ___) => Center(
                                      child: Text(vehicle.iconEmoji, style: const TextStyle(fontSize: 26)),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Wrap(
                                      crossAxisAlignment: WrapCrossAlignment.center,
                                      spacing: 6,
                                      runSpacing: 4,
                                      children: [
                                        Text(
                                          vehicle.name,
                                          style: GoogleFonts.plusJakartaSans(
                                            color: AppColors.textPrimary,
                                            fontSize: 15,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                        if (vehicle.popular)
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: AppColors.oceanBlue,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              'POPULAR',
                                              style: GoogleFonts.inter(
                                                color: Colors.white,
                                                fontSize: 8,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        if (vehicle.bestValue)
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: AppColors.emeraldGreen,
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              'LUXURY',
                                              style: GoogleFonts.inter(
                                                color: Colors.white,
                                                fontSize: 8,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                      ],
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      vehicle.subtitle,
                                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                                    ),
                                    const SizedBox(height: 8),
                                    Wrap(
                                      spacing: 6,
                                      runSpacing: 4,
                                      children: [
                                        _buildSpecBadge(Icons.people_rounded, vehicle.capacitySeats ?? '4 Seats'),
                                        _buildSpecBadge(Icons.luggage_rounded, vehicle.capacityBags ?? '2 Bags'),
                                        _buildSpecBadge(Icons.ac_unit_rounded, 'AC'),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '₹$calculatedFare',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: AppColors.oceanBlue,
                                      fontSize: 17,
                                      fontWeight: FontWeight.w900,
                                    ),
                                  ),
                                  Text(
                                    '₹${vehicle.ratePerKm}/km',
                                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w600),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            // Bottom Continue CTA
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
                  onPressed: () => provider.setScreen(6), // Navigate to Booking Details
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 6,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Select ${provider.selectedVehicle.name} • ₹${provider.booking.baseFare}',
                        style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
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

  Widget _buildSpecBadge(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.lightSurface,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: AppColors.lightBorder),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AppColors.oceanBlue),
          const SizedBox(width: 4),
          Text(text, style: GoogleFonts.inter(color: AppColors.textSecondary, fontSize: 10, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
