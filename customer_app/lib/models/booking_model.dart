import 'vehicle_model.dart';
import 'driver_model.dart';

enum BookingStatus {
  idle,
  searching,
  driverAssigned,
  confirmed,
  inTransit,
  completed,
  paid,
}

enum PaymentMethod {
  upi,
  card,
  cash,
  wallet,
}

class BookingModel {
  final String bookingId;
  final ServiceType serviceType;
  final VehicleModel selectedVehicle;
  final String pickupAddress;
  final String dropAddress;
  final int distanceKm;
  final String estimatedTime;
  final String? goodsType;
  final int estimatedFareMin;
  final int estimatedFareMax;
  final int finalFare;
  final int baseFare;
  final int tollCharges;
  final int driverTip;
  final String otp;
  final DriverModel? driver;
  final BookingStatus status;
  final PaymentMethod paymentMethod;
  final String? transactionId;

  const BookingModel({
    required this.bookingId,
    required this.serviceType,
    required this.selectedVehicle,
    required this.pickupAddress,
    required this.dropAddress,
    required this.distanceKm,
    required this.estimatedTime,
    this.goodsType,
    required this.estimatedFareMin,
    required this.estimatedFareMax,
    required this.finalFare,
    required this.baseFare,
    required this.tollCharges,
    required this.driverTip,
    required this.otp,
    this.driver,
    required this.status,
    this.paymentMethod = PaymentMethod.upi,
    this.transactionId,
  });

  BookingModel copyWith({
    String? bookingId,
    ServiceType? serviceType,
    VehicleModel? selectedVehicle,
    String? pickupAddress,
    String? dropAddress,
    int? distanceKm,
    String? estimatedTime,
    String? goodsType,
    int? estimatedFareMin,
    int? estimatedFareMax,
    int? finalFare,
    int? baseFare,
    int? tollCharges,
    int? driverTip,
    String? otp,
    DriverModel? driver,
    BookingStatus? status,
    PaymentMethod? paymentMethod,
    String? transactionId,
  }) {
    return BookingModel(
      bookingId: bookingId ?? this.bookingId,
      serviceType: serviceType ?? this.serviceType,
      selectedVehicle: selectedVehicle ?? this.selectedVehicle,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      dropAddress: dropAddress ?? this.dropAddress,
      distanceKm: distanceKm ?? this.distanceKm,
      estimatedTime: estimatedTime ?? this.estimatedTime,
      goodsType: goodsType ?? this.goodsType,
      estimatedFareMin: estimatedFareMin ?? this.estimatedFareMin,
      estimatedFareMax: estimatedFareMax ?? this.estimatedFareMax,
      finalFare: finalFare ?? this.finalFare,
      baseFare: baseFare ?? this.baseFare,
      tollCharges: tollCharges ?? this.tollCharges,
      driverTip: driverTip ?? this.driverTip,
      otp: otp ?? this.otp,
      driver: driver ?? this.driver,
      status: status ?? this.status,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      transactionId: transactionId ?? this.transactionId,
    );
  }
}
