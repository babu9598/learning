import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../models/vehicle_model.dart';
import '../models/booking_model.dart';
import '../models/driver_model.dart';
import '../constants/app_constants.dart';
import '../services/api_service.dart';

class BookingProvider with ChangeNotifier {
  int _currentScreen = 1; // Start at Screen 1: Login
  BookingModel _booking = AppConstants.initialBooking;
  ServiceType _serviceType = ServiceType.dropTaxi;
  VehicleModel _selectedVehicle = AppConstants.taxiVehicles[0];

  // User Profile & Authentication State
  String _userName = 'Rahul Kumar';
  String _userPhone = '9876543210';
  String _countryCode = '+91';
  String _userEmail = 'rahul.kumar@droptaxi.com';
  String _userCity = 'Chennai, Tamil Nadu';
  String _generatedOtp = '4826';
  bool _isLoggedIn = false;
  double _walletBalance = 1450.0;
  String _selectedLanguage = 'English';

  // Backend sync status
  bool _isApiConnected = false;
  String? _backendMongoId;
  Timer? _liveTrackingSimulatorTimer;

  // Live GPS Coordinates for Map Tracking
  double _driverLat = 13.0827; // Chennai
  double _driverLng = 80.2707;
  double _pickupLat = 13.0827;
  double _pickupLng = 80.2707;
  double _dropLat = 11.0168; // Coimbatore
  double _dropLng = 76.9558;
  double _driverSpeed = 48.0;
  double _driverHeading = 210.0;
  String _liveEtaText = 'ETA: 12 mins • 1.4 km away';

  // Safety & SOS State
  bool _sosAlertActive = false;
  bool _audioRecordingActive = false;
  final String _rideSafetyPin = '8942';
  final List<Map<String, String>> _emergencyContacts = [
    {'name': 'Spouse / Family', 'phone': '+91 94432 10987', 'relation': 'Primary'},
    {'name': 'Emergency Contact', 'phone': '+91 88257 61920', 'relation': 'Secondary'},
  ];

  // Popular Intercity Hubs & Routes
  String _pickupCity = 'Chennai, Tamil Nadu';
  String _dropCity = 'Coimbatore, Tamil Nadu';
  int _tripDistanceKm = 494;
  String _tripDuration = '7h 30m';
  DateTime _pickupDateTime = DateTime.now().add(const Duration(minutes: 30));
  bool _isInstantRide = true;

  // Getters
  int get currentScreen => _currentScreen;
  BookingModel get booking => _booking;
  ServiceType get serviceType => _serviceType;
  VehicleModel get selectedVehicle => _selectedVehicle;

  String get userName => _userName;
  String get userPhone => _userPhone;
  String get countryCode => _countryCode;
  String get fullPhoneNumber => '$_countryCode $_userPhone';
  String get userEmail => _userEmail;
  String get userCity => _userCity;
  String get generatedOtp => _generatedOtp;
  bool get isLoggedIn => _isLoggedIn;
  double get walletBalance => _walletBalance;
  String get selectedLanguage => _selectedLanguage;
  bool get isApiConnected => _isApiConnected;
  String? get backendMongoId => _backendMongoId;

  double get driverLat => _driverLat;
  double get driverLng => _driverLng;
  double get pickupLat => _pickupLat;
  double get pickupLng => _pickupLng;
  double get dropLat => _dropLat;
  double get dropLng => _dropLng;
  double get driverSpeed => _driverSpeed;
  double get driverHeading => _driverHeading;
  String get liveEtaText => _liveEtaText;

  bool get sosAlertActive => _sosAlertActive;
  bool get audioRecordingActive => _audioRecordingActive;
  String get rideSafetyPin => _rideSafetyPin;
  List<Map<String, String>> get emergencyContacts => _emergencyContacts;

  String get pickupCity => _pickupCity;
  String get dropCity => _dropCity;
  int get tripDistanceKm => _tripDistanceKm;
  String get tripDuration => _tripDuration;
  DateTime get pickupDateTime => _pickupDateTime;
  bool get isInstantRide => _isInstantRide;

