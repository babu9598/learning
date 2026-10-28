enum ServiceType { dropTaxi, goodsTruck }

class VehicleModel {
  final String id;
  final ServiceType serviceType;
  final String name;
  final String subtitle;
  final String category;
  final String? capacitySeats;
  final String? capacityBags;
  final String? payloadCapacity;
  final String? dimension;
  final int fareMin;
  final int fareMax;
  final int ratePerKm;
  final String eta;
  final String iconEmoji;
  final String imageUrl;
  final bool popular;
  final bool bestValue;
  final List<String> features;

  const VehicleModel({
    required this.id,
    required this.serviceType,
    required this.name,
    required this.subtitle,
    required this.category,
    this.capacitySeats,
    this.capacityBags,
    this.payloadCapacity,
    this.dimension,
    required this.fareMin,
    required this.fareMax,
    required this.ratePerKm,
    required this.eta,
    required this.iconEmoji,
    required this.imageUrl,
    this.popular = false,
    this.bestValue = false,
    required this.features,
  });
}
