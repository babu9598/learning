enum DriverServiceType {
  dropTaxi,
  goodsTruck,
}

enum OrderStatus {
  all,
  ongoing,
  completed,
  cancelled,
}

enum PaymentMethodType {
  cash,
  upi,
  card,
}

class AppConstants {
  static const String googleMapsApiKey = '';

  static const List<Map<String, dynamic>> taxiVehicleTypes = [
    {
      'id': 'sedan',
      'name': 'Sedan',
      'models': 'Toyota Etios / Dzire',
      'iconEmoji': '🚗',
      'imageAsset': 'assets/images/sedan.png',
      'capacity': '4 Passengers',
      'ratePerKm': 14,
    },
    {
      'id': 'suv',
      'name': 'SUV',
      'models': 'Maruti Ertiga / Triber',
      'iconEmoji': '🚙',
      'imageAsset': 'assets/images/suv.png',
      'capacity': '6 Passengers',
      'ratePerKm': 18,
    },
    {
      'id': 'innova',
      'name': 'Innova',
      'models': 'Innova Crysta Luxury',
      'iconEmoji': '🚘',
      'imageAsset': 'assets/images/innova.png',
      'capacity': '7 Passengers',
      'ratePerKm': 22,
    },
  ];

  static const List<Map<String, dynamic>> truckVehicleTypes = [
    {
      'id': 'mini_truck',
      'name': 'Tata Ace / Mini Truck',
      'models': 'Tata Ace Gold / Bolero Maxi',
      'iconEmoji': '🛻',
      'imageAsset': 'assets/images/tata_ace.png',
      'capacity': '850 kg Payload',
      'ratePerKm': 22,
    },
    {
      'id': 'pickup_8ft',
      'name': 'Pickup 8ft',
      'models': 'Mahindra Bolero Pickup',
      'iconEmoji': '🚚',
      'imageAsset': 'assets/images/bolero_pickup.png',
      'capacity': '1.5 Tons Payload',
      'ratePerKm': 28,
    },
    {
      'id': 'truck_14ft',
      'name': '14ft Truck',
      'models': 'Eicher Pro / Tata 407',
      'iconEmoji': '🚛',
      'imageAsset': 'assets/images/truck_14ft.png',
      'capacity': '4 Tons Payload',
      'ratePerKm': 38,
    },
  ];

  static const List<Map<String, String>> kycDocuments = [
    {
      'id': 'driving_license',
      'title': '1. Driving Licence',
      'subtitle': 'Front & Back Photo',
      'icon': 'directions_car',
    },
    {
      'id': 'rc_book',
      'title': '2. RC Book (Registration)',
      'subtitle': 'Front & Back Photo',
      'icon': 'assignment',
    },
    {
      'id': 'fc_certificate',
      'title': '3. FC (Fitness Certificate)',
      'subtitle': 'RTO Fitness Sheet Photo',
      'icon': 'verified_user',
    },
    {
      'id': 'insurance',
      'title': '4. Vehicle Insurance',
      'subtitle': 'Commercial Policy Photo',
      'icon': 'shield',
    },
    {
      'id': 'aadhar',
      'title': '5. Aadhaar Card',
      'subtitle': 'UIDAI Front & Back',
      'icon': 'badge',
    },
    {
      'id': 'pan',
      'title': '6. PAN Card',
      'subtitle': 'Income Tax Card Photo',
      'icon': 'credit_card',
    },
    {
      'id': 'live_photo',
      'title': '7. Live Selfie Picture',
      'subtitle': 'Front Camera Face Photo',
      'icon': 'camera_alt',
    },
  ];

  static const List<Map<String, dynamic>> sampleOrders = [
    {
      'orderId': '#DT7056',
      'pickup': 'Coimbatore',
      'drop': 'RS Puram',
      'service': 'Drop Taxi',
      'date': '12 Sep 2025, 06:45 PM',
      'status': OrderStatus.completed,
      'amount': '₹ 360',
      'isGoods': false,
    },
    {
      'orderId': '#DT7055',
      'pickup': 'Thoppur',
      'drop': 'Avinashi',
      'service': 'Goods Truck',
      'date': '12 Sep 2025, 04:20 PM',
      'status': OrderStatus.completed,
      'amount': '₹ 2,450',
      'isGoods': true,
    },
    {
      'orderId': '#DT7054',
      'pickup': 'Peelamedu',
      'drop': 'Gandhipuram',
      'service': 'Drop Taxi',
      'date': '12 Sep 2025, 02:10 PM',
      'status': OrderStatus.completed,
      'amount': '₹ 280',
      'isGoods': false,
    },
  ];
}
