import '../constants/app_constants.dart';

class DriverModel {
  String id;
  String name;
  String phone;
  String email;
  String driverCode;
  bool isVerified;
  bool isOnline;
  DriverServiceType serviceType;
  String vehicleType;
  String vehicleNumber;
  String vehicleModel;
  String vehicleColor;
  double todayEarnings;
  int completedRides;
  double totalEarnings;
  double pendingAmount;
  double rating;
  Map<String, bool> uploadedDocuments;

  DriverModel({
    this.id = 'DRV001',
    this.name = 'Ramesh Kumar',
    this.phone = '+91 98765 43210',
    this.email = 'ramesh.driver@droptaxi.in',
    this.driverCode = 'DT123456',
    this.isVerified = true,
    this.isOnline = true,
    this.serviceType = DriverServiceType.dropTaxi,
    this.vehicleType = 'Sedan',
    this.vehicleNumber = 'TN 09 AB 1234',
    this.vehicleModel = 'Toyota Etios',
    this.vehicleColor = 'White',
    this.todayEarnings = 1250.0,
    this.completedRides = 5,
    this.totalEarnings = 12480.0,
    this.pendingAmount = 0.0,
    this.rating = 4.85,
    Map<String, bool>? uploadedDocuments,
  }) : uploadedDocuments = uploadedDocuments ?? {
          'aadhar': true,
          'pan': true,
          'driving_license': true,
          'rc_book': true,
          'fc_certificate': true,
        };
}
