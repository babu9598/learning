import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen9DriverDetailsTracking extends StatefulWidget {
  const Screen9DriverDetailsTracking({super.key});

  @override
  State<Screen9DriverDetailsTracking> createState() => _Screen9DriverDetailsTrackingState();
}

class _Screen9DriverDetailsTrackingState extends State<Screen9DriverDetailsTracking> {
  final MapController _mapController = MapController();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final driver = provider.booking.driver;

    final driverPos = LatLng(provider.driverLat, provider.driverLng);
    final pickupPos = LatLng(provider.pickupLat, provider.pickupLng);

    final approachRoute = [
      driverPos,
      LatLng((driverPos.latitude + pickupPos.latitude) / 2 + 0.002, (driverPos.longitude + pickupPos.longitude) / 2 - 0.002),
      pickupPos,
    ];

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(6),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Driver Assigned', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
            Text('Captain is on the way to pickup point', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Interactive Live Map View
            Expanded(
              child: Stack(
                children: [
                  FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: pickupPos,
                      initialZoom: 14.5,
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
                            points: approachRoute,
                            strokeWidth: 4.5,
                            color: AppColors.oceanBlue,
                          ),
                        ],
                      ),
                      MarkerLayer(
                        markers: [
                          // Pickup Location Pin
                          Marker(
                            point: pickupPos,
                            width: 44,
                            height: 44,
                            child: const Column(
                              children: [
                                Icon(Icons.my_location_rounded, color: AppColors.emeraldGreen, size: 32),
                              ],
                            ),
                          ),
                          // Live Moving Driver Vehicle Marker
                          Marker(
                            point: driverPos,
                            width: 46,
                            height: 46,
                            child: Container(
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlue,
                                shape: BoxShape.circle,
                                border: Border.all(color: Colors.white, width: 2.5),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.oceanBlue.withOpacity(0.4),
                                    blurRadius: 8,
                                    spreadRadius: 2,
                                  ),
                                ],
                              ),
                              child: const Icon(Icons.local_taxi_rounded, color: Colors.white, size: 22),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  // Top Status Pill
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
                          Container(width: 8, height: 8, decoration: const BoxDecoration(color: AppColors.emeraldGreen, shape: BoxShape.circle)),
                          const SizedBox(width: 8),
                          Text(
                            provider.liveEtaText,
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
                        _mapController.move(driverPos, 14.5);
                      },
                      child: const Icon(Icons.center_focus_strong_rounded, color: AppColors.oceanBlue),
                    ),
                  ),
                ],
              ),
            ),

            // Driver Card & Bottom Controls
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
                    children: [
                      Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: AppColors.oceanBlue,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Center(
                          child: Text(
                            driver != null && driver.name.isNotEmpty ? driver.name[0] : 'M',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              driver?.name ?? 'Murugan Selvam',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              '⭐ ${driver?.rating ?? 4.8} (${driver?.totalRides ?? 42} rides) • ${driver?.vehicleModel ?? "Maruti Dzire"}',
                              style: GoogleFonts.inter(color: AppColors.vibrantAmber, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                            Text(
                              driver?.vehicleNumber ?? 'TN 01 AB 1234',
                              style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(color: AppColors.emeraldGreenLight, shape: BoxShape.circle),
                          child: const Icon(Icons.call_rounded, color: AppColors.emeraldGreen, size: 20),
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(color: AppColors.oceanBlueLight, shape: BoxShape.circle),
                          child: const Icon(Icons.message_rounded, color: AppColors.oceanBlue, size: 20),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => provider.setScreen(10), // Go to Safety Center & Ride PIN
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.oceanBlue,
                        elevation: 4,
                        shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.shield_rounded, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            'View Safety PIN & Start Ride',
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
