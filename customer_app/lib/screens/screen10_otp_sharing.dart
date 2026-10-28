import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../providers/booking_provider.dart';

class Screen10OtpSharing extends StatefulWidget {
  const Screen10OtpSharing({super.key});

  @override
  State<Screen10OtpSharing> createState() => _Screen10OtpSharingState();
}

class _Screen10OtpSharingState extends State<Screen10OtpSharing> {
  bool _audioRecording = false;

  void _triggerSos(BuildContext context, BookingProvider provider) {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: AppColors.lightCard,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
            side: const BorderSide(color: AppColors.crimsonRed, width: 2),
          ),
          title: Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppColors.crimsonRed, size: 28),
              const SizedBox(width: 10),
              Text(
                'Emergency SOS',
                style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 18),
              ),
            ],
          ),
          content: Text(
            'This will immediately send your live GPS coordinates to your registered emergency contacts and connect you to the 24x7 DropTaxi Safety Response Team (112 Police).',
            style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 13),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.inter(color: AppColors.textMuted)),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                provider.triggerSos();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: AppColors.crimsonRed,
                    content: Text('🚨 SOS Alert Dispatched to Emergency Contacts & Police 112.'),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.crimsonRed,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: Text('DISPATCH SOS', style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  void _shareLiveLocation(BuildContext context, BookingProvider provider) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: AppColors.lightCard,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: AppColors.oceanBlue),
        ),
        content: Row(
          children: [
            const Icon(Icons.share_location_rounded, color: AppColors.oceanBlue, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Live tracking link copied: https://droptaxi.in/track/${provider.booking.bookingId}',
                style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<BookingProvider>(context);
    final pinDigits = (provider.rideSafetyPin.length == 4) ? provider.rideSafetyPin.split('') : ['8', '9', '4', '2'];

    return Scaffold(
      backgroundColor: AppColors.lightCanvas,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.textPrimary, size: 20),
          onPressed: () => provider.setScreen(provider.isLoggedIn ? 3 : 9),
        ),
        title: Text(
          'Safety Center & Ride PIN',
          style: GoogleFonts.plusJakartaSans(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Shield & Safety Header Card
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.oceanBlue.withOpacity(0.08),
                      blurRadius: 16,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppColors.oceanBlueLight,
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                          ),
                          child: const Icon(Icons.shield_rounded, color: AppColors.oceanBlue, size: 32),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'Secret Ride Start PIN',
                      style: GoogleFonts.plusJakartaSans(
                        color: AppColors.textPrimary,
                        fontSize: 19,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Share this 4-digit PIN with your driver only after you are inside the vehicle and verified the number plate.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // 4 Glowing PIN Boxes
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: pinDigits.map((digit) {
                        return Container(
                          margin: const EdgeInsets.symmetric(horizontal: 6),
                          width: 56,
                          height: 64,
                          decoration: BoxDecoration(
                            color: AppColors.lightSurface,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppColors.oceanBlue, width: 1.8),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.oceanBlue.withOpacity(0.15),
                                blurRadius: 8,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Text(
                              digit,
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.oceanBlue,
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.lock_clock_rounded, color: AppColors.oceanBlue, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          'Driver cannot start meter without this PIN',
                          style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Emergency SOS Trigger Action
              InkWell(
                onTap: () => _triggerSos(context, provider),
                borderRadius: BorderRadius.circular(18),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.crimsonRedLight,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.crimsonRed, width: 1.5),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: const BoxDecoration(
                          color: AppColors.crimsonRed,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.sos_rounded, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Emergency SOS Assistance',
                              style: GoogleFonts.plusJakartaSans(
                                color: AppColors.crimsonRed,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Alert family & call Police 112 with 1-tap',
                              style: GoogleFonts.inter(
                                color: AppColors.textMuted,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.crimsonRed, size: 16),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // Quick Safety Tools Grid
              Row(
                children: [
                  // Share Live Trip
                  Expanded(
                    child: InkWell(
                      onTap: () => _shareLiveLocation(context, provider),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.lightCard,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.lightBorder),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.emeraldGreenLight,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.share_location_rounded, color: AppColors.emeraldGreen, size: 20),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Share Live Trip',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'Send GPS to WhatsApp',
                              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 12),

                  // 24x7 Safety Helpline
                  Expanded(
                    child: InkWell(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Connecting to 24x7 Safety Helpline: 1800-419-8294')),
                        );
                      },
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.lightCard,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.lightBorder),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.03),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.oceanBlueLight,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.headset_mic_rounded, color: AppColors.oceanBlue, size: 20),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Safety Helpline',
                              style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'Toll-Free 24x7 Desk',
                              style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Audio Safety Feature Card
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.lightCard,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.lightBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
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
                            child: const Icon(Icons.mic_rounded, color: AppColors.oceanBlue, size: 20),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'In-Trip Audio Safety',
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                Text(
                                  'Encrypted audio for ride security',
                                  style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 10),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Switch(
                      value: _audioRecording,
                      activeColor: AppColors.oceanBlue,
                      activeTrackColor: AppColors.oceanBlueLight,
                      onChanged: (val) {
                        setState(() => _audioRecording = val);
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Confirm & Proceed Action Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () => provider.setScreen(11), // Go to Booking Confirmed
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
                        'Confirm & Proceed to Ride',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
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