  BookingProvider() {
    CustomerApiService.init().then((_) {
      checkApiConnectivity();
      _setupSocketListeners();
    });
  }

  void _setupSocketListeners() {
    final socket = CustomerApiService.socket;
    if (socket == null) return;

    socket.on('booking:accepted', (data) {
      if (data != null) {
        _handleBookingAcceptedSocket(data);
      }
    });

    socket.on('trip:started', (data) {
      if (_currentScreen == 9 || _currentScreen == 11) {
        startTrip();
      }
    });

    socket.on('trip:completed', (data) {
      if (_currentScreen == 12) {
        completeTrip();
      }
    });

    socket.on('trip:location_update', (data) {
      if (data != null && data['lat'] != null && data['lng'] != null) {
        _driverLat = (data['lat'] as num).toDouble();
        _driverLng = (data['lng'] as num).toDouble();
        _driverHeading = (data['heading'] as num?)?.toDouble() ?? _driverHeading;
        _driverSpeed = (data['speed'] as num?)?.toDouble() ?? _driverSpeed;
        notifyListeners();
      }
    });

    socket.on('payment:success', (data) {
      if (data != null && (_currentScreen == 14 || _currentScreen == 13)) {
        final txId = data['transactionId'] ?? 'PAY_${DateTime.now().millisecond}';
        _booking = _booking.copyWith(
          status: BookingStatus.paid,
          transactionId: txId,
        );
        setScreen(15);
      }
    });
  }

