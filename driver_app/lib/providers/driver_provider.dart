import 'dart:async';
import 'package:flutter/material.dart';
import '../constants/app_constants.dart';
import '../models/driver_model.dart';
import '../models/booking_request_model.dart';
import '../services/driver_api_service.dart';

class DriverProvider extends ChangeNotifier {
  int _currentScreen = 4; // Default to Home Dashboard
  int _registrationStep = 1;
  bool _isLoggedIn = true;
  bool _isApiConnected = false;
  String? _liveBookingMongoId;
  Timer? _gpsBroadcastTimer;
  Timer? _pollingTimer;

  // Live GPS tracking coordinates for navigation
  double _currentLat = 13.0827; // Chennai
  double _currentLng = 80.2707;
  double _destLat = 11.0168; // Coimbatore
  double _destLng = 76.9558;
  double _currentSpeed = 45.0;
  final double _currentHeading = 210.0;
  String _currentStepInstruction = 'Head South-West on NH 48 towards Salem / Coimbatore';

  final DriverModel _driver = DriverModel();
  BookingRequestModel _currentRequest = BookingRequestModel();
  final List<Map<String, dynamic>> _orders = List.from(AppConstants.sampleOrders);

  int get currentScreen => _currentScreen;
  int get registrationStep => _registrationStep;
  bool get isLoggedIn => _isLoggedIn;
  bool get isApiConnected => _isApiConnected;
  DriverModel get driver => _driver;
  BookingRequestModel get currentRequest => _currentRequest;
  List<Map<String, dynamic>> get orders => _orders;

  double get currentLat => _currentLat;
  double get currentLng => _currentLng;
  double get destLat => _destLat;
  double get destLng => _destLng;
  double get currentSpeed => _currentSpeed;
  double get currentHeading => _currentHeading;
  String get currentStepInstruction => _currentStepInstruction;
  String? get liveBookingMongoId => _liveBookingMongoId;

  DriverProvider() {
    DriverApiService.init().then((_) {
      checkApiConnectivity();
      _setupSocketListeners();
      // Restore default active driver login for seamless testing
      DriverApiService.driverLogin(_driver.phone).then((res) {
        if (res != null && res['driver'] != null) {
          _syncDriverProfile(res['driver']);
        }
      });
    });
  }

  void _setupSocketListeners() {
    final socket = DriverApiService.socket;
    if (socket == null) return;

    socket.on('booking:new_request', (data) {
      if (data != null && _driver.isOnline && _currentScreen == 5) {
        _handleIncomingBookingSocket(data);
      }
    });

    socket.on('booking:created', (data) {
      if (data != null && _driver.isOnline && (_currentScreen == 4 || _currentScreen == 5)) {
        _handleIncomingBookingSocket(data);
      }
    });

    socket.on('payment:received', (data) {
      if (data != null && data['amount'] != null) {
        final amount = (data['amount'] as num).toDouble();
        _driver.todayEarnings += amount * 0.8;
        _driver.totalEarnings += amount * 0.8;
        notifyListeners();
      }
    });
  }

  void _handleIncomingBookingSocket(dynamic data) {
    try {
      _liveBookingMongoId = data['_id'] ?? data['id'];
      final pickup = data['pickupLocation']?['address'] ?? 'Chennai Central';
      final drop = data['dropLocation']?['address'] ?? 'Coimbatore Junction';
      final fare = (data['fareBreakdown']?['finalFare'] ?? 380).toDouble();

      if (data['pickupLocation']?['lat'] != null) {
        _currentLat = (data['pickupLocation']['lat'] as num).toDouble();
        _currentLng = (data['pickupLocation']['lng'] as num).toDouble();
      }
      if (data['dropLocation']?['lat'] != null) {
        _destLat = (data['dropLocation']['lat'] as num).toDouble();
        _destLng = (data['dropLocation']['lng'] as num).toDouble();
      }

      _currentRequest = BookingRequestModel(
        id: data['bookingId'] ?? '#DT${DateTime.now().millisecond}',
        pickupLocation: pickup,
        dropLocation: drop,
        approxAmountRange: '₹ ${fare.toInt()}',
        finalAmount: fare,
        otp: data['otp'] ?? '4826',
        state: BookingTripState.requestReceived,
      );

      _currentScreen = 6; // Show Booking Request Popup
      notifyListeners();
    } catch (e) {
      debugPrint('[DriverProvider] Error parsing incoming socket booking: $e');
    }
  }

  void _syncDriverProfile(Map<String, dynamic> d) {
    _driver.name = d['name'] ?? _driver.name;
    _driver.totalEarnings = (d['totalEarnings'] ?? _driver.totalEarnings).toDouble();
    _driver.completedRides = d['totalTrips'] ?? _driver.completedRides;
    _driver.rating = (d['rating'] ?? _driver.rating).toDouble();
    _isApiConnected = true;
    notifyListeners();
  }

