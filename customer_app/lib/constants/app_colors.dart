import 'package:flutter/material.dart';

class AppColors {
  // Brand Palette (Ocean Blue & Cloudy Sky)
  static const Color primaryBlue = Color(0xFF2872A1);      // Ocean Blue #2872A1
  static const Color oceanBlue = Color(0xFF2872A1);        // Ocean Blue
  static const Color oceanBlueLight = Color(0xFFEBF4FA);   // Soft ocean tint for chips/cards
  static const Color oceanBlueDark = Color(0xFF1B5277);    // Deep Ocean Blue
  static const Color deepBlue = Color(0xFF1B5277);         // Deep Ocean Blue
  
  static const Color cloudySky = Color(0xFFCBDDE9);        // Cloudy Sky #CBDDE9
  static const Color cloudySkyLight = Color(0xFFF0F6FA);   // Very light cloudy sky
  static const Color cloudySkyDark = Color(0xFF6B92B0);    // Rich cloudy blue
  
  static const Color lightBlue = Color(0xFF2872A1);        // Ocean Blue
  static const Color softBlue = Color(0xFFEBF4FA);         // Soft Cloudy Sky
  
  // White / Light Mode Canvas & Containers
  static const Color lightCanvas = Color(0xFFF8FAFC);      // Crisp light canvas #F8FAFC (Slate-50)
  static const Color lightCard = Color(0xFFFFFFFF);        // Pristine Pure White Card #FFFFFF
  static const Color lightSurface = Color(0xFFF1F5F9);     // Soft surface #F1F5F9 (Slate-100)
  static const Color lightBorder = Color(0xFFE2E8F0);      // Subtle crisp border #E2E8F0

  // Semantic Aliases for backwards compatibility in existing widgets
  static const Color darkCanvas = Color(0xFFF8FAFC);       // Mapped to Light Canvas
  static const Color darkCard = Color(0xFFFFFFFF);         // Mapped to White Card
  static const Color darkSurface = Color(0xFFF1F5F9);      // Mapped to Soft Surface
  static const Color borderDark = Color(0xFFE2E8F0);       // Crisp Slate Border
  static const Color borderGlow = Color(0xFFCBDDE9);       // Cloudy Sky Border

  // Accent & Status Colors
  static const Color emeraldGreen = Color(0xFF10B981);     // Verified / Online
  static const Color emeraldGreenLight = Color(0xFFECFDF5);// Soft Green Tint
  static const Color vibrantAmber = Color(0xFFD97706);     // Cargo / Freight Amber
  static const Color cargoGold = Color(0xFFD97706);
  static const Color cargoGoldLight = Color(0xFFFEF3C7);   // Soft Gold Tint
  static const Color crimsonRed = Color(0xFFDC2626);       // SOS / Emergency Red
  static const Color crimsonRedLight = Color(0xFFFEE2E2);  // Soft Red Tint
  static const Color accentCyan = Color(0xFF0284C7);       // Modern Cyan

  // Typography for White Theme
  static const Color textPrimary = Color(0xFF0F172A);      // Charcoal Dark Slate #0F172A
  static const Color textSecondary = Color(0xFF334155);    // Slate Dark #334155
  static const Color textMuted = Color(0xFF64748B);        // Muted Slate #64748B
  static const Color textDark = Color(0xFF94A3B8);         // Light Slate #94A3B8
  static const Color textWhite = Color(0xFF0F172A);        // Mapped to Dark Slate for contrast
  static const Color textCloudy = Color(0xFF2872A1);       // Brand blue on light cards
  static const Color pureWhite = Color(0xFFFFFFFF);
}
