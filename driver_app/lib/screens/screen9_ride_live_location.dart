import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen9RideLiveLocation extends StatefulWidget {
  const Screen9RideLiveLocation({super.key});

  @override
  State<Screen9RideLiveLocation> createState() => _Screen9RideLiveLocationState();
}

class _Screen9RideLiveLocationState extends State<Screen9RideLiveLocation> {
  final MapController _mapController = MapController();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final request = provider.currentRequest;

    final driverPos = LatLng(provider.currentLat, provider.currentLng);
    final destPos = LatLng(provider.destLat, provider.destLng);

    // Route points along intercity highway
    final routePoints = [
      driverPos,
      LatLng((driverPos.latitude + destPos.latitude) / 2 + 0.05, (driverPos.longitude + destPos.longitude) / 2 - 0.03),
      destPos,
    ];

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(8),
        ),
        title: Column(
          children: [
            Text('Turn-by-Turn Navigation', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(width: 6, height: 6, decoration: const BoxDecoration(color: AppColors.emeraldGreen, shape: BoxShape.circle)),
                const SizedBox(width: 4),
                Text('GPS BROADCAST ACTIVE', style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 9, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Turn-by-Turn Instruction Banner
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              color: AppColors.deepBlue,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlue,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.turn_slight_right_rounded, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          provider.currentStepInstruction,
                          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'In 2.5 km • Stay on right lane',
                          style: GoogleFonts.inter(color: AppColors.cloudySky, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '${provider.currentSpeed.toStringAsFixed(0)} km/h',
                      style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),

            // Live Interactive Map View
            Expanded(
              child: Stack(
                children: [
                  FlutterMap(
                    mapController: _mapController,
                    options: MapOptions(
                      initialCenter: driverPos,
                      initialZoom: 12.5,
                      interactionOptions: const InteractionOptions(
                        flags: InteractiveFlag.all,
                      ),
                    ),
                    children: [
                      TileLayer(
                        urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                        userAgentPackageName: 'com.vaago.driver',
                        maxZoom: 19,
                      ),
                      PolylineLayer(
                        polylines: [
                          Polyline(
                            points: routePoints,
                            strokeWidth: 5.0,
                            color: AppColors.oceanBlue,
                          ),
                        ],
                      ),
                      MarkerLayer(
                        markers: [
                          // Destination Marker
                          Marker(
                            point: destPos,
                            width: 44,
                            height: 44,
                            child: const Column(
                              children: [
                                Icon(Icons.location_on_rounded, color: AppColors.crimsonRed, size: 34),
                              ],
                            ),
                          ),
                          // Live Driver Marker
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

                  // Floating Recenter Button
                  Positioned(
                    top: 14,
                    right: 14,
                    child: FloatingActionButton.small(
                      backgroundColor: Colors.white,
                      onPressed: () {
                        _mapController.move(driverPos, 13.5);
                      },
                      child: const Icon(Icons.my_location_rounded, color: AppColors.oceanBlue),
                    ),
                  ),
                ],
              ),
            ),

            // Bottom Customer Card & Complete Ride Button
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
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          color: AppColors.oceanBlueLight,
                          shape: BoxShape.circle,
                        ),
                        child: const Center(
                          child: Icon(Icons.person_rounded, color: AppColors.oceanBlue, size: 24),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              request.customerName,
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'Drop: ${request.dropLocation}',
                              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              'Fare: ${request.approxAmountRange}',
                              style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: AppColors.emeraldGreenLight,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.call_rounded, color: AppColors.emeraldGreen, size: 20),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 14),

                  // Complete Ride CTA Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => provider.completeRide(), // Go to Ride Complete
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.emeraldGreen,
                        elevation: 4,
                        shadowColor: AppColors.emeraldGreen.withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.flag_rounded, color: Colors.white, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Arrived at Destination • End Trip',
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
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
