import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class CityHub {
  final String name;
  final String state;
  final LatLng position;
  final int distanceKmFromChennai;
  final String duration;
  final String taxiFare;
  final String truckFare;
  final String description;

  const CityHub({
    required this.name,
    required this.state,
    required this.position,
    required this.distanceKmFromChennai,
    required this.duration,
    required this.taxiFare,
    required this.truckFare,
    required this.description,
  });

  String get fullName => '$name, $state';
}

class MapLocationPickerScreen extends StatefulWidget {
  final bool isPickup;

  const MapLocationPickerScreen({
    super.key,
    this.isPickup = false,
  });

  @override
  State<MapLocationPickerScreen> createState() => _MapLocationPickerScreenState();
}

class _MapLocationPickerScreenState extends State<MapLocationPickerScreen> {
  late bool _isPickupMode;
  late final MapController _mapController;
  final TextEditingController _searchController = TextEditingController();

  static const List<CityHub> hubs = [
    CityHub(
      name: 'Chennai',
      state: 'Tamil Nadu',
      position: LatLng(13.0827, 80.2707),
      distanceKmFromChennai: 0,
      duration: '0m',
      taxiFare: 'Local',
      truckFare: 'Local',
      description: 'Chennai Central Hub, Koyambedu, Airport Gateway',
    ),
    CityHub(
      name: 'Coimbatore',
      state: 'Tamil Nadu',
      position: LatLng(11.0168, 76.9558),
      distanceKmFromChennai: 494,
      duration: '7h 30m',
      taxiFare: '₹5,800',
      truckFare: '₹7,900',
      description: 'Gandhipuram, RS Puram, Avinashi Road, Airport',
    ),
    CityHub(
      name: 'Bengaluru',
      state: 'Karnataka',
      position: LatLng(12.9716, 77.5946),
      distanceKmFromChennai: 348,
      duration: '5h 45m',
      taxiFare: '₹4,200',
      truckFare: '₹5,600',
      description: 'Electronic City, Silk Board, Indiranagar, Whitefield',
    ),
    CityHub(
      name: 'Pondicherry',
      state: 'Puducherry',
      position: LatLng(11.9416, 79.8083),
      distanceKmFromChennai: 152,
      duration: '2h 45m',
      taxiFare: '₹2,100',
      truckFare: '₹2,900',
      description: 'White Town, Promenade Beach, ECR Highway Corridor',
    ),
    CityHub(
      name: 'Madurai',
      state: 'Tamil Nadu',
      position: LatLng(9.9252, 78.1198),
      distanceKmFromChennai: 462,
      duration: '7h 15m',
      taxiFare: '₹5,400',
      truckFare: '₹7,400',
      description: 'Meenakshi Amman Temple Zone, Mattuthavani, Ring Road',
    ),
    CityHub(
      name: 'Salem',
      state: 'Tamil Nadu',
      position: LatLng(11.6643, 78.1460),
      distanceKmFromChennai: 345,
      duration: '5h 30m',
      taxiFare: '₹4,100',
      truckFare: '₹5,500',
      description: 'Salem Junction, Fairlands, Steel Plant Highway Hub',
    ),
    CityHub(
      name: 'Trichy',
      state: 'Tamil Nadu',
      position: LatLng(10.7905, 78.7047),
      distanceKmFromChennai: 330,
      duration: '5h 15m',
      taxiFare: '₹3,900',
      truckFare: '₹5,200',
      description: 'Central Bus Stand, Thillai Nagar, Airport Expressway',
    ),
    CityHub(
      name: 'Tirunelveli',
      state: 'Tamil Nadu',
      position: LatLng(8.7139, 77.7567),
      distanceKmFromChennai: 620,
      duration: '9h 30m',
      taxiFare: '₹7,200',
      truckFare: '₹9,800',
      description: 'Palayamkottai, Junction Bus Stand, Bypass Corridor',
    ),
    CityHub(
      name: 'Vellore',
      state: 'Tamil Nadu',
      position: LatLng(12.9165, 79.1325),
      distanceKmFromChennai: 138,
      duration: '2h 30m',
      taxiFare: '₹1,950',
      truckFare: '₹2,650',
      description: 'CMC Hospital, Katpadi Junction, Green Circle',
    ),
    CityHub(
      name: 'Erode',
      state: 'Tamil Nadu',
      position: LatLng(11.3410, 77.7172),
      distanceKmFromChennai: 398,
      duration: '6h 15m',
      taxiFare: '₹4,700',
      truckFare: '₹6,400',
      description: 'Brough Road, Perundurai Industrial Zone, Junction',
    ),
    CityHub(
      name: 'Tiruppur',
      state: 'Tamil Nadu',
      position: LatLng(11.1085, 77.3411),
      distanceKmFromChennai: 448,
      duration: '6h 50m',
      taxiFare: '₹5,250',
      truckFare: '₹7,100',
      description: 'Garment City Hub, Avinashi Road, Kangeyam Corridor',
    ),
    CityHub(
      name: 'Thanjavur',
      state: 'Tamil Nadu',
      position: LatLng(10.7870, 79.1378),
      distanceKmFromChennai: 345,
      duration: '5h 45m',
      taxiFare: '₹4,150',
      truckFare: '₹5,550',
      description: 'Old Bus Stand, Medical College Road, Big Temple Zone',
    ),
    CityHub(
      name: 'Dindigul',
      state: 'Tamil Nadu',
      position: LatLng(10.3673, 77.9803),
      distanceKmFromChennai: 425,
      duration: '6h 40m',
      taxiFare: '₹5,000',
      truckFare: '₹6,800',
      description: 'Lock & Food Hub, Palani Bypass, Bus Stand',
    ),
    CityHub(
      name: 'Hosur',
      state: 'Tamil Nadu',
      position: LatLng(12.7409, 77.8253),
      distanceKmFromChennai: 310,
      duration: '4h 50m',
      taxiFare: '₹3,750',
      truckFare: '₹5,000',
      description: 'SIPCOT Industrial Park, Bangalore Border Express',
    ),
    CityHub(
      name: 'Hyderabad',
      state: 'Telangana',
      position: LatLng(17.3850, 78.4867),
      distanceKmFromChennai: 625,
      duration: '10h 00m',
      taxiFare: '₹7,500',
      truckFare: '₹10,500',
      description: 'Gachibowli, Hitec City, Shamshabad Airport, Secunderabad',
    ),
    CityHub(
      name: 'Kochi',
      state: 'Kerala',
      position: LatLng(9.9312, 76.2673),
      distanceKmFromChennai: 690,
      duration: '11h 00m',
      taxiFare: '₹8,200',
      truckFare: '₹11,800',
      description: 'Marine Drive, Edappally, Kakkanad Infopark, Aluva',
    ),
    CityHub(
      name: 'Kanyakumari',
      state: 'Tamil Nadu',
      position: LatLng(8.0883, 77.5385),
      distanceKmFromChennai: 705,
      duration: '11h 15m',
      taxiFare: '₹8,500',
      truckFare: '₹12,000',
      description: 'Cape Comorin, Trivandrum Highway, Sunset Point',
    ),
    CityHub(
      name: 'Ooty (Nilgiris)',
      state: 'Tamil Nadu',
      position: LatLng(11.4102, 76.6950),
      distanceKmFromChennai: 540,
      duration: '9h 15m',
      taxiFare: '₹6,900',
      truckFare: '₹9,400',
      description: 'Charing Cross, Commercial Road, Hill Station Gateway',
    ),
  ];

