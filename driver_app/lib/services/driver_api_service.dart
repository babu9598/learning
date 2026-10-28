import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;

class DriverApiService {
  static const String defaultLocalUrl = 'http://127.0.0.1:5000/api';
  static const String defaultEmulatorUrl = 'http://10.0.2.2:5000/api';

  static String baseUrl = defaultLocalUrl;

  static String? _authToken;
  static String? _driverId;
  static socket_io.Socket? _socket;

  static String? get authToken => _authToken;
  static String? get driverId => _driverId;
  static socket_io.Socket? get socket => _socket;

  static Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _authToken = prefs.getString('droptaxi_driver_token');
      _driverId = prefs.getString('droptaxi_driver_id');
      final savedUrl = prefs.getString('droptaxi_driver_api_url');
      if (savedUrl != null && savedUrl.isNotEmpty) {
        baseUrl = savedUrl;
      }
      initSocket();
    } catch (e) {
      debugPrint('[DriverApiService] Init error: $e');
    }
  }

  static String get socketUrl {
    return baseUrl.replaceAll('/api', '');
  }

  /// Initialize real-time Socket.IO connection
  static void initSocket() {
    try {
      if (_socket != null && _socket!.connected) return;

      _socket = socket_io.io(
        socketUrl,
        socket_io.OptionBuilder()
            .setTransports(['websocket', 'polling'])
            .disableAutoConnect()
            .enableReconnection()
            .build(),
      );

      _socket?.onConnect((_) {
        debugPrint('[DriverSocket] Connected: ${_socket?.id}');
        if (_driverId != null) {
          _socket?.emit('join:driver', _driverId);
        }
      });

      _socket?.onDisconnect((_) => debugPrint('[DriverSocket] Disconnected'));
      _socket?.connect();
    } catch (e) {
      debugPrint('[DriverSocket] Connection error: $e');
    }
  }

  /// Broadcast live GPS coordinates to Socket.IO and backend
  static void emitLocationUpdate({
    required double lat,
    required double lng,
    double heading = 0.0,
    double speed = 0.0,
    String? bookingId,
    String? address,
  }) {
    if (_socket != null && _socket!.connected && _driverId != null) {
      _socket!.emit('driver:location_update', {
        'driverId': _driverId,
        'bookingId': bookingId,
        'lat': lat,
        'lng': lng,
        'heading': heading,
        'speed': speed,
        'address': address ?? 'Live Route Navigation',
      });
    }
  }

  static Map<String, String> _getHeaders() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_authToken != null && _authToken!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  static Future<bool> checkHealth() async {
    try {
      final response = await http
          .get(Uri.parse('$baseUrl/health'))
          .timeout(const Duration(seconds: 3));
      return response.statusCode == 200;
    } catch (_) {
      try {
        final altResp = await http
            .get(Uri.parse('$defaultEmulatorUrl/health'))
            .timeout(const Duration(seconds: 2));
        if (altResp.statusCode == 200) {
          baseUrl = defaultEmulatorUrl;
          return true;
        }
      } catch (_) {}
      return false;
    }
  }

  /// Driver Login with Mobile Number
  static Future<Map<String, dynamic>?> driverLogin(String mobile) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/driver-login'),
            headers: _getHeaders(),
            body: jsonEncode({'mobile': mobile}),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final resData = data['data'];
          _authToken = resData['token'];
          if (resData['driver'] != null) {
            _driverId = resData['driver']['_id'];
          }

          final prefs = await SharedPreferences.getInstance();
          if (_authToken != null) prefs.setString('droptaxi_driver_token', _authToken!);
          if (_driverId != null) {
            prefs.setString('droptaxi_driver_id', _driverId!);
            _socket?.emit('join:driver', _driverId);
          }

          return resData;
        }
      }
    } catch (e) {
      debugPrint('[DriverApiService] driverLogin error: $e');
    }
    return null;
  }

  /// Driver Partner KYC Registration
  static Future<Map<String, dynamic>?> driverRegister({
    required String name,
    required String mobile,
    String? email,
    required String serviceType,
    required String vehicleNumber,
    required String vehicleModel,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/driver-register'),
            headers: _getHeaders(),
            body: jsonEncode({
              'name': name,
              'mobile': mobile,
              'email': email ?? 'driver_${mobile.replaceAll(RegExp(r'\D'), '')}@droptaxi.com',
              'serviceType': serviceType,
              'vehicleNumber': vehicleNumber,
              'vehicleModel': vehicleModel,
            }),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final resData = data['data'];
          _authToken = resData['token'];
          if (resData['driver'] != null) {
            _driverId = resData['driver']['_id'];
          }

          final prefs = await SharedPreferences.getInstance();
          if (_authToken != null) prefs.setString('droptaxi_driver_token', _authToken!);
          if (_driverId != null) prefs.setString('droptaxi_driver_id', _driverId!);

          return resData;
        }
      }
    } catch (e) {
      debugPrint('[DriverApiService] driverRegister error: $e');
    }
    return null;
  }

  /// Real-time Inquiry for Assigned and Available Trip Requests
  static Future<Map<String, dynamic>?> fetchDriverTrips(String? driverId) async {
    final targetId = driverId ?? _driverId;
    if (targetId == null) return null;

    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/bookings/driver/$targetId/trips'),
            headers: _getHeaders(),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return data['data'];
        }
      }
    } catch (e) {
      debugPrint('[DriverApiService] fetchDriverTrips error: $e');
    }
    return null;
  }

  /// Update Driver Online Status (ONLINE / OFFLINE)
  static Future<bool> updateOnlineStatus(String onlineStatus, {String? driverId}) async {
    final targetId = driverId ?? _driverId;
    if (targetId == null) return false;

    try {
      final response = await http
          .patch(
            Uri.parse('$baseUrl/drivers/$targetId/online-status'),
            headers: _getHeaders(),
            body: jsonEncode({'onlineStatus': onlineStatus}),
          )
          .timeout(const Duration(seconds: 4));

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      debugPrint('[DriverApiService] updateOnlineStatus error: $e');
      return false;
    }
  }

  /// Accept Trip
  static Future<Map<String, dynamic>?> acceptTrip(String bookingId, {String? driverId}) async {
    final targetId = driverId ?? _driverId;
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/bookings/$bookingId/accept'),
            headers: _getHeaders(),
            body: jsonEncode({'driverId': targetId}),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        return data['data'];
      }
    } catch (e) {
      debugPrint('[DriverApiService] acceptTrip error: $e');
    }
    return null;
  }

  /// Start Trip
  static Future<bool> startTrip(String bookingId) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/bookings/$bookingId/start'),
            headers: _getHeaders(),
          )
          .timeout(const Duration(seconds: 5));

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      debugPrint('[DriverApiService] startTrip error: $e');
      return false;
    }
  }

  /// Complete Trip with OTP
  static Future<bool> completeTrip(String bookingId, String otp) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/bookings/$bookingId/complete'),
            headers: _getHeaders(),
            body: jsonEncode({'otp': otp}),
          )
          .timeout(const Duration(seconds: 5));

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      debugPrint('[DriverApiService] completeTrip error: $e');
      return false;
    }
  }
}