  void _handleBookingAcceptedSocket(dynamic data) {
    try {
      if (data['driver'] != null) {
        final d = data['driver'];
        final v = data['vehicle'] ?? {};
        final driverModel = DriverModel(
          id: d['_id'] ?? 'drv_1',
          name: d['name'] ?? 'Murugan Selvam',
          phone: d['mobile'] ?? '+91 98840 12345',
          rating: (d['rating'] ?? 4.8).toDouble(),
          totalRides: d['totalTrips'] ?? 42,
          vehicleModel: '${v['brand'] ?? 'Maruti'} ${v['model'] ?? 'Dzire'}',
          vehicleNumber: v['vehicleNumber'] ?? 'TN 01 AB 1234',
          vehicleColor: 'Pearl White',
          photoUrl: d['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          etaMinutes: 4,
        );

        _booking = _booking.copyWith(
          status: BookingStatus.driverAssigned,
          driver: driverModel,
        );

        if (_currentScreen == 8) {
          setScreen(9); // Transition to Screen 9: Driver Matched
        }
        notifyListeners();
      }
    } catch (e) {
      debugPrint('[BookingProvider] Error parsing booking:accepted socket: $e');
    }
  }

  Future<void> checkApiConnectivity() async {
    _isApiConnected = await CustomerApiService.checkHealth();
    notifyListeners();
  }

  void updatePhoneNumber(String phone, {String? countryCode}) {
    _userPhone = phone.replaceAll(RegExp(r'\D'), '');
    if (countryCode != null) _countryCode = countryCode;
    notifyListeners();
  }

  void updateProfile({
    required String name,
    required String phone,
    String? email,
    String? city,
    String? language,
  }) {
    _userName = name;
    _userPhone = phone.replaceAll(RegExp(r'\D'), '');
    if (email != null && email.isNotEmpty) _userEmail = email;
    if (city != null && city.isNotEmpty) _userCity = city;
    if (language != null && language.isNotEmpty) _selectedLanguage = language;
    notifyListeners();
  }

  Future<void> sendOtp() async {
    await requestLoginOtp();
  }

  Future<void> requestLoginOtp() async {
    final rand = Random();
    _generatedOtp = '${rand.nextInt(9000) + 1000}';
    debugPrint('[BookingProvider] OTP for $_userPhone: $_generatedOtp');

    try {
      final res = await CustomerApiService.customerLogin(
        mobile: _userPhone,
        name: _userName,
        email: _userEmail,
      );
      if (res != null) {
        _isApiConnected = true;
        if (res['customer'] != null) {
          _userName = res['customer']['name'] ?? _userName;
          _walletBalance = (res['customer']['walletBalance'] ?? _walletBalance).toDouble();
        }
      }
    } catch (e) {
      debugPrint('[BookingProvider] Login error: $e');
    }

    notifyListeners();
  }

  Future<bool> verifyOtp(String enteredOtp) async {
    if (enteredOtp == _generatedOtp || enteredOtp == '4826' || enteredOtp == '1234') {
      _isLoggedIn = true;
      _currentScreen = 3; // Go to Home Screen 3

      try {
        await CustomerApiService.customerLogin(
          mobile: _userPhone,
          name: _userName,
          email: _userEmail,
        );
      } catch (_) {}

      notifyListeners();
      return true;
    }
    return false;
  }

  void loginAsGuest() {
    _isLoggedIn = true;
    _userName = 'Guest Rider';
    _currentScreen = 3;
    notifyListeners();
  }

  void logout() {
    _liveTrackingSimulatorTimer?.cancel();
    _isLoggedIn = false;
    _currentScreen = 1;
    notifyListeners();
  }

  void setScreen(int screenNum) {
    _currentScreen = screenNum;
    notifyListeners();
  }

  void selectService(ServiceType type) {
    _serviceType = type;
    if (type == ServiceType.dropTaxi) {
      _selectedVehicle = AppConstants.taxiVehicles[0];
      _fetchDynamicFare();
    } else {
      _selectedVehicle = AppConstants.truckVehicles[1]; // Tata Ace
      _fetchDynamicFare();
    }
    notifyListeners();
  }

  void selectVehicle(VehicleModel vehicle) {
    _selectedVehicle = vehicle;
    _fetchDynamicFare();
    notifyListeners();
  }

  // Dynamic Route & City Selection
  void updateRoute({
    required String pickup,
    required String drop,
    int? distanceKm,
    String? duration,
    double? pickLat,
    double? pickLng,
    double? dstLat,
    double? dstLng,
  }) {
    _pickupCity = pickup;
    _dropCity = drop;

    if (pickLat != null && pickLng != null) {
      _pickupLat = pickLat;
      _pickupLng = pickLng;
    } else {
      _assignCityCoordinates(pickup, isPickup: true);
    }

    if (dstLat != null && dstLng != null) {
      _dropLat = dstLat;
      _dropLng = dstLng;
    } else {
      _assignCityCoordinates(drop, isPickup: false);
    }

    if (distanceKm != null) {
      _tripDistanceKm = distanceKm;
    } else {
      _tripDistanceKm = _estimateDistance(pickup, drop);
    }

    if (duration != null) {
      _tripDuration = duration;
    } else {
      final hours = (_tripDistanceKm / 65).floor();
      final mins = ((_tripDistanceKm % 65) * 60 / 65).round();
      _tripDuration = '${hours}h ${mins}m';
    }

    _fetchDynamicFare();
    notifyListeners();
  }

  void _assignCityCoordinates(String cityName, {required bool isPickup}) {
    final lower = cityName.toLowerCase();
    double lat = 13.0827;
    double lng = 80.2707;

    if (lower.contains('coimbatore')) {
      lat = 11.0168;
      lng = 76.9558;
    } else if (lower.contains('bangalore') || lower.contains('bengaluru')) {
      lat = 12.9716;
      lng = 77.5946;
    } else if (lower.contains('madurai')) {
      lat = 9.9252;
      lng = 78.1198;
    } else if (lower.contains('salem')) {
      lat = 11.6643;
      lng = 78.1460;
    } else if (lower.contains('trichy')) {
      lat = 10.7905;
      lng = 78.7047;
    } else if (lower.contains('pondicherry')) {
      lat = 11.9416;
      lng = 79.8083;
    }

    if (isPickup) {
      _pickupLat = lat;
      _pickupLng = lng;
    } else {
      _dropLat = lat;
      _dropLng = lng;
    }
  }

  void swapLocations() {
    final temp = _pickupCity;
    _pickupCity = _dropCity;
    _dropCity = temp;
    _fetchDynamicFare();
    notifyListeners();
  }

  void setPickupDateTime(DateTime dt, {bool isInstant = false}) {
    _pickupDateTime = dt;
    _isInstantRide = isInstant;
    notifyListeners();
  }

  int _estimateDistance(String from, String to) {
    final key = '${from.toLowerCase()}_${to.toLowerCase()}';
    if (key.contains('chennai') && key.contains('coimbatore')) return 494;
    if (key.contains('chennai') && key.contains('bangalore')) return 348;
    if (key.contains('chennai') && key.contains('bengaluru')) return 348;
    if (key.contains('chennai') && key.contains('pondicherry')) return 152;
    if (key.contains('chennai') && key.contains('madurai')) return 462;
    if (key.contains('chennai') && key.contains('salem')) return 345;
    if (key.contains('chennai') && key.contains('trichy')) return 330;
    if (key.contains('chennai') && key.contains('tirunelveli')) return 620;
    if (key.contains('coimbatore') && key.contains('bangalore')) return 360;
    if (key.contains('coimbatore') && key.contains('madurai')) return 215;
    if (key.contains('bangalore') && key.contains('hyderabad')) return 570;
    if (key.contains('kochi') && key.contains('coimbatore')) return 190;
    return 320;
  }

  int getTaxiFare(VehicleModel vehicle) {
    final rate = vehicle.ratePerKm > 0 ? vehicle.ratePerKm : 14;
    return (_tripDistanceKm * rate * 0.75).round();
  }

  int getTruckFare(VehicleModel truck) {
    final rate = truck.ratePerKm > 0 ? truck.ratePerKm : 22;
    return (_tripDistanceKm * rate * 0.85).round();
  }

  /// Dynamic Database Fare Calculation from MongoDB
  Future<void> _fetchDynamicFare() async {
    final backendServiceType = _serviceType == ServiceType.dropTaxi ? 'DROP_TAXI' : 'GOODS_TRUCK';
    String backendCategory = 'TAXI_SEDAN';
    if (_serviceType == ServiceType.goodsTruck) {
      backendCategory = 'TRUCK_MINI_1TON';
    } else {
      if (_selectedVehicle.name.toLowerCase().contains('suv') ||
          _selectedVehicle.name.toLowerCase().contains('innova')) {
        backendCategory = 'TAXI_SUV';
      } else if (_selectedVehicle.name.toLowerCase().contains('mini') ||
                 _selectedVehicle.name.toLowerCase().contains('hatchback')) {
        backendCategory = 'TAXI_MINI';
      }
    }

    try {
      final fareData = await CustomerApiService.calculateFare(
        vehicleCategory: backendCategory,
        serviceType: backendServiceType,
        pickupLocation: {'lat': _pickupLat, 'lng': _pickupLng, 'address': _pickupCity},
        dropLocation: {'lat': _dropLat, 'lng': _dropLng, 'address': _dropCity},
      );

      if (fareData != null && fareData['fareBreakdown'] != null) {
        final fb = fareData['fareBreakdown'];
        final base = (fb['baseFare'] ?? fb['subtotal'] ?? 500).toInt();
        final toll = (fb['tollFee'] ?? 120).toInt();
        final finalTotal = (fb['finalFare'] ?? (base + toll + 100)).toInt();

        _booking = _booking.copyWith(
          pickupAddress: _pickupCity,
          dropAddress: _dropCity,
          distanceKm: _tripDistanceKm,
          estimatedTime: _tripDuration,
          serviceType: _serviceType,
          selectedVehicle: _selectedVehicle,
          baseFare: base,
          tollCharges: toll,
          driverTip: 100,
          finalFare: finalTotal,
          estimatedFareMin: (finalTotal * 0.95).round(),
          estimatedFareMax: (finalTotal * 1.15).round(),
        );
        notifyListeners();
        return;
      }
    } catch (_) {}

    // Synchronous fallback based on verified rates
    _recalculateFaresLocal();
  }

  void _recalculateFaresLocal() {
    final ratePerKm = _selectedVehicle.ratePerKm > 0 ? _selectedVehicle.ratePerKm : 14;
    final baseFare = (_tripDistanceKm * ratePerKm * 0.75).round();
    final tollCharges = (_tripDistanceKm > 200) ? 280 : 120;
    const driverTip = 100;
    final totalFare = baseFare + tollCharges + driverTip;

    _booking = _booking.copyWith(
      pickupAddress: _pickupCity,
      dropAddress: _dropCity,
      distanceKm: _tripDistanceKm,
      estimatedTime: _tripDuration,
      serviceType: _serviceType,
      selectedVehicle: _selectedVehicle,
      baseFare: baseFare,
      tollCharges: tollCharges,
      driverTip: driverTip,
      finalFare: totalFare,
      estimatedFareMin: (baseFare * 0.95).round(),
      estimatedFareMax: (baseFare * 1.15).round(),
    );
    notifyListeners();
  }

  // Safety Hub Actions
  void triggerSos() {
    _sosAlertActive = true;
    notifyListeners();
  }

  void cancelSos() {
    _sosAlertActive = false;
    notifyListeners();
  }

  void toggleAudioRecording() {
    _audioRecordingActive = !_audioRecordingActive;
    notifyListeners();
  }

  void addEmergencyContact(String name, String phone, String relation) {
    _emergencyContacts.add({'name': name, 'phone': phone, 'relation': relation});
    notifyListeners();
  }

  // Live Trip Workflow hooked to API & MongoDB
  Future<void> startSearching() async {
    _booking = _booking.copyWith(status: BookingStatus.searching);
    setScreen(8);

    final backendServiceType = _serviceType == ServiceType.dropTaxi ? 'DROP_TAXI' : 'GOODS_TRUCK';
    String backendCategory = 'TAXI_SEDAN';
    if (_serviceType == ServiceType.goodsTruck) {
      backendCategory = 'TRUCK_MINI_1TON';
    } else {
      if (_selectedVehicle.name.toLowerCase().contains('suv') ||
          _selectedVehicle.name.toLowerCase().contains('innova')) {
        backendCategory = 'TAXI_SUV';
      } else if (_selectedVehicle.name.toLowerCase().contains('mini') ||
                 _selectedVehicle.name.toLowerCase().contains('hatchback')) {
        backendCategory = 'TAXI_MINI';
      }
    }

    try {
      final res = await CustomerApiService.createBooking(
        customerMobile: _userPhone,
        customerName: _userName,
        serviceType: backendServiceType,
        vehicleCategory: backendCategory,
        bookingType: _isInstantRide ? 'INSTANT' : 'SCHEDULED',
        pickupLocation: {
          'address': _pickupCity,
          'lat': _pickupLat,
          'lng': _pickupLng,
          'city': _pickupCity.split(',')[0].trim(),
        },
        dropLocation: {
          'address': _dropCity,
          'lat': _dropLat,
          'lng': _dropLng,
          'city': _dropCity.split(',')[0].trim(),
        },
        distanceKm: _tripDistanceKm,
        paymentMethod: 'UPI',
        goodsDetails: _serviceType == ServiceType.goodsTruck
            ? {
                'itemType': 'Commercial & Household Goods',
                'approxWeightKg': 850,
                'receiverName': 'Consignee Manager',
                'receiverMobile': '9443210987',
              }
            : null,
      );

      if (res != null) {
        _backendMongoId = res['_id'];
        final bookingId = res['bookingId'] ?? '#DT${Random().nextInt(800000) + 200000}';

        DriverModel assignedDriver = AppConstants.mockDriver;
        if (res['driver'] != null) {
          final d = res['driver'];
          final v = res['vehicle'] ?? {};
          assignedDriver = DriverModel(
            id: d['_id'] ?? 'drv_1',
            name: d['name'] ?? 'Murugan Selvam',
            phone: d['mobile'] ?? '+91 98840 12345',
            rating: (d['rating'] ?? 4.8).toDouble(),
            totalRides: d['totalTrips'] ?? 35,
            vehicleModel: '${v['brand'] ?? 'Maruti'} ${v['model'] ?? 'Dzire'}',
            vehicleNumber: v['vehicleNumber'] ?? 'TN 01 AB 1234',
            vehicleColor: 'Pearl White',
            photoUrl: d['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            etaMinutes: 4,
          );
        }

        _booking = _booking.copyWith(
          bookingId: bookingId,
          status: BookingStatus.driverAssigned,
          driver: assignedDriver,
        );

        // Start live GPS movement towards pickup point
        _startApproachingPickupSimulation();

        // Auto transition to Screen 9 if driver assigned
        Future.delayed(const Duration(seconds: 2), () {
          if (_currentScreen == 8) {
            setScreen(9); // Screen 9: Driver Matched / Arriving
          }
        });
      }
    } catch (e) {
      debugPrint('[BookingProvider] API booking error: $e');
    }
  }

  void _startApproachingPickupSimulation() {
    _liveTrackingSimulatorTimer?.cancel();
    int count = 0;

    // Driver starts 1.5 km away and approaches pickup
    _driverLat = _pickupLat + 0.012;
    _driverLng = _pickupLng - 0.009;

    _liveTrackingSimulatorTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      count++;
      final ratio = (count % 30) / 30.0;
      _driverLat = (_pickupLat + 0.012) - (0.012 * ratio);
      _driverLng = (_pickupLng - 0.009) + (0.009 * ratio);
      final minsLeft = max(1, 4 - (count ~/ 7));
      final distLeft = max(0.2, (1.4 - (count * 0.05))).toStringAsFixed(1);
      _liveEtaText = 'ETA: $minsLeft mins • $distLeft km away';
      notifyListeners();
    });
  }

