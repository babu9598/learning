import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen6TaxiBookingDetails extends StatelessWidget {
  const Screen6TaxiBookingDetails({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final booking = provider.booking;
    final vehicle = booking.selectedVehicle;
    final fare = provider.getTaxiFare(vehicle);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(4),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Trip Summary & Confirmation',
              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w800),
            ),
            Text(
              'One-Way Guaranteed Rate',
              style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w600),
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
                    // Dynamic Pickup & Drop Card
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
                                  color: AppColors.emeraldGreenLight,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.emeraldGreen, width: 2),
                                ),
                                child: const Icon(Icons.trip_origin_rounded, color: AppColors.emeraldGreen, size: 14),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('PICK-UP HUB', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                                    const SizedBox(height: 2),
                                    Text('${provider.pickupCity}, South Zone', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
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
                                  color: AppColors.crimsonRedLight,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppColors.crimsonRed, width: 2),
                                ),
                                child: const Icon(Icons.location_on_rounded, color: AppColors.crimsonRed, size: 16),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('DESTINATION DROP HUB', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                                    const SizedBox(height: 2),
                                    Text('${provider.dropCity}, City Center', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Route Distance & Duration Ribbon
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.oceanBlueLight,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.cloudySky),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMetric(Icons.route_rounded, 'Distance', '${provider.tripDistanceKm} km'),
                          Container(width: 1, height: 32, color: AppColors.cloudySky),
                          _buildMetric(Icons.schedule_rounded, 'Est. Time', provider.tripDuration),
                          Container(width: 1, height: 32, color: AppColors.cloudySky),
                          _buildMetric(Icons.verified_user_rounded, 'Trip Safety', 'Live SOS 24/7'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Selected Vehicle Card
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
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.circular(14),
                              border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                            ),
                            child: const Center(
                              child: Icon(Icons.local_taxi_rounded, color: AppColors.oceanBlue, size: 28),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(vehicle.name, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w700)),
                                Text('${vehicle.capacitySeats} • Clean AC Cabin • Experienced Captain', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                            ),
                            child: Text(
                              '₹${vehicle.ratePerKm}/km',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Fare Breakdown Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightCard,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AppColors.oceanBlue.withOpacity(0.4)),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.oceanBlue.withOpacity(0.06),
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
                              Text('Total Estimated Fare', style: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600)),
                              Text(
                                '₹$fare',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 22, fontWeight: FontWeight.w900),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          _buildFareRow('Base Rate (${provider.tripDistanceKm} km × ₹${vehicle.ratePerKm})', '₹${provider.tripDistanceKm * vehicle.ratePerKm}'),
                          const SizedBox(height: 4),
                          _buildFareRow('Driver Allowance & Bata', 'Included (₹0)'),
                          const SizedBox(height: 4),
                          _buildFareRow('Tolls & State Permit', 'Included'),
                          const Divider(color: AppColors.lightBorder, height: 20),
                          Row(
                            children: [
                              const Icon(Icons.check_circle_outline_rounded, color: AppColors.emeraldGreen, size: 16),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'Guaranteed 1-way billing. No hidden return fare charged.',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.emeraldGreen, fontSize: 11, fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Bottom Book Now Button
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
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 4,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Confirm & Book Ride',
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

  Widget _buildMetric(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: AppColors.oceanBlue, size: 18),
        const SizedBox(height: 4),
        Text(label, style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        Text(value, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w800)),
      ],
    );
  }

  Widget _buildFareRow(String label, String amount) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11)),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            amount,
            textAlign: TextAlign.right,
            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
