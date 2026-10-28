import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen1Login extends StatefulWidget {
  const Screen1Login({super.key});

  @override
  State<Screen1Login> createState() => _Screen1LoginState();
}

class _Screen1LoginState extends State<Screen1Login> {
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  String _selectedCountryCode = '+91';
  String _selectedCountryFlag = '🇮🇳';
  bool _isLoading = false;
  bool _agreedToTerms = true;
  String? _errorMessage;

  final List<Map<String, String>> _countries = [
    {'code': '+91', 'flag': '🇮🇳', 'name': 'India', 'digits': '10'},
    {'code': '+1', 'flag': '🇺🇸', 'name': 'United States', 'digits': '10'},
    {'code': '+971', 'flag': '🇦🇪', 'name': 'UAE / Dubai', 'digits': '9'},
    {'code': '+44', 'flag': '🇬🇧', 'name': 'United Kingdom', 'digits': '10'},
    {'code': '+65', 'flag': '🇸🇬', 'name': 'Singapore', 'digits': '8'},
    {'code': '+966', 'flag': '🇸🇦', 'name': 'Saudi Arabia', 'digits': '9'},
    {'code': '+974', 'flag': '🇶🇦', 'name': 'Qatar', 'digits': '8'},
    {'code': '+61', 'flag': '🇦🇺', 'name': 'Australia', 'digits': '9'},
    {'code': '+60', 'flag': '🇲🇾', 'name': 'Malaysia', 'digits': '9'},
    {'code': '+49', 'flag': '🇩🇪', 'name': 'Germany', 'digits': '10'},
  ];

  @override
  void dispose() {
    _phoneController.dispose();
    super.dispose();
  }

