# 📱 RideNLoad (DropTaxi & Goods Truck) Mobile Applications - Figma UI/UX Design System & Demo Prototype

Comprehensive Mobile UI/UX Design System, Flow Specifications, and Component Prototypes for the **Customer Application** and **Driver Partner Application**.

---

## 🎨 1. Core Figma Design System & Tokens

### Color Palette

| Token | Hex Value | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Ocean Blue 500** (Primary) | `#2872A1` | Brand Primary | Action buttons, active tabs, header gradients, polyline |
| **Ocean Blue 600** (Deep) | `#205D86` | Brand Accent | Button hover, pressed state, navigation background |
| **Cloudy Sky 100** (Soft) | `#CBDDE9` | Neutral Light | Card borders, secondary chips, pill backgrounds |
| **Cloudy Sky 50** (Ghost) | `#F0F5FA` | Background Light | Light theme canvas, container background |
| **Dark Navy 950** (Canvas) | `#090F1D` | Dark Canvas | Dark mode root background |
| **Dark Slate 900** (Card) | `#0E182A` | Dark Surface | Glassmorphism cards, bottom sheets, modal overlays |
| **Emerald Green 500** (Success) | `#10B981` | Online Status | "Online" toggle, "Accept Trip" button, completed states |
| **Vibrant Amber 500** (Warning) | `#F59E0B` | Goods Truck Accent| Freight category tags, surge multiplier badge, searching state |
| **Crimson Red 500** (Danger) | `#EF4444` | Decline / Cancel | "Decline Trip", cancel booking, emergency SOS button |

### Typography (Google Fonts: *Inter* or *Plus Jakarta Sans*)

- **Display / Heading 1**: 24px Bold (`tracking-tight`) — Screen titles, earnings totals
- **Heading 2**: 18px SemiBold — Category names, driver names, fare breakdowns
- **Body Regular**: 14px Medium — Addresses, descriptions, status messages
- **Caption / Meta**: 12px Regular (`text-slate-400`) — Timestamps, distance estimations
- **Monospace Code**: 12px Bold (`font-mono`) — Booking IDs (`TX-100013`), OTP codes (`4821`)

---

## 🚕 2. Customer Application — Screen Architecture & Flow

### Screen 1: Home & Service Selection
- **Header**: User location badge (`"Current: Anna Nagar, Chennai"`), notification bell, profile avatar.
- **Service Switcher (Pill Tab)**:
  - `🚕 DropTaxi` (Passenger Intercity / Outstation)
  - `🚚 Goods Truck` (Freight & Commercial Logistics)
- **Vehicle Carousel**:
  - **DropTaxi Mini** (4 seats, ₹12/km)
  - **DropTaxi Sedan** (Swift Dzire/Etios, ₹15/km)
  - **DropTaxi SUV** (Innova/Ertiga, 6-7 seats, ₹20/km)
  - **Goods Truck 1-Ton** (Tata Ace / Chota Hathi, ₹35/km)
  - **Goods Truck 3-Ton** (Eicher 14ft, ₹55/km)
  - **Goods Truck 7-Ton** (Heavy commercial multi-axle, ₹95/km)

### Screen 2: Route Input & Live Fare Calculation
- **Pickup & Drop Address Selector**: Autocomplete with recent history and saved locations (Home, Office, Warehouse).
- **Interactive Map View**: Route polyline, estimated distance (`"42.5 km"`), estimated time (`"55 mins"`).
- **Dynamic Pricing Breakdown Card**:
  - Base Fare + Distance Slabs
  - Surge Multiplier indicator (e.g. `1.25x Peak Hours`)
  - GST / Toll charges breakdown
  - Promo code input pill (`"WELCOME50" -> -₹50.00 Applied`)
- **Primary CTA**: Full-width gradient `"Confirm & Book DropTaxi"` / `"Confirm Goods Truck"`.

### Screen 3: Driver Dispatch & Real-Time Radar
- **Live Search Radar**: Radar pulse animation searching for online drivers within 5km radius.
- **Driver Match Card (Once accepted)**:
  - Driver Photo, Name, Vehicle Plate Number (`TN 09 BK 4821`), Rating (`⭐ 4.9`).
  - Arrival ETA (`"Driver arriving in 4 mins • 1.2 km away"`).
  - Secure **Start-Trip OTP** pill (`🔑 OTP: 7824`).
  - Quick Actions: **Call Driver**, **In-App Message**, **Share Live Trip Link**, **Cancel Booking**.

---

## 🚚 3. Driver Partner Application — Screen Architecture & Flow

### Screen 1: Home & Duty Dashboard
- **Online/Offline Switch**: Glowing Emerald Green switch with instant status broadcast to admin dispatch engine.
- **Daily Performance Card**:
  - Today's Net Earnings: `₹2,480.00`
  - Completed Trips: `6 Trips`
  - Acceptance Rate: `98.5%`
  - Payable Balance: `₹1,984.00` (Ready for instant UPI settlement)
- **Live Heatmap**: Highlights high-demand surge clusters across Chennai & suburban industrial zones.

### Screen 2: Incoming Dispatch Order Popup (15-second timer)
- **Service Badge**: `🚕 DROP TAXI - SEDAN` or `🚚 GOODS TRUCK - 1 TON`
- **Pickup Distance**: `"1.4 km away from you (4 min pickup)"`
- **Trip Route**:
  - `📍 Pickup: Chennai Central Station`
  - `🏁 Drop: Tidel Park, OMR (16 km trip)`
- **Estimated Net Earning**: `"₹304.00 (Driver Share)"`
- **Actions**:
  - Green **"Slide to Accept"** / **"ACCEPT TRIP"** button
  - Red **"Decline"** button

### Screen 3: Turn-by-Turn GPS Navigation & Trip Execution
- **Step 1: Arriving at Pickup**: Turn-by-turn map navigation with button `"I Have Arrived"`.
- **Step 2: Start Trip**: 4-digit customer OTP verification input modal.
- **Step 3: En Route to Destination**: Real-time GPS location broadcasting to Socket.IO engine every 3 seconds.
- **Step 4: Complete Trip**: Tolls & waiting fee confirmation → `"End Trip & Collect ₹380.00 Cash / UPI"`.

---

## 🔗 4. Figma Implementation & Hand-off Checklist

1. **Auto-Layout 5.0**: All screens use 8pt grid system with responsive constraints.
2. **Components**:
   - `Btn/Primary`, `Btn/Outline`, `Btn/Success`, `Btn/Danger`
   - `Card/VehicleSelector`, `Card/FareBreakdown`, `Card/DriverDetail`
   - `Input/AddressField`, `Input/OTPField`, `Input/CouponField`
   - `Badge/Status`, `Badge/ServiceType`, `Toggle/OnlineDuty`
3. **Interactive Prototype Connections**:
   - Customer App: Service Select → Route Input → Fare Calculate → Search Radar → Active Trip.
   - Driver App: Offline → Toggle Online → Incoming Order Modal → Accept → GPS Navigation → OTP Verify → Complete.