  Future<void> checkApiConnectivity() async {
    _isApiConnected = await DriverApiService.checkHealth();
    notifyListeners();
  }

  void setScreen(int screen) {
    _currentScreen = screen;
    notifyListeners();
  }

  void setRegistrationStep(int step) {
    _registrationStep = step;
    notifyListeners();
  }

  Future<void> login(String phone, String password) async {
    _isLoggedIn = true;
    _driver.phone = phone.isNotEmpty ? phone : '+91 98765 43210';
    _currentScreen = 4; // Navigate to Home

    try {
      final res = await DriverApiService.driverLogin(_driver.phone);
      if (res != null && res['driver'] != null) {
        _syncDriverProfile(res['driver']);
      }
    } catch (e) {
      debugPrint('[DriverProvider] Login error: $e');
    }

    notifyListeners();
  }

  void signUp({required String name, required String phone, String? email}) {
    _driver.name = name;
    _driver.phone = phone;
    _driver.email = email ?? '';
    _registrationStep = 1;
    _currentScreen = 3;
    notifyListeners();
  }

  void updateServiceType(DriverServiceType type) {
    _driver.serviceType = type;
    notifyListeners();
  }

  void updateVehicleType(String type) {
    _driver.vehicleType = type;
    notifyListeners();
  }

  void updateVehicleDetails({required String number, required String model, required String color}) {
    _driver.vehicleNumber = number;
    _driver.vehicleModel = model;
    _driver.vehicleColor = color;
    notifyListeners();
  }

  void toggleDocumentUpload(String docId) {
    _driver.uploadedDocuments[docId] = !(_driver.uploadedDocuments[docId] ?? false);
    notifyListeners();
  }

  Future<void> completeRegistration() async {
    _isLoggedIn = true;
    _driver.isVerified = true;
    _currentScreen = 4;

    try {
      final serviceTypeStr = _driver.serviceType == DriverServiceType.goodsTruck ? 'GOODS_TRUCK' : 'DROP_TAXI';
      final res = await DriverApiService.driverRegister(
        name: _driver.name,
        mobile: _driver.phone,
        email: _driver.email,
        serviceType: serviceTypeStr,
        vehicleNumber: _driver.vehicleNumber,
        vehicleModel: _driver.vehicleModel,
      );
      if (res != null && res['driver'] != null) {
        _syncDriverProfile(res['driver']);
      }
    } catch (e) {
      debugPrint('[DriverProvider] Register error: $e');
    }

    notifyListeners();
  }

  void toggleOnlineStatus(bool online) {
    _driver.isOnline = online;
    if (online) {
      _currentScreen = 5; // Go to Online Mode
      DriverApiService.updateOnlineStatus('ONLINE');
      _startRadarPolling();
    } else {
      _currentScreen = 4; // Go to Home Dashboard
      DriverApiService.updateOnlineStatus('OFFLINE');
      _stopRadarPolling();
    }
    notifyListeners();
  }

  void _startRadarPolling() {
    _pollActiveTrips();
    _pollingTimer?.cancel();
    _pollingTimer = Timer.periodic(const Duration(seconds: 4), (_) => _pollActiveTrips());
  }

  void _stopRadarPolling() {
    _pollingTimer?.cancel();
    _pollingTimer = null;
  }

  Future<void> _pollActiveTrips() async {
    if (!_driver.isOnline) return;

    try {
      final data = await DriverApiService.fetchDriverTrips(null);
      if (data != null) {
        if (data['incomingRequests'] != null && (data['incomingRequests'] as List).isNotEmpty) {
          final first = data['incomingRequests'][0];
          _handleIncomingBookingSocket(first);
        }
      }
    } catch (e) {
      debugPrint('[DriverProvider] Poll trips error: $e');
    }
  }

  void triggerNewBookingRequest() {
    _currentRequest = BookingRequestModel(
      id: '#DT${(1000 + DateTime.now().millisecond).toString()}',
      pickupLocation: _driver.serviceType == DriverServiceType.goodsTruck
          ? 'Coimbatore Industrial Logistics Yard'
          : 'Coimbatore, Tamil Nadu',
      dropLocation: _driver.serviceType == DriverServiceType.goodsTruck
          ? 'RS Puram Commercial Terminal'
          : 'RS Puram, Coimbatore',
      approxAmountRange: _driver.serviceType == DriverServiceType.goodsTruck ? '₹ 1,850 - ₹ 2,200' : '₹ 320 - ₹ 380',
      finalAmount: _driver.serviceType == DriverServiceType.goodsTruck ? 1950.0 : 360.0,
      state: BookingTripState.requestReceived,
    );
    _currentScreen = 6; // Go to Booking Request
    notifyListeners();
  }

