class DriverModel {
  final String id;
  final String name;
  final String phone;
  final String photoUrl;
  final double rating;
  final int totalRides;
  final String vehicleModel;
  final String vehicleNumber;
  final String vehicleColor;
  final int etaMinutes;

  const DriverModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.photoUrl,
    required this.rating,
    required this.totalRides,
    required this.vehicleModel,
    required this.vehicleNumber,
    required this.vehicleColor,
    required this.etaMinutes,
  });
}