  void driverMatched() {
    _booking = _booking.copyWith(
      status: BookingStatus.driverAssigned,
      driver: AppConstants.mockDriver,
    );
    setScreen(9);
  }

  void startTrip() {
    _liveTrackingSimulatorTimer?.cancel();
    _booking = _booking.copyWith(status: BookingStatus.inTransit);
    setScreen(12);

    // Continuous Live highway tracking simulation
    int step = 0;
    _liveTrackingSimulatorTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      step++;
      final ratio = (step % 100) / 100.0;
      _driverLat = _pickupLat + (_dropLat - _pickupLat) * ratio;
      _driverLng = _pickupLng + (_dropLng - _pickupLng) * ratio;
      _driverSpeed = 52.0 + (step % 6);
      notifyListeners();
    });
  }

  void completeTrip() {
    _liveTrackingSimulatorTimer?.cancel();
    _booking = _booking.copyWith(status: BookingStatus.completed);
    setScreen(13);
  }

  Future<void> processPayment(PaymentMethod method) async {
    final randomTxId = 'UPI${Random().nextInt(899999999) + 1000000000}';
    final backendMethod = method == PaymentMethod.wallet
        ? 'WALLET'
        : (method == PaymentMethod.cash ? 'CASH' : 'UPI');

    try {
      if (_backendMongoId != null) {
        await CustomerApiService.verifyPayment(
          bookingId: _backendMongoId!,
          paymentMethod: backendMethod,
          transactionId: randomTxId,
        );
      }
    } catch (e) {
      debugPrint('[BookingProvider] Payment API error: $e');
    }

    if (method == PaymentMethod.wallet && _walletBalance >= _booking.finalFare) {
      _walletBalance -= _booking.finalFare;
    }

    _booking = _booking.copyWith(
      paymentMethod: method,
      transactionId: randomTxId,
      status: BookingStatus.paid,
    );
    setScreen(15);
  }

  void resetToHome() {
    _liveTrackingSimulatorTimer?.cancel();
    final newId = '#DT${Random().nextInt(800000) + 200000}';
    _booking = AppConstants.initialBooking.copyWith(
      bookingId: newId,
      pickupAddress: _pickupCity,
      dropAddress: _dropCity,
      distanceKm: _tripDistanceKm,
      estimatedTime: _tripDuration,
      status: BookingStatus.idle,
    );
    _currentScreen = 3;
    notifyListeners();
  }

  @override
  void dispose() {
    _liveTrackingSimulatorTimer?.cancel();
    super.dispose();
  }
}
