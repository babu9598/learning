import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/driver_provider.dart';

class Screen2DriverSignup extends StatefulWidget {
  const Screen2DriverSignup({super.key});

  @override
  State<Screen2DriverSignup> createState() => _Screen2DriverSignupState();
}

class _Screen2DriverSignupState extends State<Screen2DriverSignup> {
  final TextEditingController _nameController = TextEditingController(text: 'Ramesh Kumar');
  final TextEditingController _phoneController = TextEditingController(text: '9876543210');
  final TextEditingController _emailController = TextEditingController(text: 'ramesh.driver@droptaxi.in');

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _handleSignUp() {
    final provider = Provider.of<DriverProvider>(context, listen: false);
    provider.signUp(
      name: _nameController.text.trim().isNotEmpty ? _nameController.text.trim() : 'Ramesh Kumar',
      phone: '+91 ${_phoneController.text.trim()}',
      email: _emailController.text.trim(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<DriverProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),

              // DropTaxi Driver Logo
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.oceanBlueLight,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.cloudySky),
                    ),
                    child: const Center(
                      child: Icon(Icons.drive_eta_rounded, color: AppColors.oceanBlue, size: 24),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text('Drop', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.w900)),
                          Text('Taxi', style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 20, fontWeight: FontWeight.w900)),
                        ],
                      ),
                      Text('Driver Partner', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),

              const SizedBox(height: 30),

              // Signup Card
              Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(24),
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
                    Text(
                      'Create your account',
                      style: GoogleFonts.plusJakartaSans(
                        color: AppColors.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Get started as a Driver Partner and grow your income',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 22),

                    // Full Name Field
                    Text(
                      'FULL NAME',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: TextField(
                        controller: _nameController,
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Enter your full name',
                          hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                          border: InputBorder.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Mobile Number Field
                    Text(
                      'MOBILE NUMBER',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                      child: Row(
                        children: [
                          Text(
                            '+91',
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 10),
                            width: 1.5,
                            height: 20,
                            color: AppColors.lightBorder,
                          ),
                          Expanded(
                            child: TextField(
                              controller: _phoneController,
                              keyboardType: TextInputType.phone,
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w600,
                                fontSize: 14,
                              ),
                              decoration: InputDecoration(
                                hintText: 'Enter mobile number',
                                hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Email (Optional) Field
                    Text(
                      'EMAIL (OPTIONAL)',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      child: TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.w600, fontSize: 14),
                        decoration: InputDecoration(
                          hintText: 'Enter your email address',
                          hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                          border: InputBorder.none,
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Sign Up Button
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _handleSignUp,
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
                              'Sign Up',
                              style: GoogleFonts.plusJakartaSans(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
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

              const SizedBox(height: 28),

              // Already have an account link
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Already have an account? ',
                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
                  ),
                  InkWell(
                    onTap: () => provider.setScreen(1), // Go to Login
                    child: Text(
                      'Login',
                      style: GoogleFonts.inter(
                        color: AppColors.oceanBlue,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
