import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';
import '../models/vehicle_model.dart';

class Screen2Signup extends StatefulWidget {
  const Screen2Signup({super.key});

  @override
  State<Screen2Signup> createState() => _Screen2SignupState();
}

class _Screen2SignupState extends State<Screen2Signup> {
  final List<TextEditingController> _otpControllers = List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _cityController;

  Timer? _timer;
  int _secondsRemaining = 30;
  bool _canResend = false;
  bool _isVerifying = false;
  String? _errorMessage;
  ServiceType _selectedServiceType = ServiceType.dropTaxi;

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<BookingProvider>(context, listen: false);
    _nameController = TextEditingController(text: provider.userName.isNotEmpty ? provider.userName : 'Rahul Kumar');
    _emailController = TextEditingController(text: provider.userEmail);
    _cityController = TextEditingController(text: provider.userCity);
    _selectedServiceType = provider.serviceType;
    _startCountdown();
  }

  void _startCountdown() {
    _timer?.cancel();
    setState(() {
      _secondsRemaining = 30;
      _canResend = false;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsRemaining > 0) {
        setState(() => _secondsRemaining--);
      } else {
        setState(() => _canResend = true);
        t.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var c in _otpControllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    _nameController.dispose();
    _emailController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  String get _enteredOtp => _otpControllers.map((c) => c.text).join();

  void _handleVerify() async {
    final otp = _enteredOtp;
    if (otp.length < 4) {
      setState(() => _errorMessage = 'Please enter all 4 digits of the OTP');
      return;
    }

    setState(() {
      _isVerifying = true;
      _errorMessage = null;
    });

    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;

    final provider = Provider.of<BookingProvider>(context, listen: false);
    final isValid = await provider.verifyOtp(otp);

    if (!isValid) {
      if (!mounted) return;
      setState(() {
        _isVerifying = false;
        _errorMessage = 'Invalid OTP. Hint: Use ${provider.generatedOtp} or 1234';
      });
      return;
    }

    // Save profile details
    provider.updateProfile(
      name: _nameController.text.trim().isNotEmpty ? _nameController.text.trim() : 'Customer',
      phone: provider.userPhone,
      email: _emailController.text.trim(),
      city: _cityController.text.trim(),
    );
    provider.selectService(_selectedServiceType);

    if (!mounted) return;
    setState(() => _isVerifying = false);

    // Show celebration modal
    _showCelebrationDialog(context, provider);
  }

  void _showCelebrationDialog(BuildContext context, BookingProvider provider) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return Dialog(
          backgroundColor: AppColors.lightCard,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: AppColors.cloudySky, width: 1.5),
          ),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.emeraldGreenLight,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.emeraldGreen, width: 2),
                  ),
                  child: const Icon(Icons.check_circle_rounded, color: AppColors.emeraldGreen, size: 44),
                ),
                const SizedBox(height: 18),
                Text(
                  'Verified Successfully! 🎉',
                  style: GoogleFonts.plusJakartaSans(
                    color: AppColors.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Welcome to DropTaxi & Goods Truck,\n${provider.userName}!',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    color: AppColors.textMuted,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 22),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      provider.setScreen(3); // Navigate to Home
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.oceanBlue,
                      elevation: 4,
                      shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: Text(
                      'Launch Dashboard',
                      style: GoogleFonts.plusJakartaSans(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _autoFillOtp(String code) {
    if (code.length == 4) {
      for (int i = 0; i < 4; i++) {
        _otpControllers[i].text = code[i];
      }
      setState(() => _errorMessage = null);
      _handleVerify();
    }
  }

  void _resendOtp({String channel = 'SMS'}) {
    final provider = Provider.of<BookingProvider>(context, listen: false);
    provider.sendOtp();
    for (var c in _otpControllers) {
      c.clear();
    }
    _focusNodes[0].requestFocus();
    _startCountdown();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.lightCard,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: AppColors.cloudySky),
        ),
        content: Row(
          children: [
            const Icon(Icons.mark_email_read_rounded, color: AppColors.oceanBlue, size: 20),
            const SizedBox(width: 10),
            Text(
              'New OTP sent via $channel: ${provider.generatedOtp}',
              style: GoogleFonts.inter(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(1),
        ),
        title: Text(
          'Verification & Profile',
          style: GoogleFonts.plusJakartaSans(
            color: AppColors.textPrimary,
            fontSize: 17,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Phone Badge & Edit Button
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.lightBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: const BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.all(Radius.circular(10)),
                            ),
                            child: const Icon(Icons.phone_android_rounded, color: AppColors.oceanBlue, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'VERIFYING NUMBER',
                                  style: GoogleFonts.inter(
                                    color: AppColors.textMuted,
                                    fontSize: 9,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 0.8,
                                  ),
                                ),
                                Text(
                                  provider.fullPhoneNumber,
                                  style: GoogleFonts.plusJakartaSans(
                                    color: AppColors.textPrimary,
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 6),
                    TextButton.icon(
                      onPressed: () => provider.setScreen(1),
                      icon: const Icon(Icons.edit_rounded, color: AppColors.oceanBlue, size: 14),
                      label: Text(
                        'Change',
                        style: GoogleFonts.inter(
                          color: AppColors.oceanBlue,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              Text(
                'Enter 4-Digit Code',
                style: GoogleFonts.plusJakartaSans(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'We sent a 4-digit verification PIN to ${provider.fullPhoneNumber}',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: AppColors.textMuted,
                  fontSize: 13,
                ),
              ),

              const SizedBox(height: 24),

              // 4 Individual OTP Input Boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) {
                  final isFocused = _focusNodes[index].hasFocus;
                  final hasValue = _otpControllers[index].text.isNotEmpty;
                  return Container(
                    width: 60,
                    height: 64,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isFocused
                            ? AppColors.oceanBlue
                            : hasValue
                                ? AppColors.cloudySkyDark
                                : AppColors.lightBorder,
                        width: isFocused ? 2.0 : 1.2,
                      ),
                      boxShadow: isFocused
                          ? [
                              BoxShadow(
                                color: AppColors.oceanBlue.withOpacity(0.18),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          : [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.02),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                    ),
                    child: Center(
                      child: TextField(
                        controller: _otpControllers[index],
                        focusNode: _focusNodes[index],
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        maxLength: 1,
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.textPrimary,
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                        ),
                        decoration: const InputDecoration(
                          counterText: '',
                          border: InputBorder.none,
                        ),
                        onChanged: (val) {
                          if (val.isNotEmpty && index < 3) {
                            _focusNodes[index + 1].requestFocus();
                          } else if (val.isEmpty && index > 0) {
                            _focusNodes[index - 1].requestFocus();
                          }
                          if (_errorMessage != null) {
                            setState(() => _errorMessage = null);
                          }
                          if (_enteredOtp.length == 4) {
                            _handleVerify();
                          }
                        },
                      ),
                    ),
                  );
                }),
              ),

              if (_errorMessage != null) ...[
                const SizedBox(height: 10),
                Text(
                  _errorMessage!,
                  style: GoogleFonts.inter(color: AppColors.crimsonRed, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],

              const SizedBox(height: 16),

              // Demo Auto-fill Helper Chip
              ActionChip(
                backgroundColor: AppColors.oceanBlueLight,
                side: const BorderSide(color: AppColors.cloudySky),
                avatar: const Icon(Icons.flash_on_rounded, color: AppColors.oceanBlue, size: 16),
                label: Text(
                  'Tap to Auto-fill Code (${provider.generatedOtp})',
                  style: GoogleFonts.inter(
                    color: AppColors.oceanBlue,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onPressed: () => _autoFillOtp(provider.generatedOtp),
              ),

              const SizedBox(height: 16),

              // Resend Countdown Timer & Channels
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.timer_outlined,
                    color: _canResend ? AppColors.oceanBlue : AppColors.textDark,
                    size: 16,
                  ),
                  const SizedBox(width: 6),
                  if (!_canResend)
                    Text(
                      'Resend OTP in 00:${_secondsRemaining.toString().padLeft(2, '0')}s',
                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12),
                    )
                  else
                    Row(
                      children: [
                        InkWell(
                          onTap: () => _resendOtp(channel: 'SMS'),
                          child: Text(
                            'Resend SMS',
                            style: GoogleFonts.inter(
                              color: AppColors.oceanBlue,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        InkWell(
                          onTap: () => _resendOtp(channel: 'WhatsApp'),
                          child: Text(
                            'Send via WhatsApp 💬',
                            style: GoogleFonts.inter(
                              color: AppColors.emeraldGreen,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              decoration: TextDecoration.underline,
                            ),
                          ),
                        ),
                      ],
                    ),
                ],
              ),

              const SizedBox(height: 24),

              // Profile Setup Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.lightBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 14,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(7),
                          decoration: BoxDecoration(
                            color: AppColors.oceanBlueLight,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.person_rounded, color: AppColors.oceanBlue, size: 16),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Your Personal Profile',
                          style: GoogleFonts.plusJakartaSans(
                            color: AppColors.textPrimary,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Personalize your name for trip receipts & driver greetings.',
                      style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                    ),
                    const SizedBox(height: 16),

                    // Full Name Input
                    Text('FULL NAME', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: TextField(
                        controller: _nameController,
                        style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                        decoration: InputDecoration(
                          hintText: 'Enter your full name',
                          hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                          border: InputBorder.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Preferred Service Segmented Selector
                    Text('PREFERRED SERVICE', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _selectedServiceType = ServiceType.dropTaxi),
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _selectedServiceType == ServiceType.dropTaxi
                                    ? AppColors.oceanBlue
                                    : AppColors.lightSurface,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: _selectedServiceType == ServiceType.dropTaxi
                                      ? AppColors.oceanBlue
                                      : AppColors.lightBorder,
                                ),
                              ),
                              child: Center(
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.local_taxi_rounded,
                                      color: _selectedServiceType == ServiceType.dropTaxi ? Colors.white : AppColors.textMuted,
                                      size: 16,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Drop Taxi',
                                      style: GoogleFonts.inter(
                                        color: _selectedServiceType == ServiceType.dropTaxi ? Colors.white : AppColors.textPrimary,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _selectedServiceType = ServiceType.goodsTruck),
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _selectedServiceType == ServiceType.goodsTruck
                                    ? AppColors.cargoGold
                                    : AppColors.lightSurface,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: _selectedServiceType == ServiceType.goodsTruck
                                      ? AppColors.cargoGold
                                      : AppColors.lightBorder,
                                ),
                              ),
                              child: Center(
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.local_shipping_rounded,
                                      color: _selectedServiceType == ServiceType.goodsTruck ? Colors.white : AppColors.textMuted,
                                      size: 16,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      'Goods Truck',
                                      style: GoogleFonts.inter(
                                        color: _selectedServiceType == ServiceType.goodsTruck ? Colors.white : AppColors.textPrimary,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Verify & Continue CTA Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isVerifying ? null : _handleVerify,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 6,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isVerifying
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Verify & Proceed',
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Icon(Icons.check_circle_outline_rounded, color: AppColors.cloudySky, size: 18),
                          ],
                        ),
                ),
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