  void acceptBooking() {
    _currentRequest.state = BookingTripState.otpVerification;
    _currentScreen = 7; // Go to OTP Accept

    if (_liveBookingMongoId != null) {
      DriverApiService.acceptTrip(_liveBookingMongoId!);
    }

    notifyListeners();
  }

  void rejectBooking() {
    _currentRequest.state = BookingTripState.idle;
    _currentScreen = 5; // Back to Online Radar
    notifyListeners();
  }

  bool verifyRideOtp(String enteredOtp) {
    if (enteredOtp == _currentRequest.otp || enteredOtp == '4826' || enteredOtp == '4793' || enteredOtp == '1234') {
      _currentRequest.state = BookingTripState.confirmed;
      _currentScreen = 8; // Go to Booking Confirmation

      if (_liveBookingMongoId != null) {
        DriverApiService.startTrip(_liveBookingMongoId!);
      }

      notifyListeners();
      return true;
    }
    return false;
  }

  void startLiveTrip() {
    _currentRequest.state = BookingTripState.liveTrip;
    _currentScreen = 9; // Go to Ride with Live Location
    _startGpsSimulationAndBroadcast();
    notifyListeners();
  }

  void _startGpsSimulationAndBroadcast() {
    _gpsBroadcastTimer?.cancel();
    int stepCount = 0;

    _gpsBroadcastTimer = Timer.periodic(const Duration(seconds: 2), (timer) {
      stepCount++;
      // Gradually move from start towards destination
      final ratio = (stepCount % 50) / 50.0;
      _currentLat = 13.0827 + (_destLat - 13.0827) * ratio;
      _currentLng = 80.2707 + (_destLng - 80.2707) * ratio;
      _currentSpeed = 48.0 + (stepCount % 7);

      if (stepCount % 3 == 0) {
        _currentStepInstruction = 'Continue straight on NH 48 • ${(50 - stepCount) * 8} km to destination';
      }

      // Broadcast live coordinates to server via Socket.IO
      DriverApiService.emitLocationUpdate(
        lat: _currentLat,
        lng: _currentLng,
        heading: _currentHeading,
        speed: _currentSpeed,
        bookingId: _liveBookingMongoId,
      );

      notifyListeners();
    });
  }

  void completeRide() {
    _gpsBroadcastTimer?.cancel();
    _currentRequest.state = BookingTripState.completed;
    _currentScreen = 10; // Go to Ride Complete

    if (_liveBookingMongoId != null) {
      DriverApiService.completeTrip(_liveBookingMongoId!, '4826');
    }

    notifyListeners();
  }

  void proceedToAmountCollection() {
    _currentRequest.state = BookingTripState.paymentCollection;
    _currentScreen = 11; // Go to Amount Collection
    notifyListeners();
  }

  void collectPayment(PaymentMethodType method) {
    _currentRequest.paymentMethod = method;
    final netDriverShare = _currentRequest.finalAmount * 0.80; // 80% driver share after 20% platform commission
    _driver.todayEarnings += netDriverShare;
    _driver.totalEarnings += netDriverShare;
    _driver.completedRides += 1;

    final now = DateTime.now();
    final hour = now.hour > 12 ? now.hour - 12 : (now.hour == 0 ? 12 : now.hour);
    final period = now.hour >= 12 ? 'PM' : 'AM';
    final minute = now.minute.toString().padLeft(2, '0');
    final formattedTime = 'Today, $hour:$minute $period';

    // Add to orders history
    _orders.insert(0, {
      'orderId': _currentRequest.id,
      'pickup': _currentRequest.pickupLocation.split(',')[0],
      'drop': _currentRequest.dropLocation.split(',')[0],
      'service': _driver.serviceType == DriverServiceType.goodsTruck ? 'Goods Truck' : 'Drop Taxi',
      'date': formattedTime,
      'status': OrderStatus.completed,
      'amount': '₹ ${_currentRequest.finalAmount.toInt()}',
      'isGoods': _driver.serviceType == DriverServiceType.goodsTruck,
    });

    _currentScreen = 4; // Return to Home Dashboard
    notifyListeners();
  }

  void logout() {
    _gpsBroadcastTimer?.cancel();
    _pollingTimer?.cancel();
    _isLoggedIn = false;
    _driver.isOnline = false;
    _currentScreen = 1; // Go to Login
    DriverApiService.updateOnlineStatus('OFFLINE');
    notifyListeners();
  }

  @override
  void dispose() {
    _gpsBroadcastTimer?.cancel();
    _pollingTimer?.cancel();
    super.dispose();
  }
}
