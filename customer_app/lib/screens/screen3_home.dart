import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';
import '../models/vehicle_model.dart';
import '../providers/booking_provider.dart';
import 'map_location_picker_screen.dart';

class Screen3Home extends StatefulWidget {
  const Screen3Home({super.key});

  @override
  State<Screen3Home> createState() => _Screen3HomeState();
}

class _Screen3HomeState extends State<Screen3Home> {
  final List<Map<String, dynamic>> _popularHubs = [
    {'city': 'Coimbatore, Tamil Nadu', 'dist': 494, 'time': '7h 30m', 'fare': '₹5,800', 'tag': 'Popular'},
    {'city': 'Bengaluru, Karnataka', 'dist': 348, 'time': '5h 45m', 'fare': '₹4,200', 'tag': 'High Demand'},
    {'city': 'Pondicherry', 'dist': 152, 'time': '2h 45m', 'fare': '₹2,100', 'tag': 'Weekend Deal'},
    {'city': 'Madurai, Tamil Nadu', 'dist': 462, 'time': '7h 15m', 'fare': '₹5,400', 'tag': 'Direct Highway'},
    {'city': 'Salem, Tamil Nadu', 'dist': 345, 'time': '5h 30m', 'fare': '₹4,100', 'tag': 'Fast Route'},
    {'city': 'Trichy, Tamil Nadu', 'dist': 330, 'time': '5h 15m', 'fare': '₹3,900', 'tag': 'Popular'},
    {'city': 'Tirunelveli, Tamil Nadu', 'dist': 620, 'time': '9h 30m', 'fare': '₹7,200', 'tag': 'Long Distance'},
    {'city': 'Hyderabad, Telangana', 'dist': 625, 'time': '10h 00m', 'fare': '₹7,500', 'tag': 'Interstate'},
    {'city': 'Kochi, Kerala', 'dist': 690, 'time': '11h 00m', 'fare': '₹8,200', 'tag': 'Scenic'},
  ];

