import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen7OtpAccept extends StatefulWidget {
  const Screen7OtpAccept({super.key});

  @override
  State<Screen7OtpAccept> createState() => _Screen7OtpAcceptState();
}

class _Screen7OtpAcceptState extends State<Screen7OtpAccept> {
  final List<TextEditingController> _controllers = List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // Default pre-fill matching Figma screen digits: 4 7 9 3
    const initial = '4793';
    for (int i = 0; i < 4; i++) {
      _controllers[i].text = initial[i];
    }
  }

  @override
  void dispose() {
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  String get _enteredOtp => _controllers.map((c) => c.text).join();

  void _handleVerify() {
    final otp = _enteredOtp;
    if (otp.length < 4) {
      setState(() => _errorMessage = 'Please enter all 4 digits');
      return;
    }

    final provider = Provider.of<DriverProvider>(context, listen: false);
    final success = provider.verifyRideOtp(otp);

    if (!success) {
      setState(() => _errorMessage = 'Invalid OTP. Hint: Use 4793 or 1234');
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(6),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 10),

              // Shield Icon
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.oceanBlueLight,
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.cloudySky),
                ),
                child: const Icon(Icons.lock_person_rounded, color: AppColors.oceanBlue, size: 38),
              ),

              const SizedBox(height: 20),

              Text(
                'Verify OTP',
                style: GoogleFonts.plusJakartaSans(
                  color: AppColors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Enter the 4 digit OTP shared by the customer to start the ride',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  color: AppColors.textMuted,
                  fontSize: 13,
                ),
              ),

              const SizedBox(height: 32),

              // 4 Digit OTP Boxes (Figma Screen 7)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (index) {
                  return Container(
                    width: 60,
                    height: 64,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    decoration: BoxDecoration(
                      color: AppColors.lightCard,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: _controllers[index].text.isNotEmpty ? AppColors.oceanBlue : AppColors.lightBorder,
                        width: 1.8,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: _controllers[index].text.isNotEmpty ? AppColors.oceanBlue.withOpacity(0.12) : Colors.black.withOpacity(0.02),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Center(
                      child: TextField(
                        controller: _controllers[index],
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
                        },
                      ),
                    ),
                  );
                }),
              ),

              if (_errorMessage != null) ...[
                const SizedBox(height: 12),
                Text(_errorMessage!, style: GoogleFonts.inter(color: AppColors.crimsonRed, fontSize: 12, fontWeight: FontWeight.bold)),
              ],

              const SizedBox(height: 20),

              // Resend OTP Countdown
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.timer_outlined, color: AppColors.textMuted, size: 16),
                  const SizedBox(width: 6),
                  Text(
                    'Resend OTP (26s)',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),

              const SizedBox(height: 36),

              // Verify Button (Figma Screen 7)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _handleVerify,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.oceanBlue,
                    elevation: 4,
                    shadowColor: AppColors.oceanBlue.withOpacity(0.4),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Verify',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.check_circle_outline_rounded, color: Colors.white, size: 18),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
