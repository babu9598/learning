import '../constants/app_constants.dart';

enum BookingTripState {
  idle,
  requestReceived,
  otpVerification,
  confirmed,
  liveTrip,
  completed,
  paymentCollection,
}

class BookingRequestModel {
  String id;
  String customerName;
  String customerPhone;
  String pickupLocation;
  String dropLocation;
  double pickupDistanceKm;
  double tripDistanceKm;
  String approxAmountRange;
  double finalAmount;
  String otp;
  String vehicleLabel;
  PaymentMethodType paymentMethod;
  BookingTripState state;
  DateTime requestedAt;

  BookingRequestModel({
    this.id = '#DT7056',
    this.customerName = 'Ramesh Kumar',
    this.customerPhone = '+91 98765 43210',
    this.pickupLocation = 'Coimbatore, Tamil Nadu',
    this.dropLocation = 'RS Puram, Coimbatore',
    this.pickupDistanceKm = 2.8,
    this.tripDistanceKm = 14.2,
    this.approxAmountRange = '₹ 320 - ₹ 380',
    this.finalAmount = 360.0,
    this.otp = '4793',
    this.vehicleLabel = 'Sedan (TN 09 AB 1234)',
    this.paymentMethod = PaymentMethodType.cash,
    this.state = BookingTripState.requestReceived,
    DateTime? requestedAt,
  }) : requestedAt = requestedAt ?? DateTime.now();
}