  void _handleGetOtp() async {
    final rawPhone = _phoneController.text.trim().replaceAll(RegExp(r'\D'), '');
    if (rawPhone.length < 8) {
      setState(() {
        _errorMessage = 'Please enter a valid mobile number (8-10 digits)';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final provider = Provider.of<BookingProvider>(context, listen: false);
    provider.updatePhoneNumber(rawPhone, countryCode: _selectedCountryCode);
    provider.sendOtp();

    await Future.delayed(const Duration(milliseconds: 500));

    if (!mounted) return;
    setState(() {
      _isLoading = false;
    });

    // Show luxury simulated SMS Toast Banner
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.darkCard,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18),
          side: const BorderSide(color: AppColors.oceanBlue, width: 1.5),
        ),
        duration: const Duration(seconds: 4),
        content: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.oceanBlue, AppColors.deepBlue],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.sms_rounded, color: AppColors.cloudySky, size: 20),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'MESSAGES • NOW',
                        style: GoogleFonts.inter(
                          color: AppColors.cloudySkyDark,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.emeraldGreen.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'Instant OTP',
                          style: GoogleFonts.inter(color: AppColors.emeraldGreen, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Your DropTaxi verification code is ${provider.generatedOtp}',
                    style: GoogleFonts.plusJakartaSans(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );

    // Navigate smoothly to Screen 2
    provider.setScreen(2);
  }

  void _showCountryPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.darkCard,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
      ),
      builder: (ctx) {
        String searchQuery = '';
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filteredCountries = _countries.where((c) {
              return c['name']!.toLowerCase().contains(searchQuery.toLowerCase()) ||
                  c['code']!.contains(searchQuery);
            }).toList();

            return Container(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.75,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Select Country Code',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: AppColors.cloudySky, size: 22),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Search Box
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.darkSurface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.borderDark),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: TextField(
                      style: GoogleFonts.inter(color: Colors.white, fontSize: 14),
                      decoration: InputDecoration(
                        icon: const Icon(Icons.search_rounded, color: AppColors.cloudySkyDark, size: 20),
                        hintText: 'Search country or code...',
                        hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                        border: InputBorder.none,
                      ),
                      onChanged: (val) {
                        setModalState(() => searchQuery = val);
                      },
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.separated(
                      itemCount: filteredCountries.length,
                      separatorBuilder: (_, __) => const Divider(color: AppColors.borderDark, height: 1),
                      itemBuilder: (ctx, idx) {
                        final c = filteredCountries[idx];
                        final isSelected = c['code'] == _selectedCountryCode;
                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          leading: Text(c['flag']!, style: const TextStyle(fontSize: 26)),
                          title: Text(
                            c['name']!,
                            style: GoogleFonts.inter(
                              color: isSelected ? AppColors.cloudySky : Colors.white,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              fontSize: 14,
                            ),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: isSelected ? AppColors.oceanBlue.withOpacity(0.3) : AppColors.darkSurface,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: isSelected ? AppColors.oceanBlue : Colors.transparent,
                              ),
                            ),
                            child: Text(
                              c['code']!,
                              style: GoogleFonts.inter(
                                color: isSelected ? AppColors.cloudySky : AppColors.textCloudy,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                          onTap: () {
                            setState(() {
                              _selectedCountryCode = c['code']!;
                              _selectedCountryFlag = c['flag']!;
                            });
                            Navigator.pop(ctx);
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context, listen: false);

    return Scaffold(
      backgroundColor: AppColors.darkCanvas,
      body: Stack(
        children: [
          // Background Luxury Radial Glows (Ocean Blue & Cloudy Sky)
          Positioned(
            top: -80,
            right: -80,
            child: Container(
              width: 260,
              height: 260,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.oceanBlue.withOpacity(0.4),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: 100,
            left: -80,
            child: Container(
              width: 240,
              height: 240,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    AppColors.cloudySky.withOpacity(0.12),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const SizedBox(height: 8),

                  // Top Pill Badge with Cloudy Sky Border
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlueLight,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: AppColors.cloudySky),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.verified_rounded, color: AppColors.oceanBlue, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          'INDIA\'S #1 OUTSTATION & CARGO NETWORK',
                          style: GoogleFonts.plusJakartaSans(
                            color: AppColors.oceanBlue,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Premium RideNLoad Brand Emblem
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.oceanBlue.withOpacity(0.25),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: Image.asset(
                        'assets/images/ridenload_icon.png',
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Image.asset(
                          'assets/images/vaago_user_icon.png',
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => Container(
                            color: const Color(0xFF0F4471),
                            child: const Icon(Icons.local_taxi_rounded, color: Colors.white, size: 40),
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 14),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Ride',
                        style: GoogleFonts.plusJakartaSans(
                          color: const Color(0xFF0F4471),
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                        ),
                      ),
                      Text(
                        'N',
                        style: GoogleFonts.plusJakartaSans(
                          color: const Color(0xFF10B981),
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                        ),
                      ),
                      Text(
                        'Load',
                        style: GoogleFonts.plusJakartaSans(
                          color: const Color(0xFFF59E0B),
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Taxi + Goods Truck + More',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      color: AppColors.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Save 40% on One-Way Cabs • 1-Ton to 32ft Logistics',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(
                      color: AppColors.textMuted,
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),

                  const SizedBox(height: 24),


                  // Main Sign-In Card
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(26),
                      border: Border.all(color: AppColors.lightBorder),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x0F0F172A),
                          blurRadius: 24,
                          offset: Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Enter Mobile Number',
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.textPrimary,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.emeraldGreenLight,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.3)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.shield_rounded, color: AppColors.emeraldGreen, size: 12),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Secure OTP',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: AppColors.emeraldGreen,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'We will send a 4-digit verification code to your phone.',
                          style: GoogleFonts.plusJakartaSans(
                            color: AppColors.textMuted,
                            fontSize: 11,
                          ),
                        ),

                        const SizedBox(height: 18),

                        // Interactive Mobile Number Input
                        Container(
                          decoration: BoxDecoration(
                            color: AppColors.lightSurface,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: _errorMessage != null
                                  ? AppColors.crimsonRed
                                  : _phoneController.text.length >= 10
                                      ? AppColors.emeraldGreen
                                      : AppColors.oceanBlue.withOpacity(0.4),
                              width: 1.4,
                            ),
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          child: Row(
                            children: [
                              // Country Code Dropdown Button
                              InkWell(
                                onTap: _showCountryPicker,
                                borderRadius: BorderRadius.circular(10),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
                                  child: Row(
                                    children: [
                                      Text(_selectedCountryFlag, style: const TextStyle(fontSize: 20)),
                                      const SizedBox(width: 6),
                                      Text(
                                        _selectedCountryCode,
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.textPrimary,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.textMuted, size: 16),
                                    ],
                                  ),
                                ),
                              ),

                              Container(
                                height: 26,
                                width: 1,
                                color: AppColors.lightBorder,
                                margin: const EdgeInsets.symmetric(horizontal: 6),
                              ),

                              // Mobile Number Input Field
                              Expanded(
                                child: TextField(
                                  controller: _phoneController,
                                  keyboardType: TextInputType.phone,
                                  maxLength: 12,
                                  style: GoogleFonts.plusJakartaSans(
                                    color: AppColors.textPrimary,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: 1.2,
                                  ),
                                  decoration: InputDecoration(
                                    counterText: '',
                                    border: InputBorder.none,
                                    hintText: 'Enter 10-digit number',
                                    hintStyle: GoogleFonts.plusJakartaSans(
                                      color: AppColors.textDark,
                                      fontSize: 14,
                                      letterSpacing: 0,
                                    ),
                                  ),
                                  onChanged: (val) {
                                    setState(() {
                                      _errorMessage = null;
                                    });
                                  },
                                ),
                              ),

                              if (_phoneController.text.isNotEmpty)
                                GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _phoneController.clear();
                                    });
                                  },
                                  child: const Padding(
                                    padding: EdgeInsets.symmetric(horizontal: 6),
                                    child: Icon(Icons.cancel_rounded, color: AppColors.textMuted, size: 18),
                                  ),
                                ),

                              if (_phoneController.text.length >= 10)
                                const Padding(
                                  padding: EdgeInsets.only(right: 6),
                                  child: Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 20),
                                ),
                            ],
                          ),
                        ),

                        if (_errorMessage != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8, left: 4),
                            child: Row(
                              children: [
                                const Icon(Icons.error_outline_rounded, color: AppColors.crimsonRed, size: 14),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    _errorMessage!,
                                    style: GoogleFonts.plusJakartaSans(color: AppColors.crimsonRed, fontSize: 11, fontWeight: FontWeight.w600),
                                  ),
                                ),
                              ],
                            ),
                          ),

                        const SizedBox(height: 16),

                        // Quick Test Numbers
                        Text(
                          'QUICK DEMO NUMBERS:',
                          style: GoogleFonts.plusJakartaSans(
                            color: AppColors.textMuted,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.8,
                          ),
                        ),
                        const SizedBox(height: 8),
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildQuickNumberChip('9876543210', 'Rahul (Customer)'),
                              const SizedBox(width: 8),
                              _buildQuickNumberChip('9443210987', 'Priya (Corporate)'),
                              const SizedBox(width: 8),
                              _buildQuickNumberChip('8825761920', 'Chennai Logistics'),
                            ],
                          ),
                        ),

                        const SizedBox(height: 18),

                        // Terms & Conditions Checkbox
                        InkWell(
                          onTap: () {
                            setState(() {
                              _agreedToTerms = !_agreedToTerms;
                            });
                          },
                          borderRadius: BorderRadius.circular(8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Checkbox(
                                value: _agreedToTerms,
                                activeColor: AppColors.oceanBlue,
                                checkColor: Colors.white,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                                onChanged: (val) {
                                  setState(() {
                                    _agreedToTerms = val ?? true;
                                  });
                                },
                              ),
                              Expanded(
                                child: Padding(
                                  padding: const EdgeInsets.only(top: 10),
                                  child: Text(
                                    'I agree to the Terms of Service & Privacy Policy.',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: AppColors.textSecondary,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Primary CTA: Get Verification Code
                        SizedBox(
                          width: double.infinity,
                          height: 52,
                          child: ElevatedButton(
                            onPressed: (_isLoading || !_agreedToTerms) ? null : _handleGetOtp,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.oceanBlue,
                              disabledBackgroundColor: AppColors.oceanBlue.withOpacity(0.4),
                              elevation: 2,
                              shadowColor: AppColors.oceanBlue.withOpacity(0.3),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'Get Verification Code',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: Colors.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Alternative Quick Entry
                  Row(
                    children: [
                      const Expanded(child: Divider(color: AppColors.borderDark)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Text(
                          'OR EXPLORE DEMO',
                          style: GoogleFonts.inter(
                            color: AppColors.textDark,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider(color: AppColors.borderDark)),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Guest Login
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton.icon(
                      onPressed: () {
                        provider.loginAsGuest();
                      },
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.white,
                        side: const BorderSide(color: AppColors.lightBorder),
                        elevation: 1,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      icon: const Icon(Icons.explore_rounded, color: AppColors.oceanBlue, size: 20),
                      label: Text(
                        'Continue as Guest Demo',
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickNumberChip(String number, String label) {
    final isSelected = _phoneController.text == number;
    return InkWell(
      onTap: () {
        setState(() {
          _phoneController.text = number;
          _errorMessage = null;
        });
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.oceanBlueLight : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? AppColors.oceanBlue : AppColors.lightBorder,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.phone_iphone_rounded,
              color: isSelected ? AppColors.oceanBlue : AppColors.textMuted,
              size: 13,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                color: isSelected ? AppColors.oceanBlue : AppColors.textSecondary,
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

