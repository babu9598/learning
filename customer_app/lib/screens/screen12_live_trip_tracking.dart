import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen12LiveTripTracking extends StatefulWidget {
  const Screen12LiveTripTracking({super.key});

  @override
  State<Screen12LiveTripTracking> createState() => _Screen12LiveTripTrackingState();
}

class _Screen12LiveTripTrackingState extends State<Screen12LiveTripTracking> {
  final MapController _mapController = MapController();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final driver = provider.booking.driver;

    final driverPos = LatLng(provider.driverLat, provider.driverLng);
    final pickupPos = LatLng(provider.pickupLat, provider.pickupLng);
    final dropPos = LatLng(provider.dropLat, provider.dropLng);

    final highwayRoute = [
      pickupPos,
      LatLng((pickupPos.latitude + dropPos.latitude) / 2 + 0.05, (pickupPos.longitude + dropPos.longitude) / 2 - 0.04),
      dropPos,
    ];

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(11),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Live In-Ride Tracking', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
            Text('En route to ${provider.dropCity.split(',')[0]}', style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 11, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Interactive Highway Live Map
            Expanded(
              child: Stack(
                children: [
                  FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: driverPos,
                      initialZoom: 12.0,
                      interactionOptions: const InteractionOptions(
                        flags: InteractiveFlag.all,
                      ),
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.vaago.customer',
                        maxZoom: 19,
                      ),
                      PolylineLayer(
                        polylines: [
                          Polyline(
                            points: highwayRoute,
                            strokeWidth: 5.0,
                            color: AppColors.oceanBlue,
                          ),
                        ],
                      ),
                      MarkerLayer(
                        markers: [
                          // Destination Pin
                          Marker(
                            point: dropPos,
                            width: 44,
                            height: 44,
                            child: const Column(
                              children: [
                                Icon(Icons.location_on_rounded, color: AppColors.crimsonRed, size: 34),
                              ],
                            ),
                          ),
                          // Moving Vehicle Marker
                          Marker(
                            point: driverPos,
                            width: 48,
                            height: 48,
                            child: Container(
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlue,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 3),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.oceanBlue.withOpacity(0.4),
                                    blurRadius: 10,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: const Icon(Icons.navigation_rounded, color: Colors.white, size: 24),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  // Floating Speed & ETA Pill
                  Positioned(
                    top: 14,
                    left: 14,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.95),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.lightBorder),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.speed_rounded, color: AppColors.oceanBlue, size: 16),
                          const SizedBox(width: 6),
                          Text(
                            '${provider.driverSpeed.toStringAsFixed(0)} km/h • ETA: ${provider.tripDuration}',
                            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Recenter Button
                  Positioned(
                    top: 14,
                    right: 14,
                    child: FloatingActionButton.small(
                      backgroundColor: Colors.white,
                      onPressed: () {
                        _mapController.move(driverPos, 13.0);
                      },
                      child: const Icon(Icons.my_location_rounded, color: AppColors.oceanBlue),
                    ),
                  ),
                ],
              ),
            ),

            // Persistent Driver Bar & Complete Trip CTA Button
            Container(
              padding: const EdgeInsets.all(18),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                border: Border(top: BorderSide(color: AppColors.lightBorder)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            driver?.name ?? 'Murugan Selvam',
                            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                          Text(
                            '${driver?.vehicleModel ?? "Maruti Dzire"} • ${driver?.vehicleNumber ?? "TN 01 AB 1234"}',
                            style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                      InkWell(
                        onTap: () => provider.setScreen(10),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.crimsonRedLight,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.crimsonRed.withOpacity(0.4)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.shield_rounded, color: AppColors.crimsonRed, size: 14),
                              const SizedBox(width: 4),
                              Text('SOS SAFETY', style: GoogleFonts.inter(color: AppColors.crimsonRed, fontSize: 11, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => provider.completeTrip(), // Go to Trip Completed
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.emeraldGreen,
                        elevation: 4,
                        shadowColor: AppColors.emeraldGreen.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Arrived at Destination • End Trip',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