  void _showLocationPicker(BuildContext context, {required bool isPickup}) {
    final provider = Provider.of<BookingProvider>(context, listen: false);
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.lightCard,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
      ),
      builder: (ctx) {
        String query = '';
        return StatefulBuilder(
          builder: (context, setModalState) {
            final filtered = _popularHubs.where((h) {
              return h['city'].toString().toLowerCase().contains(query.toLowerCase());
            }).toList();

            return Container(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            Icon(
                              isPickup ? Icons.radio_button_checked_rounded : Icons.location_on_rounded,
                              color: isPickup ? AppColors.emeraldGreen : AppColors.crimsonRed,
                              size: 22,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                isPickup ? 'Choose Pick-up Location' : 'Choose Drop Destination',
                                style: GoogleFonts.plusJakartaSans(
                                  color: AppColors.textPrimary,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded, color: AppColors.textMuted, size: 22),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Prominent Google Map Picker Button
                  InkWell(
                    onTap: () {
                      Navigator.pop(ctx);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => MapLocationPickerScreen(isPickup: isPickup),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: isPickup
                              ? [AppColors.emeraldGreen.withOpacity(0.12), AppColors.emeraldGreen.withOpacity(0.04)]
                              : [AppColors.oceanBlue.withOpacity(0.12), AppColors.oceanBlue.withOpacity(0.04)],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: (isPickup ? AppColors.emeraldGreen : AppColors.oceanBlue).withOpacity(0.4),
                          width: 1.5,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: isPickup ? AppColors.emeraldGreen : AppColors.oceanBlue,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.map_rounded, color: Colors.white, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Select on Google Map',
                                  style: GoogleFonts.plusJakartaSans(
                                    color: isPickup ? AppColors.emeraldGreen : AppColors.oceanBlue,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'Pan & tap pin anywhere on live map',
                                  style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: isPickup ? AppColors.emeraldGreen : AppColors.oceanBlue,
                            size: 14,
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Search Box
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.lightSurface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.lightBorder),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: TextField(
                      style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 14),
                      decoration: InputDecoration(
                        icon: const Icon(Icons.search_rounded, color: AppColors.oceanBlue, size: 20),
                        hintText: isPickup ? 'Enter pickup city / area' : 'Search destination city (e.g. Coimbatore)',
                        hintStyle: GoogleFonts.inter(color: AppColors.textDark, fontSize: 13),
                        border: InputBorder.none,
                      ),
                      onChanged: (val) => setModalState(() => query = val),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Text(
                    'POPULAR OUTSTATION HUBS',
                    style: GoogleFonts.inter(
                      color: AppColors.textMuted,
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.8,
                    ),
                  ),
                  const SizedBox(height: 8),

                  Expanded(
                    child: ListView.separated(
                      itemCount: filtered.length,
                      separatorBuilder: (_, __) => const Divider(color: AppColors.lightBorder, height: 1),
                      itemBuilder: (ctx, idx) {
                        final hub = filtered[idx];
                        final city = hub['city'] as String;
                        final dist = hub['dist'] as int;
                        final time = hub['time'] as String;

                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                          leading: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.location_city_rounded, color: AppColors.oceanBlue, size: 20),
                          ),
                          title: Text(
                            city,
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.textPrimary,
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          subtitle: Text(
                            '$dist km from Chennai • ~$time',
                            style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.oceanBlueLight,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              hub['fare'],
                              style: GoogleFonts.inter(
                                color: AppColors.oceanBlue,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          onTap: () {
                            if (isPickup) {
                              provider.updateRoute(
                                pickup: city,
                                drop: provider.dropCity,
                              );
                            } else {
                              provider.updateRoute(
                                pickup: provider.pickupCity,
                                drop: city,
                                distanceKm: dist,
                                duration: time,
                              );
                            }
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

  void _showProfileModal(BuildContext context, BookingProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.lightCard,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(26)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              padding: EdgeInsets.only(
                top: 20,
                left: 20,
                right: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.85,
              ),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: const BoxDecoration(
                                  color: AppColors.oceanBlueLight,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.person_rounded, color: AppColors.oceanBlue, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'My Account & Settings',
                                  style: GoogleFonts.plusJakartaSans(
                                    color: AppColors.textPrimary,
                                    fontSize: 17,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: AppColors.textMuted, size: 22),
                          onPressed: () => Navigator.pop(ctx),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // User Profile Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [AppColors.oceanBlue, AppColors.deepBlue],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.oceanBlue.withOpacity(0.25),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 52,
                            height: 52,
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 1.5),
                            ),
                            child: Center(
                              child: Text(
                                provider.userName.isNotEmpty
                                    ? provider.userName.trim().split(' ').map((e) => e.isNotEmpty ? e[0].toUpperCase() : '').take(2).join()
                                    : 'DT',
                                style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      provider.userName,
                                      style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(width: 6),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.25),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        'VIP',
                                        style: GoogleFonts.inter(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  provider.fullPhoneNumber,
                                  style: GoogleFonts.plusJakartaSans(color: AppColors.cloudySky, fontSize: 12),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.emeraldGreen.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white.withOpacity(0.6)),
                            ),
                            child: Text(
                              'VERIFIED',
                              style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w800),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Wallet & Balance
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.emeraldGreenLight,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.account_balance_wallet_rounded, color: AppColors.emeraldGreen, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('DropTaxi Wallet Balance', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 11)),
                                  Text('₹${provider.walletBalance.toStringAsFixed(2)}', style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w800)),
                                ],
                              ),
                            ],
                          ),
                          ElevatedButton(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('UPI Auto-pay enabled with ₹500 cashback offer!')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.oceanBlue,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            ),
                            child: Text('Add Money', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Language Selector
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.lightBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('APP LANGUAGE / மொழி', style: GoogleFonts.plusJakartaSans(color: AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                          const SizedBox(height: 8),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: ['English', 'தமிழ் (Tamil)', 'हिंदी (Hindi)'].map((lang) {
                                final isSel = provider.selectedLanguage.startsWith(lang.split(' ')[0]);
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8),
                                  child: ChoiceChip(
                                    label: Text(lang, style: GoogleFonts.plusJakartaSans(color: isSel ? Colors.white : AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
                                    selected: isSel,
                                    selectedColor: AppColors.oceanBlue,
                                    backgroundColor: AppColors.lightCard,
                                    onSelected: (_) {
                                      provider.updateProfile(
                                        name: provider.userName,
                                        phone: provider.userPhone,
                                        language: lang.split(' ')[0],
                                      );
                                      setModalState(() {});
                                    },
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Quick Actions
                    _buildSettingsTile(
                      icon: Icons.shield_rounded,
                      title: 'Safety Center & Trusted Contacts',
                      subtitle: '${provider.emergencyContacts.length} emergency contacts configured',
                      onTap: () {
                        Navigator.pop(ctx);
                        provider.setScreen(10);
                      },
                    ),
                    const SizedBox(height: 8),
                    _buildSettingsTile(
                      icon: Icons.receipt_long_rounded,
                      title: 'Ride History & Invoices',
                      subtitle: 'Download GST invoices for business travel',
                      onTap: () {
                        Navigator.pop(ctx);
                        provider.setScreen(15);
                      },
                    ),
                    const SizedBox(height: 8),
                    _buildSettingsTile(
                      icon: Icons.headset_mic_rounded,
                      title: '24x7 Customer Support Desk',
                      subtitle: 'Call toll-free or chat with captain support',
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Dialing 24x7 DropTaxi Helpdesk: 1800-419-8899')),
                        );
                      },
                    ),

                    const SizedBox(height: 18),

                    // Logout CTA
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          Navigator.pop(ctx);
                          provider.logout();
                        },
                        icon: const Icon(Icons.logout_rounded, color: AppColors.crimsonRed, size: 18),
                        label: Text('Sign Out / Switch Account', style: GoogleFonts.plusJakartaSans(color: AppColors.crimsonRed, fontSize: 13, fontWeight: FontWeight.bold)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.crimsonRed, width: 1.2),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.lightSurface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.lightBorder),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.oceanBlueLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppColors.oceanBlue, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w700)),
                  Text(subtitle, style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.textDark, size: 12),
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
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Top Bar: Greeting & Avatar & Safety Shortcut
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => _showProfileModal(context, provider),
                            borderRadius: BorderRadius.circular(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 46,
                                  height: 46,
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [AppColors.oceanBlue, AppColors.deepBlue],
                                    ),
                                    borderRadius: BorderRadius.circular(15),
                                    border: Border.all(color: AppColors.cloudySky, width: 1.5),
                                  ),
                                  child: Center(
                                    child: Text(
                                      provider.userName.trim().isNotEmpty
                                          ? provider.userName.trim().split(' ').map((e) => e.isNotEmpty ? e[0].toUpperCase() : '').take(2).join()
                                          : 'DT',
                                      style: GoogleFonts.plusJakartaSans(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            'Welcome back,',
                                            style: GoogleFonts.inter(
                                              color: AppColors.textMuted,
                                              fontSize: 11,
                                            ),
                                          ),
                                          const SizedBox(width: 4),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                            decoration: BoxDecoration(
                                              color: AppColors.oceanBlueLight,
                                              borderRadius: BorderRadius.circular(4),
                                              border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                                            ),
                                            child: Text(
                                              'VIP',
                                              style: GoogleFonts.inter(
                                                color: AppColors.oceanBlue,
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      Text(
                                        provider.userName.isNotEmpty ? provider.userName : 'Valued Customer',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.textPrimary,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w800,
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
                        ),
                        // Safety Hub Shortcut Button
                        IconButton(
                          onPressed: () => provider.setScreen(10), // Safety Center
                          icon: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.lightCard,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.lightBorder),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.04),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Icon(Icons.shield_rounded, color: AppColors.oceanBlue, size: 20),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 18),

                    // Interactive Drop Location & Route Chooser Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.lightCard,
                        borderRadius: BorderRadius.circular(22),
                        border: Border.all(color: AppColors.lightBorder),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 14,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          // Pickup Row
                          InkWell(
                            onTap: () => _showLocationPicker(context, isPickup: true),
                            borderRadius: BorderRadius.circular(12),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  Container(
                                    width: 12,
                                    height: 12,
                                    decoration: BoxDecoration(
                                      color: AppColors.emeraldGreen,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 2),
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.emeraldGreen.withOpacity(0.3),
                                          blurRadius: 4,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('PICK-UP POINT', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                                        Text(provider.pickupCity, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                                      ],
                                    ),
                                  ),
                                  const Icon(Icons.edit_location_alt_rounded, color: AppColors.oceanBlue, size: 18),
                                ],
                              ),
                            ),
                          ),

                          // Divider with Swap Action
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 2),
                            child: Row(
                              children: [
                                Container(margin: const EdgeInsets.only(left: 5), width: 2, height: 24, color: AppColors.lightBorder),
                                const Expanded(child: Divider(color: AppColors.lightBorder)),
                                InkWell(
                                  onTap: () => provider.swapLocations(),
                                  borderRadius: BorderRadius.circular(20),
                                  child: Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: AppColors.oceanBlueLight,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                                    ),
                                    child: const Icon(Icons.swap_vert_rounded, color: AppColors.oceanBlue, size: 16),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Drop Row (Choosing Drop Location)
                          InkWell(
                            onTap: () => _showLocationPicker(context, isPickup: false),
                            borderRadius: BorderRadius.circular(12),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  Container(
                                    width: 12,
                                    height: 12,
                                    decoration: BoxDecoration(
                                      color: AppColors.crimsonRed,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 2),
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.crimsonRed.withOpacity(0.3),
                                          blurRadius: 4,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('DROP DESTINATION', style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                                        Text(provider.dropCity, style: GoogleFonts.plusJakartaSans(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppColors.oceanBlueLight,
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                                    ),
                                    child: Text('Change', style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 11, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                            ),
                          ),

                          const SizedBox(height: 12),

                          // Route Distance & Time Badge
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppColors.lightSurface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.lightBorder),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.route_rounded, color: AppColors.oceanBlue, size: 16),
                                    const SizedBox(width: 6),
                                    Text(
                                      '${provider.tripDistanceKm} km Distance',
                                      style: GoogleFonts.inter(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    const Icon(Icons.timer_outlined, color: AppColors.textMuted, size: 14),
                                    const SizedBox(width: 4),
                                    Text(
                                      provider.tripDuration,
                                      style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 12, fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 10),

                          // Direct Interactive Map Picker Shortcut
                          InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => const MapLocationPickerScreen(isPickup: false),
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [AppColors.oceanBlue.withOpacity(0.08), AppColors.oceanBlue.withOpacity(0.03)],
                                ),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.oceanBlue.withOpacity(0.3)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(5),
                                        decoration: const BoxDecoration(
                                          color: AppColors.oceanBlue,
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.map_rounded, color: Colors.white, size: 13),
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        'Select Drop on Google Map',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.oceanBlue,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      Text('Live GPS', style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 10, fontWeight: FontWeight.w600)),
                                      const SizedBox(width: 4),
                                      const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.oceanBlue, size: 11),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Primary Two Service Category Cards (Drop Taxi vs Goods Truck)
                    Text(
                      'CHOOSE SERVICE CATEGORY',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 10),

                    Row(
                      children: [
                        // One-Way Drop Taxi Card
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              provider.selectService(ServiceType.dropTaxi);
                              provider.setScreen(4); // Taxi Selection
                            },
                            borderRadius: BorderRadius.circular(22),
                            child: Container(
                              height: 165,
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                borderRadius: BorderRadius.circular(22),
                                border: Border.all(color: AppColors.oceanBlue.withOpacity(0.6), width: 1.5),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.oceanBlue.withOpacity(0.08),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: AppColors.oceanBlueLight,
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(Icons.local_taxi_rounded, color: AppColors.oceanBlue, size: 24),
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        'Drop Taxi',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.textPrimary,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      Text(
                                        'Pay only one-way outstation fare',
                                        style: GoogleFonts.inter(
                                          color: AppColors.textMuted,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'From ₹14/km',
                                        style: GoogleFonts.inter(
                                          color: AppColors.oceanBlue,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Icon(Icons.arrow_forward_rounded, color: AppColors.oceanBlue, size: 16),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(width: 12),

                        // Goods Truck Card
                        Expanded(
                          child: InkWell(
                            onTap: () {
                              provider.selectService(ServiceType.goodsTruck);
                              provider.setScreen(5); // Truck Selection
                            },
                            borderRadius: BorderRadius.circular(22),
                            child: Container(
                              height: 165,
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                borderRadius: BorderRadius.circular(22),
                                border: Border.all(color: AppColors.cargoGold.withOpacity(0.6), width: 1.5),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.cargoGold.withOpacity(0.08),
                                    blurRadius: 12,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: AppColors.cargoGoldLight,
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(Icons.local_shipping_rounded, color: AppColors.cargoGold, size: 24),
                                      ),
                                      const SizedBox(height: 10),
                                      Text(
                                        'Goods Truck',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.textPrimary,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      Text(
                                        'Mini truck to 32ft heavy freight',
                                        style: GoogleFonts.inter(
                                          color: AppColors.textMuted,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'From ₹22/km',
                                        style: GoogleFonts.inter(
                                          color: AppColors.cargoGold,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Icon(Icons.arrow_forward_rounded, color: AppColors.cargoGold, size: 16),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Popular Outstation Routes Section
                    Text(
                      'POPULAR OUTSTATION ROUTES',
                      style: GoogleFonts.inter(
                        color: AppColors.textMuted,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 10),

                    SizedBox(
                      height: 110,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _popularHubs.length,
                        itemBuilder: (context, index) {
                          final hub = _popularHubs[index];
                          final city = hub['city'] as String;
                          final dist = hub['dist'] as int;
                          final fare = hub['fare'] as String;

                          return InkWell(
                            onTap: () {
                              provider.updateRoute(
                                pickup: provider.pickupCity,
                                drop: city,
                                distanceKm: dist,
                                duration: hub['time'] as String,
                              );
                            },
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 180,
                              margin: const EdgeInsets.only(right: 12),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: provider.dropCity == city ? AppColors.oceanBlue : AppColors.lightBorder,
                                  width: provider.dropCity == city ? 2 : 1,
                                ),
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
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.location_on_rounded, color: AppColors.oceanBlue, size: 14),
                                      const SizedBox(width: 4),
                                      Expanded(
                                        child: Text(
                                          city.split(',')[0],
                                          style: GoogleFonts.plusJakartaSans(
                                            color: AppColors.textPrimary,
                                            fontSize: 13,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Text(
                                    '$dist km • ${hub['time']}',
                                    style: GoogleFonts.inter(color: AppColors.textMuted, fontSize: 11),
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        fare,
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.oceanBlue,
                                          fontSize: 13,
                                          fontWeight: FontWeight.w800,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppColors.oceanBlueLight,
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          hub['tag'],
                                          style: GoogleFonts.inter(color: AppColors.oceanBlue, fontSize: 9, fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Dedicated Safety Shield Banner
                    InkWell(
                      onTap: () => provider.setScreen(10), // Safety Hub
                      borderRadius: BorderRadius.circular(18),
                      child: Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.oceanBlueLight,
                          borderRadius: BorderRadius.circular(18),
                          border: Border.all(color: AppColors.cloudySky),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.oceanBlue.withOpacity(0.06),
                              blurRadius: 10,
                              offset: const Offset(0, 3),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: AppColors.lightCard,
                                shape: BoxShape.circle,
                                border: Border.all(color: AppColors.oceanBlue.withOpacity(0.2)),
                              ),
                              child: const Icon(Icons.shield_rounded, color: AppColors.oceanBlue, size: 22),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        '24x7 Ride Safety Shield',
                                        style: GoogleFonts.plusJakartaSans(
                                          color: AppColors.textPrimary,
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppColors.emeraldGreenLight,
                                          borderRadius: BorderRadius.circular(6),
                                          border: Border.all(color: AppColors.emeraldGreen.withOpacity(0.4)),
                                        ),
                                        child: Text(
                                          'ACTIVE',
                                          style: GoogleFonts.plusJakartaSans(
                                            color: AppColors.emeraldGreen,
                                            fontSize: 9,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    'Emergency SOS • Real-time GPS sharing • Audio audit',
                                    style: GoogleFonts.plusJakartaSans(
                                      color: AppColors.textMuted,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios_rounded, color: AppColors.oceanBlue, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Fixed Bottom Navigation Bar
            Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
              decoration: BoxDecoration(
                color: AppColors.lightCard,
                border: const Border(top: BorderSide(color: AppColors.lightBorder)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(Icons.home_rounded, 'Home', true, () => provider.setScreen(3)),
                  _buildNavItem(Icons.receipt_long_rounded, 'Bookings', false, () => provider.setScreen(6)),
                  _buildNavItem(Icons.shield_rounded, 'Safety Hub', false, () => provider.setScreen(10)),
                  _buildNavItem(Icons.person_rounded, 'My Account', false, () => _showProfileModal(context, provider)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: active ? AppColors.oceanBlue : AppColors.textMuted, size: 22),
            const SizedBox(height: 3),
            Text(
              label,
              style: GoogleFonts.plusJakartaSans(
                color: active ? AppColors.oceanBlue : AppColors.textMuted,
                fontSize: 10,
                fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
