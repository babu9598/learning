import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../constants/app_constants.dart';
import '../providers/driver_provider.dart';

class Screen3DriverRegistration extends StatefulWidget {
  const Screen3DriverRegistration({super.key});

  @override
  State<Screen3DriverRegistration> createState() => _Screen3DriverRegistrationState();
}

class _Screen3DriverRegistrationState extends State<Screen3DriverRegistration> {
  final TextEditingController _vehicleNumberController = TextEditingController(text: 'TN 09 AB 1234');
  final TextEditingController _modelController = TextEditingController(text: 'Toyota Etios');
  final TextEditingController _colorController = TextEditingController(text: 'White');

  @override
  void dispose() {
    _vehicleNumberController.dispose();
    _modelController.dispose();
    _colorController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);
    final step = provider.registrationStep;

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () {
            if (step > 1) {
              provider.setRegistrationStep(step - 1);
            } else {
              provider.setScreen(2);
            }
          },
        ),
        title: Column(
          children: [
            Text(
              _getStepTitle(step),
              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Step $step of 4',
              style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w600),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Progress Step Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              color: Colors.white,
              child: Row(
                children: List.generate(4, (index) {
                  final s = index + 1;
                  final isCompleted = s < step;
                  final isCurrent = s == step;

                  return Expanded(
                    child: Row(
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: isCompleted
                                ? AppColors.emeraldGreen
                                : isCurrent
                                    ? AppColors.oceanBlue
                                    : AppColors.lightSurface,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: isCurrent
                                  ? AppColors.oceanBlue
                                  : isCompleted
                                      ? AppColors.emeraldGreen
                                      : AppColors.lightBorder,
                              width: 2,
                            ),
                          ),
                          child: Center(
                            child: isCompleted
                                ? const Icon(Icons.check, color: Colors.white, size: 16)
                                : Text(
                                    '$s',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: isCurrent ? Colors.white : AppColors.textDark,
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                        if (index < 3)
                          Expanded(
                            child: Container(
                              height: 3,
                              color: s < step ? AppColors.emeraldGreen : AppColors.lightBorder,
                            ),
                          ),
                      ],
                    ),
                  );
                }),
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(22),
                child: _buildStepContent(step, provider),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _getStepTitle(int step) {
    switch (step) {
      case 1:
        return 'Choose Service Type';
      case 2:
        return 'Vehicle Type';
      case 3:
        return 'Vehicle Details';
      case 4:
        return 'Upload Documents';
      default:
        return 'Registration';
    }
  }

  Widget _buildStepContent(int step, DriverProvider provider) {
    switch (step) {
      case 1:
        return _buildStep1ServiceType(provider);
      case 2:
        return _buildStep2VehicleType(provider);
      case 3:
        return _buildStep3VehicleDetails(provider);
      case 4:
        return _buildStep4Documents(provider);
      default:
        return _buildStep1ServiceType(provider);
    }
  }

  // STEP 1: Choose Service Type (Drop Taxi vs Goods Truck)
  Widget _buildStep1ServiceType(DriverProvider provider) {
    final selected = provider.driver.serviceType;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Service Type',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        Text(
          'Choose the primary vehicle category you wish to drive with DropTaxi',
          style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 20),

        // Drop Taxi Option Card
        InkWell(
          onTap: () => provider.updateServiceType(DriverServiceType.dropTaxi),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.lightCard,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: selected == DriverServiceType.dropTaxi ? AppColors.oceanBlue : AppColors.lightBorder,
                width: selected == DriverServiceType.dropTaxi ? 2 : 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: selected == DriverServiceType.dropTaxi ? AppColors.oceanBlue.withOpacity(0.12) : Colors.black.withOpacity(0.02),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.oceanBlueLight,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.local_taxi_rounded, color: AppColors.oceanBlue, size: 32),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Drop Taxi',
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Passenger Outstation & Intercity Rides',
                        style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Sedan • SUV • Innova Crysta',
                        style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                Icon(
                  selected == DriverServiceType.dropTaxi ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                  color: selected == DriverServiceType.dropTaxi ? AppColors.oceanBlue : AppColors.textDark,
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 14),

        // Goods Truck Option Card
        InkWell(
          onTap: () => provider.updateServiceType(DriverServiceType.goodsTruck),
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.lightCard,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: selected == DriverServiceType.goodsTruck ? AppColors.cargoGold : AppColors.lightBorder,
                width: selected == DriverServiceType.goodsTruck ? 2 : 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: selected == DriverServiceType.goodsTruck ? AppColors.cargoGold.withOpacity(0.12) : Colors.black.withOpacity(0.02),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.cargoGoldLight,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.local_shipping_rounded, color: AppColors.cargoGold, size: 32),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Goods Truck',
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Commercial Cargo & Logistics Transport',
                        style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Tata Ace • Pickup • 14ft Freight',
                        style: GoogleFonts.inter(color: AppColors.cargoGold, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                Icon(
                  selected == DriverServiceType.goodsTruck ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                  color: selected == DriverServiceType.goodsTruck ? AppColors.cargoGold : AppColors.textDark,
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 36),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () => provider.setRegistrationStep(2),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.oceanBlue,
              elevation: 4,
              shadowColor: AppColors.oceanBlue.withOpacity(0.4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Next', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // STEP 2: Vehicle Type
  Widget _buildStep2VehicleType(DriverProvider provider) {
    final isGoods = provider.driver.serviceType == DriverServiceType.goodsTruck;
    final list = isGoods ? AppConstants.truckVehicleTypes : AppConstants.taxiVehicleTypes;
    final currentType = provider.driver.vehicleType;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Select Vehicle Type',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        Text(
          'Choose your vehicle category and model segment',
          style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 20),

        ...list.map((v) {
          final isSelected = currentType == v['name'];

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              onTap: () => provider.updateVehicleType(v['name']),
              borderRadius: BorderRadius.circular(18),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected ? (isGoods ? AppColors.cargoGold : AppColors.oceanBlue) : AppColors.lightBorder,
                    width: isSelected ? 2 : 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: isSelected ? (isGoods ? AppColors.cargoGold.withOpacity(0.12) : AppColors.oceanBlue.withOpacity(0.12)) : Colors.black.withOpacity(0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 72,
                      height: 56,
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        color: isGoods ? AppColors.cargoGoldLight : AppColors.oceanBlueLight,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.asset(
                          v['imageAsset'] ?? '',
                          fit: BoxFit.contain,
                          errorBuilder: (_, __, ___) => Center(
                            child: Text(v['iconEmoji'], style: const TextStyle(fontSize: 26)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(v['name'], style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
                          Text(v['models'], style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                          Text(v['capacity'], style: GoogleFonts.inter(color: isGoods ? AppColors.cargoGold : AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textDark, size: 14),
                  ],
                ),
              ),
            ),
          );
        }),

        const SizedBox(height: 28),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () => provider.setRegistrationStep(3),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.oceanBlue,
              elevation: 4,
              shadowColor: AppColors.oceanBlue.withOpacity(0.4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Next', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // STEP 3: Vehicle Details
  Widget _buildStep3VehicleDetails(DriverProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Vehicle Header Showcase Container
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.lightCard,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.lightBorder),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: AppColors.oceanBlueLight,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.cloudySky),
                ),
                child: Center(
                  child: Text(
                    provider.driver.serviceType == DriverServiceType.goodsTruck ? '🚚' : '🚗',
                    style: const TextStyle(fontSize: 48),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'Vehicle Specifications',
                style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              Text(
                'Provide vehicle registration and make information',
                style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Vehicle Number
        Text('VEHICLE NUMBER', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.lightBorder),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: TextField(
            controller: _vehicleNumberController,
            textCapitalization: TextCapitalization.characters,
            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'e.g. TN 09 AB 1234',
              hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
              border: InputBorder.none,
            ),
          ),
        ),

        const SizedBox(height: 14),

        // Model / Brand
        Text('MODEL / BRAND', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.lightBorder),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: TextField(
            controller: _modelController,
            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'e.g. Toyota Etios / Maruti Dzire',
              hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
              border: InputBorder.none,
            ),
          ),
        ),

        const SizedBox(height: 14),

        // Color
        Text('VEHICLE COLOR', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
        const SizedBox(height: 6),
        Container(
          decoration: BoxDecoration(
            color: AppColors.lightCard,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.lightBorder),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14),
          child: TextField(
            controller: _colorController,
            style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 14),
            decoration: InputDecoration(
              hintText: 'e.g. White / Silver / Grey',
              hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
              border: InputBorder.none,
            ),
          ),
        ),

        const SizedBox(height: 28),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              provider.updateVehicleDetails(
                number: _vehicleNumberController.text.trim(),
                model: _modelController.text.trim(),
                color: _colorController.text.trim(),
              );
              provider.setRegistrationStep(4);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.oceanBlue,
              elevation: 4,
              shadowColor: AppColors.oceanBlue.withOpacity(0.4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Next', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // STEP 4: Upload Documents
  Widget _buildStep4Documents(DriverProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Upload Documents',
          style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 4),
        Text(
          'Please submit clear front & back photos of valid KYC documents',
          style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 20),

        ...AppConstants.kycDocuments.map((doc) {
          final id = doc['id']!;
          final isUploaded = provider.driver.uploadedDocuments[id] ?? false;

          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.lightCard,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: isUploaded ? AppColors.emeraldGreen.withOpacity(0.5) : AppColors.lightBorder,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isUploaded ? AppColors.emeraldGreenLight : AppColors.oceanBlueLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isUploaded ? Icons.verified_rounded : Icons.file_present_rounded,
                    color: isUploaded ? AppColors.emeraldGreen : AppColors.oceanBlue,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(doc['title']!, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                      Text(doc['subtitle']!, style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11)),
                    ],
                  ),
                ),
                InkWell(
                  onTap: () {
                    provider.toggleDocumentUpload(id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('${doc['title']} status updated.')),
                    );
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: isUploaded ? AppColors.emeraldGreenLight : AppColors.lightSurface,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: isUploaded ? AppColors.emeraldGreen : AppColors.lightBorder),
                    ),
                    child: Row(
                      children: [
                        Text(
                          isUploaded ? 'Uploaded' : 'Upload',
                          style: GoogleFonts.inter(
                            color: isUploaded ? AppColors.emeraldGreen : AppColors.oceanBlue,
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(
                          isUploaded ? Icons.check_circle_rounded : Icons.upload_file_rounded,
                          color: isUploaded ? AppColors.emeraldGreen : AppColors.oceanBlue,
                          size: 14,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        }),

        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: () {
              provider.completeRegistration();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppColors.emeraldGreen,
                  content: Text('🎉 Registration Submitted & Verified! Welcome to DropTaxi.'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.oceanBlue,
              elevation: 4,
              shadowColor: AppColors.oceanBlue.withOpacity(0.4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Submit & Launch Dashboard', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                const Icon(Icons.check_circle_rounded, color: Colors.white, size: 18),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