  late LatLng _currentPinPosition;
  late String _selectedCityName;
  late String _selectedAddress;
  late int _selectedDistanceKm;
  late String _selectedDuration;
  late String _selectedTaxiFare;
  late String _selectedTruckFare;

  List<CityHub> _searchResults = [];
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _isPickupMode = widget.isPickup;
    _mapController = MapController();

    // Default to Coimbatore if Drop, Chennai if Pickup
    final initialHub = _isPickupMode ? hubs[0] : hubs[1];
    _currentPinPosition = initialHub.position;
    _selectedCityName = initialHub.fullName;
    _selectedAddress = initialHub.description;
    _selectedDistanceKm = initialHub.distanceKmFromChennai;
    _selectedDuration = initialHub.duration;
    _selectedTaxiFare = initialHub.taxiFare;
    _selectedTruckFare = initialHub.truckFare;
  }

  void _onCitySelected(CityHub hub) {
    setState(() {
      _currentPinPosition = hub.position;
      _selectedCityName = hub.fullName;
      _selectedAddress = hub.description;
      _selectedDistanceKm = hub.distanceKmFromChennai > 0 ? hub.distanceKmFromChennai : 45;
      _selectedDuration = hub.duration == '0m' ? '45m' : hub.duration;
      _selectedTaxiFare = hub.taxiFare;
      _selectedTruckFare = hub.truckFare;
      _isSearching = false;
      _searchController.clear();
    });

    _mapController.move(hub.position, 10.0);
  }

  void _onMapTapped(TapPosition tapPosition, LatLng point) {
    // Find closest hub or generate dynamic distance
    CityHub closest = hubs[0];
    double minDistance = double.infinity;
    const distanceCalc = Distance();

    for (final hub in hubs) {
      final d = distanceCalc.as(LengthUnit.Kilometer, point, hub.position);
      if (d < minDistance) {
        minDistance = d;
        closest = hub;
      }
    }

    final chennaiPos = hubs[0].position;
    final distFromChennai = (distanceCalc.as(LengthUnit.Kilometer, chennaiPos, point) * 1.22).round();
    final hours = (distFromChennai / 60).floor();
    final mins = ((distFromChennai % 60) * 0.8).round();
    final timeStr = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';
    final estTaxi = '₹${(distFromChennai * 14 * 0.78).round()}';
    final estTruck = '₹${(distFromChennai * 22 * 0.78).round()}';

    setState(() {
      _currentPinPosition = point;
      if (minDistance < 25) {
        _selectedCityName = closest.fullName;
        _selectedAddress = closest.description;
        _selectedDistanceKm = closest.distanceKmFromChennai > 0 ? closest.distanceKmFromChennai : distFromChennai;
        _selectedDuration = closest.duration == '0m' ? timeStr : closest.duration;
        _selectedTaxiFare = closest.taxiFare;
        _selectedTruckFare = closest.truckFare;
      } else {
        _selectedCityName = 'Selected Coordinate Point';
        _selectedAddress = 'Lat: ${point.latitude.toStringAsFixed(4)}, Lng: ${point.longitude.toStringAsFixed(4)} (Tamil Nadu Route)';
        _selectedDistanceKm = distFromChennai.clamp(30, 999);
        _selectedDuration = timeStr;
        _selectedTaxiFare = estTaxi;
        _selectedTruckFare = estTruck;
      }
    });
  }

  void _onSearchChanged(String query) {
    if (query.trim().isEmpty) {
      setState(() {
        _isSearching = false;
        _searchResults = [];
      });
      return;
    }

    final results = hubs.where((h) {
      return h.name.toLowerCase().contains(query.toLowerCase()) ||
          h.state.toLowerCase().contains(query.toLowerCase()) ||
          h.description.toLowerCase().contains(query.toLowerCase());
    }).toList();

    setState(() {
      _isSearching = true;
      _searchResults = results;
    });
  }

  void _confirmSelection(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context, listen: false);

    if (_isPickupMode) {
      provider.updateRoute(
        pickup: _selectedCityName,
        drop: provider.dropCity,
      );
    } else {
      provider.updateRoute(
        pickup: provider.pickupCity,
        drop: _selectedCityName,
        distanceKm: _selectedDistanceKm,
        duration: _selectedDuration,
      );
    }

    Navigator.pop(context, true);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                '${_isPickupMode ? "Pick-up Point" : "Drop Destination"} set to $_selectedCityName',
                style: GoogleFonts.inter(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _isPickupMode ? 'Select Pick-up on Google Map' : 'Select Drop Location on Google Map',
              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w800),
            ),
            Text(
              'Tap anywhere on map or choose a city below',
              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
            ),
          ],
        ),
        actions: [
          // Toggle between Drop and Pickup Mode
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: InkWell(
              onTap: () {
                setState(() {
                  _isPickupMode = !_isPickupMode;
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _isPickupMode ? AppColors.emeraldGreenLight : AppColors.oceanBlueLight,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
                    width: 1.2,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      _isPickupMode ? Icons.radio_button_checked_rounded : Icons.location_on_rounded,
                      color: _isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed,
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _isPickupMode ? 'PICKUP' : 'DROP',
                      style: GoogleFonts.plusJakartaSans(
                        color: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. Google Map / OpenStreetMap Vector Tile Layer
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _currentPinPosition,
              initialZoom: 8.5,
              minZoom: 5.0,
              maxZoom: 18.0,
              onTap: _onMapTapped,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.vaago.customer',
                maxZoom: 19,
              ),
              // Circle Radar around selected position
              CircleLayer(
                circles: [
                  CircleMarker(
                    point: _currentPinPosition,
                    radius: 28,
                    useRadiusInMeter: false,
                    color: (_isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed).withOpacity(0.18),
                    borderColor: _isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed,
                    borderStrokeWidth: 2,
                  ),
                ],
              ),
              // Marker Layer with Pin
              MarkerLayer(
                markers: [
                  Marker(
                    point: _currentPinPosition,
                    width: 140,
                    height: 80,
                    alignment: Alignment.topCenter,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.18),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                            border: Border.all(
                              color: _isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed,
                              width: 1.5,
                            ),
                          ),
                          child: Text(
                            _selectedCityName.split(',')[0],
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textPrimary,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        Icon(
                          Icons.location_on_rounded,
                          color: _isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed,
                          size: 38,
                          shadows: [
                            Shadow(
                              color: Colors.black.withOpacity(0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          // 2. Top Search & Filter Bar
          Positioned(
            top: 12,
            left: 16,
            right: 16,
            child: Column(
              children: [
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.12),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                    border: Border.all(color: AppColors.lightBorder),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onChanged: _onSearchChanged,
                    style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 14),
                    decoration: InputDecoration(
                      hintText: _isPickupMode ? 'Search pick-up city / area...' : 'Search drop destination city (e.g. Coimbatore)...',
                      hintStyle: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
                      prefixIcon: Icon(
                        _isPickupMode ? Icons.my_location_rounded : Icons.search_rounded,
                        color: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
                        size: 20,
                      ),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear_rounded, size: 18),
                              onPressed: () {
                                _searchController.clear();
                                _onSearchChanged('');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                  ),
                ),

                // Search Results Dropdown
                if (_isSearching && _searchResults.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 6),
                    constraints: const BoxConstraints(maxHeight: 220),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                      border: Border.all(color: AppColors.lightBorder),
                    ),
                    child: ListView.separated(
                      padding: const EdgeInsets.symmetric(vertical: 6),
                      shrinkWrap: true,
                      itemCount: _searchResults.length,
                      separatorBuilder: (_, __) => const Divider(height: 1, color: AppColors.lightBorder),
                      itemBuilder: (context, index) {
                        final hub = _searchResults[index];
                        return ListTile(
                          dense: true,
                          leading: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.location_city_rounded, color: AppColors.oceanBlue, size: 18),
                          ),
                          title: Text(
                            hub.fullName,
                            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            '${hub.distanceKmFromChennai} km • ~${hub.duration}',
                            style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                          ),
                          trailing: Text(
                            hub.taxiFare,
                            style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.bold),
                          ),
                          onTap: () => _onCitySelected(hub),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),

          // 3. Quick Outstation Hub Chips Carousel
          Positioned(
            top: 76,
            left: 0,
            right: 0,
            child: SizedBox(
              height: 40,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: hubs.length,
                itemBuilder: (context, index) {
                  final hub = hubs[index];
                  final isSelected = _selectedCityName.startsWith(hub.name);

                  return Container(
                    margin: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      elevation: 3,
                      shadowColor: Colors.black.withOpacity(0.1),
                      backgroundColor: isSelected ? AppColors.oceanBlue : Colors.white,
                      side: BorderSide(
                        color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
                        width: 1,
                      ),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      avatar: Icon(
                        Icons.location_on_rounded,
                        color: isSelected ? Colors.white : AppColors.oceanBlue,
                        size: 14,
                      ),
                      label: Text(
                        hub.name,
                        style: GoogleFonts.plusJakartaSans(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontSize: 12,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                        ),
                      ),
                      onPressed: () => _onCitySelected(hub),
                    ),
                  );
                },
              ),
            ),
          ),

          // 4. Map Action Controls (Zoom In/Out, Re-center, GPS)
          Positioned(
            right: 16,
            bottom: 240,
            child: Column(
              children: [
                _buildMapControlBtn(
                  icon: Icons.add_rounded,
                  onTap: () {
                    final nextZoom = (_mapController.camera.zoom + 1.0).clamp(5.0, 18.0);
                    _mapController.move(_mapController.camera.center, nextZoom);
                  },
                ),
                const SizedBox(height: 8),
                _buildMapControlBtn(
                  icon: Icons.remove_rounded,
                  onTap: () {
                    final nextZoom = (_mapController.camera.zoom - 1.0).clamp(5.0, 18.0);
                    _mapController.move(_mapController.camera.center, nextZoom);
                  },
                ),
                const SizedBox(height: 8),
                _buildMapControlBtn(
                  icon: Icons.my_location_rounded,
                  color: AppColors.oceanBlue,
                  iconColor: Colors.white,
                  onTap: () {
                    _mapController.move(_currentPinPosition, 11.0);
                  },
                ),
              ],
            ),
          ),

          // 5. Bottom Selected Destination Confirmation Card
          Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.16),
                    blurRadius: 20,
                    offset: const Offset(0, 6),
                  ),
                ],
                border: Border.all(color: AppColors.lightBorder),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Destination Info Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: _isPickupMode ? AppColors.emeraldGreenLight : AppColors.oceanBlueLight,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(
                          _isPickupMode ? Icons.radio_button_checked_rounded : Icons.location_on_rounded,
                          color: _isPickupMode ? AppColors.emeraldGreen : AppColors.crimsonRed,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  _isPickupMode ? 'PICK-UP LOCATION' : 'DROP DESTINATION',
                                  style: GoogleFonts.inter(
                                    color: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: AppColors.lightSurface,
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(color: AppColors.lightBorder),
                                  ),
                                  child: Text('GOOGLE MAP GPS', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 8, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _selectedCityName,
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.textPrimary,
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              _selectedAddress,
                              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Route Stats Pill Row
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.lightSurface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.lightBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.route_rounded, color: AppColors.oceanBlue, size: 16),
                            const SizedBox(width: 6),
                            Text(
                              '$_selectedDistanceKm km',
                              style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.timer_outlined, color: AppColors.textMuted, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '~$_selectedDuration',
                              style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            const Icon(Icons.local_taxi_rounded, color: AppColors.emeraldGreen, size: 13),
                            const SizedBox(width: 3),
                            Text(
                              _selectedTaxiFare,
                              style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.local_shipping_rounded, color: AppColors.cargoGold, size: 13),
                            const SizedBox(width: 3),
                            Text(
                              _selectedTruckFare,
                              style: GoogleFonts.inter(color: AppColors.cargoGold, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 14),

                  // Confirm Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () => _confirmSelection(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue,
                        elevation: 6,
                        shadowColor: (_isPickupMode ? AppColors.emeraldGreen : AppColors.oceanBlue).withOpacity(0.4),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _isPickupMode ? Icons.check_circle_rounded : Icons.navigation_rounded,
                            color: Colors.white,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _isPickupMode
                                ? 'Set Pick-up Point (${_selectedCityName.split(',')[0]})'
                                : 'Set Drop Location (${_selectedCityName.split(',')[0]})',
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapControlBtn({
    required IconData icon,
    required VoidCallback onTap,
    Color color = Colors.white,
    Color iconColor = AppColors.textPrimary,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.lightBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.12),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(icon, color: iconColor, size: 20),
      ),
    );
  }
}
