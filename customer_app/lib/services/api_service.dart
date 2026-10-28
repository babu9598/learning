import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:socket_io_client/socket_io_client.dart' as socket_io;

class CustomerApiService {
  static const String defaultLocalUrl = 'http://127.0.0.1:5000/api';
  static const String defaultEmulatorUrl = 'http://10.0.2.2:5000/api';

  static String baseUrl = defaultLocalUrl;

  static String? _authToken;
  static String? _customerId;
  static socket_io.Socket? _socket;

  static String? get authToken => _authToken;
  static String? get customerId => _customerId;
  static socket_io.Socket? get socket => _socket;

  static String get socketUrl => baseUrl.replaceAll('/api', '');

  /// Initialize and restore stored session token & Socket.IO
  static Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _authToken = prefs.getString('droptaxi_customer_token');
      _customerId = prefs.getString('droptaxi_customer_id');
      final savedUrl = prefs.getString('droptaxi_api_url');
      if (savedUrl != null && savedUrl.isNotEmpty) {
        baseUrl = savedUrl;
      }
      initSocket();
    } catch (e) {
      debugPrint('[ApiService] Init error: $e');
    }
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
        debugPrint('[CustomerSocket] Connected: ${_socket?.id}');
        if (_customerId != null) {
          _socket?.emit('join:customer', _customerId);
        }
      });

      _socket?.onDisconnect((_) => debugPrint('[CustomerSocket] Disconnected'));
      _socket?.connect();
    } catch (e) {
      debugPrint('[CustomerSocket] Connection error: $e');
    }
  }

  static void joinBookingRoom(String bookingId) {
    if (_socket != null && _socket!.connected && bookingId.isNotEmpty) {
      _socket?.emit('join:booking', bookingId);
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

  /// Health Check
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

  /// Customer OTP Login or Auto-Register
  static Future<Map<String, dynamic>?> customerLogin({
    required String mobile,
    String? name,
    String? email,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/auth/customer-login'),
            headers: _getHeaders(),
            body: jsonEncode({
              'mobile': mobile,
              'name': name ?? 'Rahul Kumar',
              'email': email ?? 'cust_${mobile.replaceAll(RegExp(r'\D'), '')}@droptaxi.com',
            }),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final resData = data['data'];
          _authToken = resData['token'];
          if (resData['customer'] != null) {
            _customerId = resData['customer']['_id'];
          }

          final prefs = await SharedPreferences.getInstance();
          if (_authToken != null) prefs.setString('droptaxi_customer_token', _authToken!);
          if (_customerId != null) {
            prefs.setString('droptaxi_customer_id', _customerId!);
            _socket?.emit('join:customer', _customerId);
          }

          return resData;
        }
      }
    } catch (e) {
      debugPrint('[ApiService] customerLogin error: $e');
    }
    return null;
  }

  /// Dynamic Database Fare Calculation API
  static Future<Map<String, dynamic>?> calculateFare({
    required String vehicleCategory,
    required String serviceType,
    required Map<String, dynamic> pickupLocation,
    required Map<String, dynamic> dropLocation,
    String? couponCode,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/fares/calculate'),
            headers: _getHeaders(),
            body: jsonEncode({
              'vehicleCategory': vehicleCategory,
              'serviceType': serviceType,
              'pickupLocation': pickupLocation,
              'dropLocation': dropLocation,
              if (couponCode != null) 'couponCode': couponCode,
            }),
          )
          .timeout(const Duration(seconds: 4));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return data['data'];
        }
      }
    } catch (e) {
      debugPrint('[ApiService] calculateFare error: $e');
    }
    return null;
  }

  /// Create Real Booking in MongoDB
  static Future<Map<String, dynamic>?> createBooking({
    required String customerMobile,
    required String customerName,
    required String serviceType,
    required String vehicleCategory,
    required String bookingType,
    required Map<String, dynamic> pickupLocation,
    required Map<String, dynamic> dropLocation,
    required int distanceKm,
    required String paymentMethod,
    Map<String, dynamic>? goodsDetails,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/bookings/customer-book'),
            headers: _getHeaders(),
            body: jsonEncode({
              'mobile': customerMobile,
              'customerName': customerName,
              'serviceType': serviceType,
              'vehicleCategory': vehicleCategory,
              'bookingType': bookingType,
              'pickupLocation': pickupLocation,
              'dropLocation': dropLocation,
              'distanceKm': distanceKm,
              'paymentMethod': paymentMethod,
              if (goodsDetails != null) 'goodsDetails': goodsDetails,
            }),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          final res = data['data'];
          if (res['_id'] != null) {
            joinBookingRoom(res['_id']);
          }
          return res;
        }
      }
    } catch (e) {
      debugPrint('[ApiService] createBooking error: $e');
    }
    return null;
  }

  /// Get Live Booking Details by ID
  static Future<Map<String, dynamic>?> getBookingById(String bookingId) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/bookings/public/$bookingId'),
            headers: _getHeaders(),
          )
          .timeout(const Duration(seconds: 4));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['data'] != null) {
          return data['data']['booking'];
        }
      }
    } catch (e) {
      debugPrint('[ApiService] getBookingById error: $e');
    }
    return null;
  }

  /// Create Payment Order (Razorpay / Wallet / UPI / Cash)
  static Future<Map<String, dynamic>?> createPaymentOrder({
    required String bookingId,
    required String paymentMethod,
    double? amount,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/payments/create-order'),
            headers: _getHeaders(),
            body: jsonEncode({
              'bookingId': bookingId,
              'paymentMethod': paymentMethod,
              if (amount != null) 'amount': amount,
            }),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return data['data'];
        }
      }
    } catch (e) {
      debugPrint('[ApiService] createPaymentOrder error: $e');
    }
    return null;
  }

  /// Verify Payment with Server & MongoDB
  static Future<Map<String, dynamic>?> verifyPayment({
    required String bookingId,
    required String paymentMethod,
    String? transactionId,
    String? razorpayPaymentId,
    String? razorpayOrderId,
    String? razorpaySignature,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/payments/verify'),
            headers: _getHeaders(),
            body: jsonEncode({
              'bookingId': bookingId,
              'paymentMethod': paymentMethod,
              'transactionId': transactionId,
              'razorpayPaymentId': razorpayPaymentId,
              'razorpayOrderId': razorpayOrderId,
              'razorpaySignature': razorpaySignature,
            }),
          )
          .timeout(const Duration(seconds: 6));

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return data['data'];
        }
      }
    } catch (e) {
      debugPrint('[ApiService] verifyPayment error: $e');
    }
    return null;
  }
}
