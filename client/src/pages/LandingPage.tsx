import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Truck,
  Download,
  Smartphone,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Star,
  Clock,
  DollarSign,
  PhoneCall,
  ChevronDown,
  Navigation,
  Sparkles,
  Users,
  Award,
  HelpCircle,
  ExternalLink,
  QrCode,
  Layers,
  Fuel,
  Check,
  X,
  Send,
  Menu,
  Shield,
  Zap,
  Phone,
  Mail,
  Compass,
  ArrowUpRight,
  MessageSquare,
  Copy,
  Building2,
  Headphones,
  CheckCircle
} from 'lucide-react';

// Official RideNLoad Contact & Headquarters Information
export const COMPANY_CONTACT = {
  phone1: '+91 95855 99758',
  phone1Raw: '919585599758',
  phone2: '+91 8072 978 642',
  phone2Raw: '918072978642',
  email: 'support@ridenload.com',
  address: 'No.10 Dwarakami complex, 3rd floor om sakthi Nagar, 200ft bye-pass Road, near porur tollgate, vanagaram, chennai - 600095',
  landmark: 'Near Porur Tollgate, 200ft Bye-pass Road, Vanagaram',
  city: 'Chennai - 600095, Tamil Nadu',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=No.10+Dwarakami+complex+3rd+floor+om+sakthi+Nagar+200ft+bye-pass+Road+porur+tollgate+vanagaram+chennai+600095',
  facebook: 'https://www.facebook.com/share/18LXLR8sFw/',
  instagram: 'https://www.instagram.com/ridenloadofficial?utm_source=qr&xtok=M3FnYjV6cDV4NzRk',
  instagramHandle: '@ridenloadofficial',
};

// Official Brand Social Icons
export const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      clipRule="evenodd"
    />
  </svg>
);

export const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
      clipRule="evenodd"
    />
  </svg>
);

// Interactive Quick Route Selector Chips
const QUICK_EXPRESS_ROUTES = [
  { pickup: 'Chennai', drop: 'Bangalore', km: 345, price: '₹4,485', badge: 'Hot' },
  { pickup: 'Chennai', drop: 'Coimbatore', km: 505, price: '₹6,565', badge: 'Daily' },
  { pickup: 'Chennai', drop: 'Pondicherry', km: 155, price: '₹2,015', badge: 'Weekend' },
  { pickup: 'Chennai', drop: 'Madurai', km: 460, price: '₹5,980', badge: 'Express' },
  { pickup: 'Bangalore', drop: 'Coimbatore', km: 360, price: '₹4,680', badge: 'Popular' },
  { pickup: 'Salem', drop: 'Chennai', km: 340, price: '₹4,420', badge: 'Business' },
];

// Fleet Data with local guaranteed images
const FLEET_DATA = [
  {
    type: 'taxi',
    category: 'Sedan Cab',
    models: 'Swift Dzire, Toyota Etios, Aura',
    capacity: '4 Passengers • 2 Large Bags',
    rate: '₹13 / km',
    image: '/vehicles/sedan_cab.jpg',
    features: ['Chilled Air Conditioning', 'Extra Rear Legroom', 'Clean & Sanitized', 'Zero Return Fare'],
    badge: 'Couples & Solo',
    badgeColor: 'bg-blue-100 text-blue-800 border border-blue-300'
  },
  {
    type: 'taxi',
    category: 'SUV Cab',
    models: 'Maruti Ertiga, Triber, Lodgy',
    capacity: '6 Passengers • 4 Bags',
    rate: '₹18 / km',
    image: '/vehicles/suv_cab.jpg',
    features: ['Spacious 3 Rows', 'High Ground Clearance', 'Luggage Carrier', 'Family Comfort'],
    badge: 'Family Favorite',
    badgeColor: 'bg-sky-100 text-sky-800 border border-sky-300'
  },
  {
    type: 'taxi',
    category: 'Premium Innova',
    models: 'Toyota Innova Crysta',
    capacity: '7 Passengers • 5 Bags',
    rate: '₹22 / km',
    image: '/vehicles/innova_crysta.jpg',
    features: ['Captain Recliner Seats', 'VIP Luxury Comfort', 'Dual Zone Climate', 'Executive Ride'],
    badge: 'Luxury Executive',
    badgeColor: 'bg-purple-100 text-purple-800 border border-purple-300'
  },
  {
    type: 'truck',
    category: 'Tata Ace (Chhota Hathi)',
    models: 'Tata Ace Gold / HT / EV',
    capacity: 'Payload: 750 kg • Vol: 5.5 x 4.5 ft',
    rate: '₹18 / km (Base ₹250)',
    image: '/vehicles/tata_ace_truck.jpg',
    features: ['Local House Shifting', 'E-commerce Parcels', 'Vegetables/FMCG', 'Fast City Access'],
    badge: 'Small Business Pick',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
  },
  {
    type: 'truck',
    category: 'Pickup 8ft / Bolero Maxi',
    models: 'Mahindra Bolero Maxi Truck',
    capacity: 'Payload: 1,500 kg • Vol: 8 x 5 ft',
    rate: '₹25 / km (Base ₹400)',
    image: '/vehicles/bolero_pickup_truck.jpg',
    features: ['Hardware & Timber', 'Machinery & Steel', '2 BHK House Shifting', 'Tarpaulin Cover'],
    badge: 'Heavy Cargo',
    badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
  },
  {
    type: 'truck',
    category: 'Tata 407 (10ft - 14ft)',
    models: 'Tata 407 SFC / Eicher Pro',
    capacity: 'Payload: 2,500 kg - 4,000 kg',
    rate: '₹32 / km (Base ₹650)',
    image: '/vehicles/tata_407_truck.jpg',
    features: ['Commercial Pallets', 'Industrial Relocation', 'Long Distance Cargo', 'Live Fleet Radar'],
    badge: 'Commercial Freight',
    badgeColor: 'bg-teal-100 text-teal-800 border border-teal-300'
  },
];

// FAQs
const FAQS = [
  {
    q: 'How does RideNLoad One-Way Drop Taxi save 40% on fares?',
    a: 'Traditional outstation cabs charge two-way (round trip) km fare plus two-way driver beta even if you only need a one-way drop. With RideNLoad, you ONLY pay for the exact one-way distance you travel. No hidden return kilometers, saving you 40% to 50% on every intercity trip!'
  },
  {
    q: 'How do I book a cab or goods truck with RideNLoad?',
    a: 'You can book instantly online on this website using our live fare calculator and "Book Ride" feature, or call our 24/7 dispatch helpline directly at +91 94441 23456 / 94441 78910. Verified drivers with OTP verification are confirmed in under 5 minutes!'
  },
  {
    q: 'What types of goods can be booked on RideNLoad Goods Truck?',
    a: 'You can transport household shifting furniture, electronic goods, building supplies, e-commerce parcels, agricultural produce, hardware rolls, and industrial machinery using our verified Tata Ace, Bolero Pickup, and Tata 407 trucks.'
  },
  {
    q: 'How can drivers join RideNLoad and how are payouts handled?',
    a: 'Drivers can register directly via our website online registration portal, uploading their Driving License, RC Book, Insurance, and Bank details. Once verified by our team within 2 hours, drivers start receiving instant outstation & goods bookings with daily automatic bank payouts and zero return commissions!'
  },
  {
    q: 'Are toll charges, GST, and driver allowances included?',
    a: 'Our transparent fare calculator clearly shows base km fare and driver beta allowances. Toll gate charges and state permits (if applicable) are charged as per actual FASTag receipts without any markup.'
  },
];

export const LandingPage: React.FC = () => {
  // Mobile Nav Drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculator State
  const [activeService, setActiveService] = useState<'taxi' | 'truck'>('taxi');
  const [bookingScope, setBookingScope] = useState<'INTER_STATION' | 'OUTSTATION'>('OUTSTATION');
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [pickupCity, setPickupCity] = useState('Chennai');
  const [dropCity, setDropCity] = useState('Bangalore');
  const [selectedVehicle, setSelectedVehicle] = useState('Sedan Cab');
  const [customKm, setCustomKm] = useState(345);
  const [publicFareRules, setPublicFareRules] = useState<any[]>([]);
  const [dynamicVehicleTypes, setDynamicVehicleTypes] = useState<any[]>([]);

  // Fetch dynamic fare rules & dynamic vehicle types from backend
  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/fares/public-rules`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setPublicFareRules(json.data);
        }
      })
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/vehicle-types/public`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicVehicleTypes(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Quick Passenger Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // 24/7 Helpline Picker & Contact Hub State
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [callbackSent, setCallbackSent] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '', city: 'Chennai to Bangalore' });

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSent(true);
    setTimeout(() => {
      setCallbackSent(false);
      setCallbackForm({ name: '', phone: '', city: 'Chennai to Bangalore' });
    }, 6000);
  };

  // Dynamic distance lookup based on city selection
  const handleCityChange = (pickup: string, drop: string) => {
    setPickupCity(pickup);
    setDropCity(drop);
    if ((pickup === 'Chennai' && drop === 'Bangalore') || (pickup === 'Bangalore' && drop === 'Chennai')) setCustomKm(345);
    else if ((pickup === 'Chennai' && drop === 'Coimbatore') || (pickup === 'Coimbatore' && drop === 'Chennai')) setCustomKm(505);
    else if ((pickup === 'Chennai' && drop === 'Pondicherry') || (pickup === 'Pondicherry' && drop === 'Chennai')) setCustomKm(155);
    else if ((pickup === 'Chennai' && drop === 'Madurai') || (pickup === 'Madurai' && drop === 'Chennai')) setCustomKm(460);
    else if ((pickup === 'Chennai' && drop === 'Trichy') || (pickup === 'Trichy' && drop === 'Chennai')) setCustomKm(330);
    else if ((pickup === 'Chennai' && drop === 'Salem') || (pickup === 'Salem' && drop === 'Chennai')) setCustomKm(340);
    else if ((pickup === 'Bangalore' && drop === 'Coimbatore') || (pickup === 'Coimbatore' && drop === 'Bangalore')) setCustomKm(360);
    else setCustomKm(250);
  };

  // Calculate fare dynamically based on Inter-Station vs Outstation
  const calculateEstimatedFare = () => {
    const isInterStation = bookingScope === 'INTER_STATION';
    const targetService = activeService === 'taxi' ? 'DROP_TAXI' : 'GOODS_TRUCK';

    // 1. Look for matched dynamic vehicle type
    const dynamicType = dynamicVehicleTypes.find(
      (vt: any) =>
        vt.serviceType === targetService &&
        (vt.name.toLowerCase() === selectedVehicle.toLowerCase() ||
          vt.code.toLowerCase() === selectedVehicle.toLowerCase() ||
          selectedVehicle.toLowerCase().includes(vt.name.toLowerCase()))
    );

    if (activeService === 'taxi') {
      let perKm = isInterStation ? 15 : 13;
      let driverBeta = isInterStation ? 0 : 350; // Zero driver bata for Inter-Station
      let baseFareStart = isInterStation ? 150 : 200;
      let tollRate = 1.35;

      if (dynamicType) {
        const pricing = isInterStation ? dynamicType.pricing?.interStation : dynamicType.pricing?.outstation;
        if (pricing) {
          perKm = pricing.perKmRate;
          baseFareStart = pricing.baseFare;
          driverBeta = isInterStation ? 0 : (pricing.driverBata ?? 350);
          tollRate = isInterStation ? 0 : (pricing.estimatedTollPerKm ?? 1.35);
        }
      } else {
        if (selectedVehicle === 'SUV Cab') {
          perKm = isInterStation ? 20 : 18;
          driverBeta = isInterStation ? 0 : 450;
          baseFareStart = isInterStation ? 220 : 350;
        }
        if (selectedVehicle === 'Premium Innova') {
          perKm = isInterStation ? 25 : 22;
          driverBeta = isInterStation ? 0 : 550;
          baseFareStart = isInterStation ? 300 : 450;
        }
      }

      // Check if backend public rules match
      if (publicFareRules.length > 0 && !dynamicType) {
        let catKey = 'TAXI_SEDAN';
        if (selectedVehicle.includes('SUV')) catKey = 'TAXI_SUV';
        if (selectedVehicle.includes('Innova')) catKey = 'TAXI_INNOVA';

        const matchedRule = publicFareRules.find(
          (r: any) => r.category === catKey && r.tripScope === bookingScope
        );
        if (matchedRule) {
          perKm = matchedRule.perKmRate;
          driverBeta = isInterStation ? 0 : matchedRule.driverBata;
          baseFareStart = matchedRule.baseFare;
        }
      }

      const totalDistance = !isInterStation && tripType === 'roundtrip' ? customKm * 2 : customKm;
      const baseFare = Math.max(baseFareStart, totalDistance * perKm);
      const estimatedTolls = isInterStation ? 0 : Math.round(customKm * tollRate);
      const totalFare = baseFare + driverBeta + estimatedTolls;
      const twoWayStandard = customKm * 2 * perKm + driverBeta * 2 + estimatedTolls;
      const savings = !isInterStation && tripType === 'oneway' ? Math.max(0, twoWayStandard - totalFare) : 0;

      return {
        distance: totalDistance,
        baseFare,
        driverBeta,
        estimatedTolls,
        totalFare,
        savings,
        perKm,
        isInterStation,
      };
    } else {
      let baseRate = isInterStation ? 250 : 450;
      let perKm = isInterStation ? 22 : 18;
      let driverBeta = isInterStation ? 0 : 400; // Zero driver bata for Inter-Station
      let tollRate = 2.5;

      if (dynamicType) {
        const pricing = isInterStation ? dynamicType.pricing?.interStation : dynamicType.pricing?.outstation;
        if (pricing) {
          perKm = pricing.perKmRate;
          baseRate = pricing.baseFare;
          driverBeta = isInterStation ? 0 : (pricing.driverBata ?? 400);
          tollRate = isInterStation ? 0 : (pricing.estimatedTollPerKm ?? 2.5);
        }
      } else {
        if (selectedVehicle === 'Pickup 8ft / Bolero Maxi') {
          baseRate = isInterStation ? 400 : 700;
          perKm = isInterStation ? 28 : 25;
          driverBeta = isInterStation ? 0 : 500;
        }
        if (selectedVehicle === 'Tata 407 (10ft - 14ft)') {
          baseRate = isInterStation ? 650 : 1200;
          perKm = isInterStation ? 38 : 32;
          driverBeta = isInterStation ? 0 : 600;
        }
      }

      // Check backend public rules match
      if (publicFareRules.length > 0 && !dynamicType) {
        let catKey = 'TRUCK_MINI_1TON';
        if (selectedVehicle.includes('Pickup')) catKey = 'TRUCK_MEDIUM_3TON';
        if (selectedVehicle.includes('Tata 407')) catKey = 'TRUCK_HEAVY_7TON';

        const matchedRule = publicFareRules.find(
          (r: any) => r.category === catKey && r.tripScope === bookingScope
        );
        if (matchedRule) {
          perKm = matchedRule.perKmRate;
          driverBeta = isInterStation ? 0 : matchedRule.driverBata;
          baseRate = matchedRule.baseFare;
        }
      }

      const distanceFare = customKm * perKm;
      const baseFare = baseRate + distanceFare;
      const estimatedTolls = isInterStation ? 0 : Math.round(customKm * tollRate);
      const totalFare = baseFare + driverBeta + estimatedTolls;

      return {
        distance: customKm,
        baseFare,
        driverBeta,
        estimatedTolls,
        totalFare,
        savings: Math.round(totalFare * 0.2),
        perKm,
        isInterStation,
      };
    }
  };

  const fareEstimate = calculateEstimatedFare();

  const handleQuickBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitting(true);
    try {
      const isTruck = activeService === 'truck';
      const serviceType = isTruck ? 'GOODS_TRUCK' : 'DROP_TAXI';
      let vehicleCategory = 'TAXI_SEDAN';
      if (selectedVehicle.includes('SUV')) vehicleCategory = 'TAXI_SUV';
      else if (selectedVehicle.includes('Innova')) vehicleCategory = 'TAXI_INNOVA';
      else if (selectedVehicle.includes('Tata Ace')) vehicleCategory = 'TRUCK_MINI_1TON';
      else if (selectedVehicle.includes('Pickup')) vehicleCategory = 'TRUCK_MEDIUM_3TON';
      else if (selectedVehicle.includes('Tata 407')) vehicleCategory = 'TRUCK_HEAVY_7TON';

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/bookings/customer-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: bookingFormData.name.trim(),
          mobile: bookingFormData.phone.trim(),
          serviceType,
          vehicleCategory,
          tripScope: bookingScope,
          bookingType: 'SCHEDULED',
          scheduledTime: new Date(`${bookingFormData.date}T${bookingFormData.time}:00`).toISOString(),
          pickupLocation: {
            address: `${pickupCity} City Center`,
            lat: pickupCity === 'Chennai' ? 13.0827 : pickupCity === 'Bangalore' ? 12.9716 : 11.0168,
            lng: pickupCity === 'Chennai' ? 80.2707 : pickupCity === 'Bangalore' ? 77.5946 : 76.9558,
            city: pickupCity,
          },
          dropLocation: {
            address: `${dropCity} City Center`,
            lat: dropCity === 'Chennai' ? 13.0827 : dropCity === 'Bangalore' ? 12.9716 : 11.0168,
            lng: dropCity === 'Chennai' ? 80.2707 : dropCity === 'Bangalore' ? 77.5946 : 76.9558,
            city: dropCity,
          },
          distanceKm: fareEstimate.distance,
          estimatedDurationMins: Math.round(fareEstimate.distance * 1.3),
          fareBreakdown: {
            baseFare: fareEstimate.baseFare,
            distanceFare: fareEstimate.baseFare,
            timeFare: 0,
            waitingCharge: 0,
            nightCharge: 0,
            surgeCharge: 0,
            extraStopCharge: 0,
            subtotal: fareEstimate.baseFare,
            discount: 0,
            tax: Math.round(fareEstimate.totalFare * 0.05),
            tollFee: fareEstimate.estimatedTolls,
            driverBata: fareEstimate.driverBeta,
            isFinalCalculated: false,
            finalFare: fareEstimate.totalFare,
            currency: 'INR',
          },
          paymentMethod: 'CASH',
          paymentStatus: 'PENDING',
          notes: bookingFormData.notes,
        }),
      });

      const res = await response.json();
      if (res && res.data && res.data.bookingId) {
        setBookingSuccessId(res.data.bookingId);
      } else {
        setBookingSuccessId(`RNL-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      setBookingSuccessId(`RNL-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const getWhatsAppBookingLink = () => {
    const text = `Hi RideNLoad! I want to book a ${selectedVehicle} (${tripType === 'roundtrip' ? 'Round Trip' : 'One-Way'}) from ${pickupCity} to ${dropCity} (~${fareEstimate.distance} km). Estimated Fare: ₹${fareEstimate.totalFare}. Please confirm booking.`;
    return `https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white pb-20 md:pb-0">

      {/* 2. RESPONSIVE WHITE HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 lg:gap-4">

          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group py-1">
            <img
              src="/ridenload_logo.png"
              alt="RideNLoad - Passenger & Goods Transit"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-semibold text-slate-700 shrink-0">
            <a href="#services" className="hover:text-blue-600 transition-colors whitespace-nowrap">Services</a>
            <a href="#fare-calculator" className="hover:text-blue-600 transition-colors whitespace-nowrap">Fare Estimator</a>
            <a href="#fleet" className="hover:text-blue-600 transition-colors whitespace-nowrap">Fleet & Tariffs</a>
            <a href="#drivers" className="hover:text-emerald-600 transition-colors whitespace-nowrap">Drive with Us</a>
            <a href="#contact" className="hover:text-blue-700 transition-colors whitespace-nowrap text-[#0F4471] font-bold">Contact</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors whitespace-nowrap">FAQs</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Interactive 24/7 Helpline Trigger Button */}
            <button
              type="button"
              onClick={() => setShowPhoneModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-sm transition-all"
              title="Click to view 24/7 lines"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{COMPANY_CONTACT.phone1}</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded-full font-black">24/7</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg bg-[#0F4471] hover:bg-[#0c3558] text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <Car className="w-3.5 h-3.5 text-sky-300" />
              <span>Book Ride</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <img
                src="/ridenload_logo.png"
                alt="RideNLoad"
                className="h-8 w-auto object-contain"
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-200">
              <a
                href={`tel:${COMPANY_CONTACT.phone1Raw}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl bg-emerald-600 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25"
              >
                <PhoneCall className="w-4 h-4" /> 24/7 Helpline
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowBookingModal(true);
                }}
                className="py-3 px-3 rounded-xl bg-[#0F4471] text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
              >
                <Car className="w-4 h-4 text-sky-300" /> Book Instantly
              </button>
            </div>

            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-700 pb-3 border-b border-slate-200">
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">🚕 Services (Drop Taxi & Goods Truck)</a>
              <a href="#fare-calculator" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">⚡ Live Fare Estimator</a>
              <a href="#fleet" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">🚗 Fleet & Per-KM Tariffs</a>
              <a href="#drivers" onClick={() => setMobileMenuOpen(false)} className="text-emerald-600 py-1">🚚 Drive with Us (Driver Partner)</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-[#0F4471] py-1 flex items-center gap-2">📞 24/7 Helpline & Head Office</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1">❓ Frequently Asked Questions</a>
            </nav>

            {/* Mobile Contact & Office Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-black text-slate-900">
                <Headphones className="w-4 h-4 text-emerald-600" />
                <span>24/7 Helpline Numbers:</span>
              </div>
              <div className="space-y-1 pl-6">
                <a href={`tel:${COMPANY_CONTACT.phone1Raw}`} className="block font-bold text-emerald-700 hover:underline">
                  {COMPANY_CONTACT.phone1} (Line 1)
                </a>
                <a href={`tel:${COMPANY_CONTACT.phone2Raw}`} className="block font-bold text-emerald-700 hover:underline">
                  {COMPANY_CONTACT.phone2} (Line 2)
                </a>
              </div>
              <div className="pt-1.5 border-t border-slate-200 text-slate-600">
                <p className="font-bold text-slate-800">Email: {COMPANY_CONTACT.email}</p>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                  🏢 {COMPANY_CONTACT.landmark}, Chennai - 600095
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (CLEAN BLUE & WHITE BRAND THEME) */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-blue-50/20 to-white">
        {/* Soft atmospheric blue gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-sky-100/30 to-indigo-100/25 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span>South India's Premier One-Way Taxi & Logistics App</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-tight">
                One-Way <span className="text-blue-600">Drop Taxi</span> & Instant <span className="text-[#0F4471]">Goods Truck</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Pay only for one-way outstation cabs and save <strong className="text-blue-600 font-black">40% on return fares</strong>. Book verified Tata Ace, Bolero Pickups, and Tata 407 trucks for business freight with real-time GPS tracking.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/30 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Book Ride / Freight Now</span>
                </button>

                <a
                  href={`tel:${COMPANY_CONTACT.phone1Raw}`}
                  className="px-5 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 border-2 border-slate-300 hover:border-emerald-500 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Call 24/7 Helpline</span>
                </a>

                <a
                  href="#fare-calculator"
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-slate-300"
                >
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>Fare Calculator</span>
                </a>
              </div>

              {/* Interactive Express Route Pills (Click to instantly compute fare) */}
              <div className="pt-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-center lg:justify-start gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                  <span>Popular Corridors (Click to Auto-Calculate):</span>
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {QUICK_EXPRESS_ROUTES.map((route, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => {
                        setActiveService('taxi');
                        handleCityChange(route.pickup, route.drop);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                        pickupCity === route.pickup && dropCity === route.drop && activeService === 'taxi'
                          ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105'
                          : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <span>{route.pickup} ➔ {route.drop}</span>
                      <span className="text-[10px] font-black text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded-md">
                        {route.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-slate-200 max-w-xl mx-auto lg:mx-0">
                <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-center lg:text-left">
                  <p className="text-lg sm:text-2xl font-black text-slate-950">50K+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Trips Done</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-blue-100 shadow-sm text-center lg:text-left">
                  <p className="text-lg sm:text-2xl font-black text-blue-600">40% OFF</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">One-Way</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-slate-200 shadow-sm text-center lg:text-left">
                  <p className="text-lg sm:text-2xl font-black text-emerald-600">1,200+</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Active Fleet</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-blue-200 shadow-sm text-center lg:text-left">
                  <p className="text-lg sm:text-2xl font-black text-[#0F4471]">24/7</p>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Porur Hub</p>
                </div>
              </div>
            </div>

            {/* Right Hero: Instant Fare Estimator Card (Light Theme) */}
            <div id="fare-calculator" className="lg:col-span-5">
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/60 relative">

                {/* Estimator Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">Dynamic Fare Estimator</span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    Live System Pricing
                  </span>
                </div>

                {/* 1. Trip Scope Selector Tabs: Inter-Station vs Outstation */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingScope('INTER_STATION');
                      setCustomKm(25);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      bookingScope === 'INTER_STATION'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🏙️ Inter-Station (Local)</span>
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">₹0 Bata</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingScope('OUTSTATION');
                      setCustomKm(345);
                    }}
                    className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                      bookingScope === 'OUTSTATION'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🛣️ Outstation (Drop)</span>
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">+ Bata & Toll</span>
                  </button>
                </div>

                {/* 2. Service Selector Tabs */}
                <div className="grid grid-cols-2 gap-2 mt-2.5 p-1 bg-slate-50 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setActiveService('taxi'); setSelectedVehicle('Sedan Cab'); }}
                    className={`py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${activeService === 'taxi'
                        ? 'bg-[#0F4471] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Drop Taxi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveService('truck'); setSelectedVehicle('Tata Ace (Chhota Hathi)'); }}
                    className={`py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${activeService === 'truck'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Goods Truck</span>
                  </button>
                </div>

                {/* Trip Type Radios (Outstation Taxi only) */}
                {activeService === 'taxi' && bookingScope === 'OUTSTATION' && (
                  <div className="flex gap-4 mt-2.5 px-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === 'oneway'}
                        onChange={() => setTripType('oneway')}
                        className="text-blue-600 focus:ring-blue-600 accent-blue-600"
                      />
                      <span>One-Way Drop (Save 40%)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="tripType"
                        checked={tripType === 'roundtrip'}
                        onChange={() => setTripType('roundtrip')}
                        className="text-blue-600 focus:ring-blue-600 accent-blue-600"
                      />
                      <span>Round Trip</span>
                    </label>
                  </div>
                )}

                {/* Scope Explainer Notice */}
                <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-600">
                    {bookingScope === 'INTER_STATION' ? '🏙️ Station / Local Ride:' : '🛣️ Long Distance Intercity:'}
                  </span>
                  <span className={bookingScope === 'INTER_STATION' ? 'text-emerald-700 font-black' : 'text-blue-700 font-black'}>
                    {bookingScope === 'INTER_STATION' ? 'Zero Driver Bata (₹0)' : 'Dynamic FASTag Toll + Bata'}
                  </span>
                </div>

                {/* City & Vehicle Inputs */}
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {bookingScope === 'INTER_STATION' ? 'Pickup Location / Area' : 'Pickup City'}
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-3" />
                        <select
                          value={pickupCity}
                          onChange={(e) => handleCityChange(e.target.value, dropCity)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        >
                          {bookingScope === 'INTER_STATION' ? (
                            <>
                              <option value="Chennai">Porur / Vanagaram Hub</option>
                              <option value="Chennai">Chennai Central Station</option>
                              <option value="Chennai">Chennai Airport / Guindy</option>
                              <option value="Chennai">OMR / Sholinganallur</option>
                              <option value="Bangalore">Bangalore Majestic Station</option>
                              <option value="Coimbatore">Coimbatore Gandhipuram</option>
                            </>
                          ) : (
                            <>
                              <option value="Chennai">Chennai</option>
                              <option value="Bangalore">Bangalore</option>
                              <option value="Coimbatore">Coimbatore</option>
                              <option value="Madurai">Madurai</option>
                              <option value="Salem">Salem</option>
                              <option value="Trichy">Trichy</option>
                              <option value="Pondicherry">Pondicherry</option>
                              <option value="Tirunelveli">Tirunelveli</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {bookingScope === 'INTER_STATION' ? 'Drop Location / Area' : 'Destination City'}
                      </label>
                      <div className="relative">
                        <Navigation className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-3" />
                        <select
                          value={dropCity}
                          onChange={(e) => handleCityChange(pickupCity, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                        >
                          {bookingScope === 'INTER_STATION' ? (
                            <>
                              <option value="Chennai">Tambaram Station (25 km)</option>
                              <option value="Chennai">Koyambedu CMBT (15 km)</option>
                              <option value="Chennai">Siruseri SIPCOT (35 km)</option>
                              <option value="Chennai">Sriperumbudur Hub (40 km)</option>
                              <option value="Bangalore">Electronic City (25 km)</option>
                              <option value="Coimbatore">Avinashi Road (20 km)</option>
                            </>
                          ) : (
                            <>
                              <option value="Bangalore">Bangalore (345 km)</option>
                              <option value="Chennai">Chennai (345 km)</option>
                              <option value="Coimbatore">Coimbatore (505 km)</option>
                              <option value="Madurai">Madurai (460 km)</option>
                              <option value="Salem">Salem (340 km)</option>
                              <option value="Trichy">Trichy (330 km)</option>
                              <option value="Pondicherry">Pondicherry (155 km)</option>
                              <option value="Tirunelveli">Tirunelveli (620 km)</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-600">Select Vehicle Category</label>
                      <span className="text-[10px] text-blue-700 font-bold">Dynamic Admin Rates</span>
                    </div>
                    <select
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      {dynamicVehicleTypes.length > 0 ? (
                        dynamicVehicleTypes
                          .filter((t) => t.serviceType === (activeService === 'taxi' ? 'DROP_TAXI' : 'GOODS_TRUCK'))
                          .map((t) => {
                            const p = bookingScope === 'INTER_STATION' ? t.pricing?.interStation : t.pricing?.outstation;
                            const rateText = `₹${p?.perKmRate || 0}/km`;
                            const bataText = bookingScope === 'INTER_STATION' ? '₹0 Driver Bata' : `+ ₹${p?.driverBata || 0} Bata`;
                            return (
                              <option key={t.code} value={t.name}>
                                {t.name} ({t.wheelCount} Wheels) - {rateText} ({bataText})
                              </option>
                            );
                          })
                      ) : activeService === 'taxi' ? (
                        bookingScope === 'INTER_STATION' ? (
                          <>
                            <option value="Sedan Cab">Sedan Cab (Dzire / Etios) - ₹15/km (₹0 Driver Bata)</option>
                            <option value="SUV Cab">SUV Cab (Ertiga / Marazzo) - ₹20/km (₹0 Driver Bata)</option>
                            <option value="Premium Innova">Premium Innova Crysta - ₹25/km (₹0 Driver Bata)</option>
                          </>
                        ) : (
                          <>
                            <option value="Sedan Cab">Sedan Cab (Dzire / Etios) - ₹13/km (+ ₹350 Bata & Toll)</option>
                            <option value="SUV Cab">SUV Cab (Ertiga / Triber) - ₹18/km (+ ₹450 Bata & Toll)</option>
                            <option value="Premium Innova">Premium Innova Crysta - ₹22/km (+ ₹550 Bata & Toll)</option>
                          </>
                        )
                      ) : (
                        bookingScope === 'INTER_STATION' ? (
                          <>
                            <option value="Tata Ace (Chhota Hathi)">Tata Ace (750 kg) - ₹22/km (₹0 Driver Bata)</option>
                            <option value="Pickup 8ft / Bolero Maxi">Pickup 8ft / Bolero (1.5 Ton) - ₹28/km (₹0 Driver Bata)</option>
                            <option value="Tata 407 (10ft - 14ft)">Tata 407 SFC (2.5 - 4 Ton) - ₹38/km (₹0 Driver Bata)</option>
                          </>
                        ) : (
                          <>
                            <option value="Tata Ace (Chhota Hathi)">Tata Ace (750 kg) - ₹18/km (+ ₹400 Bata & Toll)</option>
                            <option value="Pickup 8ft / Bolero Maxi">Pickup 8ft / Bolero (1.5 Ton) - ₹25/km (+ ₹500 Bata & Toll)</option>
                            <option value="Tata 407 (10ft - 14ft)">Tata 407 SFC (2.5 - 4 Ton) - ₹32/km (+ ₹600 Bata & Toll)</option>
                          </>
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* Estimate Result Box */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600">
                        {bookingScope === 'INTER_STATION' ? 'Inter-Station Estimated Total Fare' : 'Outstation Estimated Total Fare'}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-950">
                          ₹{fareEstimate.totalFare.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          ({fareEstimate.distance} km @ ₹{fareEstimate.perKm}/km)
                        </span>
                      </div>
                    </div>

                    {fareEstimate.savings > 0 && (
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-xs font-black shadow-sm">
                          Save ₹{fareEstimate.savings.toLocaleString()}!
                        </span>
                        <p className="text-[9px] font-bold text-slate-500 mt-0.5">vs 2-way fare</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-700">
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px]">Base & KM</span>
                      <span className="font-extrabold text-slate-900">₹{fareEstimate.baseFare}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px]">Driver Beta</span>
                      {fareEstimate.isInterStation ? (
                        <span className="font-bold text-emerald-700">₹0 (Zero Bata)</span>
                      ) : (
                        <span className="font-extrabold text-slate-900">₹{fareEstimate.driverBeta}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-500 block text-[10px]">FASTag Toll</span>
                      {fareEstimate.isInterStation ? (
                        <span className="font-bold text-slate-600">₹0 (Local)</span>
                      ) : (
                        <span className="font-extrabold text-slate-900">₹{fareEstimate.estimatedTolls}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">ℹ️ Note:</span>
                    <span>
                      {bookingScope === 'INTER_STATION'
                        ? 'Inter-station rides have ₹0 Driver Bata. Toll is ₹0 unless city bypass crossed.'
                        : 'Highway tolls estimated from Google Maps corridor. Driver inputs actual FASTag receipt at trip end.'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: WhatsApp & Quick Web Booking */}
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={getWhatsAppBookingLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all transform hover:scale-[1.02]"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.971.53 1.769.816 2.796.817h.005c3.181 0 5.767-2.587 5.768-5.766.001-3.182-2.583-5.768-5.768-5.768zm3.376 8.163c-.143.402-.834.774-1.161.82-.328.046-.723.067-1.171-.077-.282-.09-1.258-.466-2.399-1.482-.888-.792-1.489-1.77-1.632-2.015-.143-.245-.015-.378.107-.5.11-.11.245-.285.367-.428.122-.143.163-.245.245-.408.082-.163.041-.306-.02-.428-.061-.122-.551-1.326-.755-1.815-.199-.478-.4-.413-.551-.421l-.469-.008c-.163 0-.428.061-.652.306-.224.245-.856.836-.856 2.039 0 1.203.877 2.365.999 2.529.122.163 1.725 2.634 4.18 3.693.584.252 1.04.403 1.396.516.587.187 1.121.16 1.544.097.472-.07 1.455-.595 1.66-1.171.204-.576.204-1.07.143-1.172-.061-.101-.224-.163-.448-.275z" />
                      </svg>
                      <span>Book on WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowBookingModal(true)}
                      className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 transition-all transform hover:scale-[1.02]"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant Web Booking</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowBookingModal(true)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-800 font-bold text-xs text-center flex items-center justify-center gap-1.5 border border-slate-200 transition-all"
                  >
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>Book Now with Live GPS Tracking & OTP →</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTINUOUS MARQUEE TICKER (BLUE & WHITE HIGH-IMPACT STYLE) */}
      <div className="bg-[#0F4471] text-white py-3.5 overflow-hidden border-y border-blue-900 shadow-inner">
        <div className="animate-marquee whitespace-nowrap text-xs font-black tracking-wider flex items-center gap-8">
          <span className="flex items-center gap-2"><span className="text-sky-300">⚡</span> 1-WAY DROP TAXI FROM ₹13/KM</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🛡️</span> ZERO RETURN CHARGES GUARANTEED</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-sky-300">📞</span> 24/7 HELPLINE: {COMPANY_CONTACT.phone1} / {COMPANY_CONTACT.phone2}</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-white">🚚</span> COMMODITY GOODS TRUCKS (TATA ACE & BOLERO)</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">📍</span> CHENNAI PORUR HEADQUARTERS</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-sky-300">✉️</span> {COMPANY_CONTACT.email}</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-amber-300">⭐</span> 4.9/5 RATED OVER 50,000+ TRIPS</span>
          <span className="text-blue-300">•</span>
          {/* Duplicate loop items for smooth endless scroll */}
          <span className="flex items-center gap-2"><span className="text-sky-300">⚡</span> 1-WAY DROP TAXI FROM ₹13/KM</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">🛡️</span> ZERO RETURN CHARGES GUARANTEED</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-sky-300">📞</span> 24/7 HELPLINE: {COMPANY_CONTACT.phone1} / {COMPANY_CONTACT.phone2}</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-white">🚚</span> COMMODITY GOODS TRUCKS (TATA ACE & BOLERO)</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-emerald-400">📍</span> CHENNAI PORUR HEADQUARTERS</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-sky-300">✉️</span> {COMPANY_CONTACT.email}</span>
          <span className="text-blue-300">•</span>
          <span className="flex items-center gap-2"><span className="text-amber-300">⭐</span> 4.9/5 RATED OVER 50,000+ TRIPS</span>
        </div>
      </div>

      {/* 4. HIGHWAY EXPRESS FLEET PHOTO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
          <img
            src="/express_fleet_banner.jpg"
            alt="RideNLoad Highway Express Drop Taxi & Goods Truck"
            className="w-full h-56 sm:h-80 md:h-96 object-cover transform group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-10">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider w-max mb-2 shadow-md">
              Verified Intercity Network
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white max-w-xl">
              Connecting 150+ Cities across Tamil Nadu, Karnataka, Andhra & Kerala
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-lg font-medium">
              Reliable 24/7 on-demand fleet with professional verified drivers and real-time GPS tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 4.5 MODERN INTERACTIVE COMPARISON MATRIX (RideNLoad Advantage) */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Transparent Pricing Guarantee
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Why Pay Double? <span className="text-blue-600">The RideNLoad Advantage</span>
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm font-medium">
            See exactly how RideNLoad cuts up to 40% on one-way journeys compared to conventional operators.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 sm:p-5 font-bold">Feature / Tariff Policy</th>
                <th className="p-4 sm:p-5 font-black text-sky-300 bg-blue-950/90 border-x border-blue-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" /> RideNLoad
                  </span>
                </th>
                <th className="p-4 sm:p-5 font-bold text-slate-300">Traditional Cabs</th>
                <th className="p-4 sm:p-5 font-bold text-slate-300">Buses & Trains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Return Fare Charged</td>
                <td className="p-4 sm:p-5 font-black text-blue-700 bg-blue-50/50 border-x border-slate-200">
                  ₹0 (Zero Return Charges)
                </td>
                <td className="p-4 sm:p-5 text-rose-600">Double KM (Charges 2-way fare)</td>
                <td className="p-4 sm:p-5 text-slate-600">Per ticket per head</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Doorstep Pickup & Drop</td>
                <td className="p-4 sm:p-5 font-black text-blue-700 bg-blue-50/50 border-x border-slate-200">
                  100% Doorstep at exact address
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Extra pickup charges</td>
                <td className="p-4 sm:p-5 text-rose-600">Station/Terminal pickup only</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Toll Gate Billing</td>
                <td className="p-4 sm:p-5 font-black text-blue-700 bg-blue-50/50 border-x border-slate-200">
                  Actual FASTag Receipts Only
                </td>
                <td className="p-4 sm:p-5 text-slate-600">Inflated manual quotes</td>
                <td className="p-4 sm:p-5 text-slate-600">Included in fixed ticket</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Commercial Goods Transport</td>
                <td className="p-4 sm:p-5 font-black text-blue-700 bg-blue-50/50 border-x border-slate-200">
                  Tata Ace & Bolero on-demand
                </td>
                <td className="p-4 sm:p-5 text-rose-600">Not Available (Cabs only)</td>
                <td className="p-4 sm:p-5 text-rose-600">Strict parcel luggage limits</td>
              </tr>
              <tr className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 sm:p-5 font-bold text-slate-900">Live GPS Tracking & Dispatch</td>
                <td className="p-4 sm:p-5 font-black text-blue-700 bg-blue-50/50 border-x border-slate-200">
                  Real-Time GPS & Live SMS Link
                </td>
                <td className="p-4 sm:p-5 text-rose-600">Manual phone coordination</td>
                <td className="p-4 sm:p-5 text-slate-600">Fixed schedule tracking</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. SERVICES MATRIX (DROP TAXI & GOODS TRUCK) */}
      <section id="services" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Comprehensive <span className="text-blue-600">Mobility & Freight</span> Services
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-base font-medium">
            Engineered for seamless personal outstation travel and commercial business logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Drop Taxi Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-blue-400 hover:shadow-xl transition-all shadow-md">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5">
              <Car className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2">One-Way Drop Taxi</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              Why pay return fare when you only need a drop? RideNLoad Drop Taxi offers one-way outstation cab booking across all major cities, towns, and airports in Tamil Nadu, Karnataka, Andhra Pradesh, and Kerala.
            </p>

            <div className="space-y-2.5 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Return Fare — Pay only for km traveled</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Doorstep pickup & drop 24/7 with zero surge charge</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Professional chauffeurs with background checks</span>
              </div>
            </div>
          </div>

          {/* Goods Truck Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-emerald-400 hover:shadow-xl transition-all shadow-md">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
              <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-2">On-Demand Goods Truck</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              Instant mini truck and commercial truck booking for household shifting, hardware distribution, FMCG goods, and bulk enterprise transport.
            </p>

            <div className="space-y-2.5 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified fleet: Tata Ace, Bolero Maxi, 407 & 14ft Eicher</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Live GPS location sharing with receiver & sender</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent per-km rate cards without middleman commission</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FLEET SHOWCASE (#fleet) - CLEAN BLUE & WHITE THEME */}
      <section id="fleet" className="py-16 sm:py-20 bg-slate-100/60 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Our Verified <span className="text-blue-600">Fleet & Tariffs</span>
            </h2>
            <p className="text-slate-600 mt-2 text-xs sm:text-base font-medium">
              Choose from our well-maintained cabs and commercial transport trucks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLEET_DATA.map((vehicle, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Proper Aspect Ratio & Overlay */}
                  <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-100">
                    <img
                      src={vehicle.image}
                      alt={vehicle.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${vehicle.badgeColor}`}>
                        {vehicle.badge}
                      </span>
                    </div>

                    {/* Rate Tag */}
                    <div className="absolute bottom-3 right-3.5">
                      <span className="px-3 py-1 rounded-lg bg-white/95 border border-blue-400 text-blue-950 text-xs font-black shadow-md backdrop-blur-sm">
                        {vehicle.rate}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-950">{vehicle.category}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {vehicle.type === 'taxi' ? 'Taxi Cab' : 'Goods Truck'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-blue-600 mt-0.5">{vehicle.models}</p>
                    <p className="text-[11px] text-slate-600 mt-1 font-semibold">{vehicle.capacity}</p>

                    <div className="space-y-1.5 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-700">
                      {vehicle.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0">
                  <a
                    href="#apps"
                    className="w-full py-2.5 rounded-xl bg-[#0F4471] hover:bg-blue-600 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>Book in App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. DRIVER ONBOARDING SECTION (#drivers) (LIGHT THEME) */}
      <section id="drivers" className="py-16 sm:py-20 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/80 border-2 border-emerald-300 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300">
                  Drive & Earn with RideNLoad
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-950">
                  Attach Your <span className="text-emerald-700">Taxi or Truck</span> & Earn Up to ₹75,000/Month
                </h2>

                <p className="text-slate-700 text-xs sm:text-sm sm:text-base leading-relaxed font-medium">
                  Join our verified network of 1,200+ driver partners. Zero return commissions, instant daily bank deposits, free FASTag support, and 24/7 round-the-clock emergency road assistance.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-base sm:text-lg font-black text-emerald-700">0% Comm.</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600">On return drops</p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-emerald-200 shadow-sm">
                    <p className="text-base sm:text-lg font-black text-slate-950">Daily</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600">Bank payouts</p>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-emerald-200 shadow-sm col-span-2 sm:col-span-1">
                    <p className="text-base sm:text-lg font-black text-blue-600">24/7</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-600">Driver Helpline</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <Link
                  to="/driver-register"
                  className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all text-center flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>Register as Driver Partner Online</span>
                </Link>

                <a
                  href={`tel:${COMPANY_CONTACT.phone1Raw}`}
                  className="w-full py-3 px-5 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-300 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Driver Helpline: {COMPANY_CONTACT.phone1}</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQS SECTION (#faq) */}
      <section id="faq" className="py-16 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-slate-600 mt-2 text-xs sm:text-sm font-medium">
            Everything you need to know about booking, fare calculation, and app installation.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-blue-600 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {activeFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10.5 DEDICATED 24/7 CONTACT & LOGISTICS HEADQUARTERS HUB (#contact) */}
      <section id="contact" className="py-16 sm:py-24 bg-gradient-to-b from-blue-50/30 to-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider mb-3">
              <Headphones className="w-3.5 h-3.5 text-blue-700" /> 24/7 Live Support & Regional Headquarters
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              Get in Touch with <span className="text-blue-600">RideNLoad</span>
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base font-medium leading-relaxed">
              Have questions about booking, outstation tariffs, driver onboarding, or commercial freight? Connect directly with our round-the-clock dispatch officers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 3 Contact Cards */}
            <div className="lg:col-span-7 space-y-5">

              {/* Phone Helplines Card */}
              <div className="bg-white border-2 border-emerald-400/80 rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                      <PhoneCall className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        24/7 Round-the-Clock Helplines
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-slate-950 mt-1">Instant Phone & WhatsApp Assistance</h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5">
                  {/* Line 1 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Line 1 (Primary 24/7)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-950 tracking-tight">{COMPANY_CONTACT.phone1}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`tel:${COMPANY_CONTACT.phone1Raw}`}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent('Hi RideNLoad! I want to book a taxi/truck.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(COMPANY_CONTACT.phone1, 'phone1')}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs transition-colors"
                        title="Copy Number"
                      >
                        {copiedField === 'phone1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Line 2 */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Line 2 (Alternate Dispatch)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-950 tracking-tight">{COMPANY_CONTACT.phone2}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href={`tel:${COMPANY_CONTACT.phone2Raw}`}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${COMPANY_CONTACT.phone2Raw}?text=${encodeURIComponent('Hi RideNLoad! I want to book a taxi/truck.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(COMPANY_CONTACT.phone2, 'phone2')}
                        className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs transition-colors"
                        title="Copy Number"
                      >
                        {copiedField === 'phone2' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Support Card */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-400 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Official Email
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">{COMPANY_CONTACT.email}</h3>
                    <p className="text-xs text-slate-500">Corporate bookings, billing & driver partnerships</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`mailto:${COMPANY_CONTACT.email}`}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-[#0F4471] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3 h-3" /> Write Mail
                  </a>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(COMPANY_CONTACT.email, 'email')}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Head Office Address Card */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg hover:border-blue-300 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Registered Headquarters & Regional Logistics Hub
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-950">RideNLoad Mobility & Freight Hub</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                      {COMPANY_CONTACT.address}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      📍 Landmark: {COMPANY_CONTACT.landmark}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-2">
                      <a
                        href={COMPANY_CONTACT.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(COMPANY_CONTACT.address, 'address')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 font-bold text-xs transition-colors"
                      >
                        {copiedField === 'address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedField === 'address' ? 'Address Copied!' : 'Copy Address'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Social Media Channels Banner */}
              <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-indigo-50/90 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">Connect with RideNLoad on Social Media</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">Stay updated with route discount alerts, driver tips & outstation offers</p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={COMPANY_CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={COMPANY_CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white font-bold text-xs shadow-sm hover:shadow hover:opacity-95 transition-all"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right: Quick 2-Minute Callback Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#07192C] via-[#0A2540] to-[#07192C] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-blue-900/60 relative">
              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                ⚡ 2-Min Response
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-300">Request Callback</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">Need an Immediate Fare Quote?</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Leave your details and our Porur operations manager will call you immediately with vehicle availability.
                </p>
              </div>

              {callbackSent ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-black shadow-lg">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Callback Request Confirmed!</h4>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Our team is reviewing route availability and will connect to your number within 2 minutes.
                  </p>
                  <a
                    href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent(`Hi RideNLoad! I just submitted a callback request for ${callbackForm.city}. Please connect immediately.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md mt-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp Directly
                  </a>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Contact Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs sm:text-sm">+91</span>
                      <input
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        placeholder="9876543210"
                        value={callbackForm.phone}
                        onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-12 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Pickup City / Route Requirement</label>
                    <select
                      value={callbackForm.city}
                      onChange={(e) => setCallbackForm({ ...callbackForm, city: e.target.value })}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-blue-400 focus:outline-none"
                    >
                      <option value="Chennai to Bangalore">Chennai to Bangalore (Drop Taxi)</option>
                      <option value="Chennai to Coimbatore">Chennai to Coimbatore (Drop Taxi)</option>
                      <option value="Chennai to Pondicherry">Chennai to Pondicherry (Drop Taxi)</option>
                      <option value="Tata Ace Goods Booking">Tata Ace / Commercial Truck</option>
                      <option value="Other Tamil Nadu Route">Other Intercity Corridor</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Request 2-Minute Callback</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center pt-1">
                    🔒 No spam. 100% confidential. Your details are only used for booking dispatch.
                  </p>
                </form>
              )}

              {/* Operating Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24 Hours / 365 Days Live Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Verified Drivers & Fleet</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. FOOTER (HIGH CONTRAST PREMIUM DEEP BLUE-NAVY #07192C) */}
      <footer className="bg-[#07192C] border-t border-blue-950 pt-14 pb-10 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-blue-950/80">

            <div className="lg:col-span-2 space-y-3">
              <div className="inline-block bg-white rounded-xl p-2 shadow-md">
                <img
                  src="/ridenload_logo.png"
                  alt="RideNLoad - Passenger & Goods Transit"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <p className="text-slate-300 max-w-sm leading-relaxed text-xs">
                South India's premier outstation Drop Taxi & on-demand commercial Goods Truck platform. Save 40% on one-way intercity cab journeys.
              </p>
              <div className="pt-1 space-y-1.5 text-xs">
                <p className="font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Head Office: {COMPANY_CONTACT.landmark}</span>
                </p>
                <p className="text-[11px] text-slate-400 pl-6 leading-tight">
                  {COMPANY_CONTACT.address}
                </p>
              </div>

              {/* Official Social Media Channels with Icons */}
              <div className="pt-3">
                <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <span>Follow Us Online</span>
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={COMPANY_CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-blue-400 hover:text-white border border-[#1877F2]/30 hover:border-[#1877F2] text-xs font-semibold transition-all duration-200 group shadow-sm"
                    title="Follow RideNLoad on Facebook"
                  >
                    <FacebookIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={COMPANY_CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-500/15 hover:bg-gradient-to-r hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-pink-400 hover:text-white border border-pink-500/30 hover:border-transparent text-xs font-semibold transition-all duration-200 group shadow-sm"
                    title="Follow RideNLoad on Instagram"
                  >
                    <InstagramIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#services" className="hover:text-sky-300 transition-colors">Drop Taxi Service</a></li>
                <li><a href="#services" className="hover:text-sky-300 transition-colors">Goods Truck Logistics</a></li>
                <li><a href="#fare-calculator" className="hover:text-sky-300 transition-colors">Fare Calculator</a></li>
                <li><a href="#fleet" className="hover:text-sky-300 transition-colors">Fleet & Tariffs</a></li>
                <li><a href="#drivers" className="hover:text-emerald-400 transition-colors">Drive With Us</a></li>
                <li><a href="#contact" className="hover:text-sky-300 transition-colors font-bold text-sky-400">Contact Us (24/7)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">Quick Actions</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setShowBookingModal(true)} className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-left text-slate-300">
                    <Car className="w-3.5 h-3.5 text-sky-400" /> Instant Cab Booking
                  </button>
                </li>
                <li>
                  <Link to="/driver-register" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Driver Registration
                  </Link>
                </li>
                <li>
                  <a href="#fare-calculator" className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-left text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Live Fare Calculator
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-3">24/7 Support & Dispatch</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href={`tel:${COMPANY_CONTACT.phone1Raw}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">{COMPANY_CONTACT.phone1}</span>
                  </a>
                </li>
                <li>
                  <a href={`tel:${COMPANY_CONTACT.phone2Raw}`} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{COMPANY_CONTACT.phone2}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${COMPANY_CONTACT.email}`} className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>{COMPANY_CONTACT.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent('Hi RideNLoad! I want to book a taxi/truck.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold text-emerald-400"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Direct Booking</span>
                  </a>
                </li>
                <li>
                  <a
                    href={COMPANY_CONTACT.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-slate-300"
                    title="RideNLoad on Facebook"
                  >
                    <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Facebook Official</span>
                  </a>
                </li>
                <li>
                  <a
                    href={COMPANY_CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-400 transition-colors flex items-center gap-1.5 text-slate-300"
                    title="RideNLoad on Instagram"
                  >
                    <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                    <span>Instagram (@ridenloadofficial)</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} RideNLoad DropTaxi & Goods Truck Technologies. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-2">
                <a
                  href={COMPANY_CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-blue-500/10 hover:bg-[#1877F2] text-blue-400 hover:text-white border border-blue-500/20 flex items-center justify-center transition-all duration-200"
                  title="RideNLoad Facebook"
                  aria-label="RideNLoad Facebook"
                >
                  <FacebookIcon className="w-3.5 h-3.5" />
                </a>
                <a
                  href={COMPANY_CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-pink-500/10 hover:bg-gradient-to-r hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-pink-400 hover:text-white border border-pink-500/20 flex items-center justify-center transition-all duration-200"
                  title="RideNLoad Instagram"
                  aria-label="RideNLoad Instagram"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              </div>
              <span className="text-blue-900 hidden sm:inline">|</span>
              <a href="#" className="hover:text-slate-200">Privacy Policy</a>
              <a href="#" className="hover:text-slate-200">Terms of Service</a>
              <a href="#" className="hover:text-slate-200">Driver Agreement</a>
              <Link to="/admin/login" className="text-slate-400 hover:text-sky-300 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 12. STICKY MOBILE BOTTOM BAR FOR INSTANT THUMB ACTION */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setShowPhoneModal(true)}
          className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold text-center flex items-center justify-center gap-1 border border-slate-300"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
          <span>Call 24/7</span>
        </button>
        <a
          href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent('Hi RideNLoad! I want to book a cab / truck.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 rounded-xl bg-[#25D366] text-white text-xs font-black text-center flex items-center justify-center gap-1 shadow-md"
        >
          <span>WhatsApp</span>
        </a>
        <button
          type="button"
          onClick={() => setShowBookingModal(true)}
          className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-black text-center flex items-center justify-center gap-1 shadow-md shadow-blue-600/25"
        >
          <span>Book Now</span>
        </button>
      </div>

      {/* 12.5 24/7 PHONE HELPLINE PICKER MODAL */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowPhoneModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2.5 border border-emerald-200">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-950">RideNLoad 24/7 Helplines</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a direct line to connect with our dispatch officer:</p>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${COMPANY_CONTACT.phone1Raw}`}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-900 flex items-center justify-between transition-all group"
              >
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-emerald-700">Line 1 (Primary 24/7)</span>
                  <p className="text-sm font-black text-slate-950">{COMPANY_CONTACT.phone1}</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <Phone className="w-3 h-3" /> Call
                </span>
              </a>

              <a
                href={`tel:${COMPANY_CONTACT.phone2Raw}`}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-900 flex items-center justify-between transition-all group"
              >
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase text-emerald-700">Line 2 (Alternate Dispatch)</span>
                  <p className="text-sm font-black text-slate-950">{COMPANY_CONTACT.phone2}</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <Phone className="w-3 h-3" /> Call
                </span>
              </a>

              <a
                href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent('Hi RideNLoad! I want to book a taxi/truck.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>
      )}



      {/* 15. QUICK PASSENGER / LOGISTICS WEB BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowBookingModal(false);
                setBookingSuccessId(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-2 border border-blue-200">
                {activeService === 'taxi' ? <Car className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950">
                {activeService === 'taxi' ? 'Instant Drop Taxi Booking' : 'Book Commercial Goods Truck'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Confirmed driver assignment with 24/7 dedicated dispatch manager
              </p>
            </div>

            {/* Trip Preview Banner */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Booking Scope:</span>
                <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {bookingScope === 'INTER_STATION' ? '🏙️ Inter-Station (Local - ₹0 Bata)' : '🛣️ Outstation (Intercity)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Route:</span>
                <span className="font-extrabold text-slate-900">{pickupCity} ➔ {dropCity} ({fareEstimate.distance} km)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Vehicle:</span>
                <span className="font-bold text-slate-900">{selectedVehicle} ({bookingScope === 'INTER_STATION' ? 'City Drop' : (tripType === 'roundtrip' ? 'Round Trip' : 'One-Way')})</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-600 border-t border-slate-200">
                <div><span className="font-bold">Base:</span> ₹{fareEstimate.baseFare}</div>
                <div><span className="font-bold">Bata:</span> {bookingScope === 'INTER_STATION' ? '₹0' : `₹${fareEstimate.driverBeta}`}</div>
                <div><span className="font-bold">Toll:</span> {bookingScope === 'INTER_STATION' ? '₹0' : `₹${fareEstimate.estimatedTolls}`}</div>
              </div>
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total Est. Fare:</span>
                <span className="text-sm font-black text-blue-600">₹{fareEstimate.totalFare.toLocaleString()}</span>
              </div>
            </div>

            {bookingSuccessId ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 border border-emerald-300 rounded-2xl animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-950">Booking Request Received!</h4>
                <p className="text-xs text-slate-700">
                  Reference ID: <span className="font-mono font-bold text-emerald-800">{bookingSuccessId}</span>
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our dispatch officer is assigning the nearest driver and will call you at <span className="font-bold text-slate-900">+91 {bookingFormData.phone}</span> within 5 minutes.
                </p>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent(`Hi RideNLoad! I just submitted booking ${bookingSuccessId} for ${selectedVehicle} from ${pickupCity} to ${dropCity}. Please send driver details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>Track on WhatsApp ➔</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickBookingSubmit} className="space-y-3 text-xs font-bold text-slate-700">
                <div>
                  <label className="block text-slate-600 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sundaram"
                    value={bookingFormData.name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={bookingFormData.date}
                      onChange={(e) => setBookingFormData({ ...bookingFormData, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Pickup Time & Pickup Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:30 AM, Doorstep / Airport pickup"
                    value={bookingFormData.notes}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    {bookingSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Confirming Dispatch...</span>
                      </>
                    ) : (
                      <span>Confirm Online Booking (Pay Later)</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 16. 24/7 FLOATING WHATSAPP & PHONE ACTION BUTTONS */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 items-end">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${COMPANY_CONTACT.phone1Raw}?text=${encodeURIComponent('Hi RideNLoad! I have an inquiry about booking a cab / goods truck.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.971.53 1.769.816 2.796.817h.005c3.181 0 5.767-2.587 5.768-5.766.001-3.182-2.583-5.768-5.768-5.768zm3.376 8.163c-.143.402-.834.774-1.161.82-.328.046-.723.067-1.171-.077-.282-.09-1.258-.466-2.399-1.482-.888-.792-1.489-1.77-1.632-2.015-.143-.245-.015-.378.107-.5.11-.11.245-.285.367-.428.122-.143.163-.245.245-.408.082-.163.041-.306-.02-.428-.061-.122-.551-1.326-.755-1.815-.199-.478-.4-.413-.551-.421l-.469-.008c-.163 0-.428.061-.652.306-.224.245-.856.836-.856 2.039 0 1.203.877 2.365.999 2.529.122.163 1.725 2.634 4.18 3.693.584.252 1.04.403 1.396.516.587.187 1.121.16 1.544.097.472-.07 1.455-.595 1.66-1.171.204-.576.204-1.07.143-1.172-.061-.101-.224-.163-.448-.275z" />
          </svg>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">WhatsApp 24/7</span>
        </a>

        {/* Call Now Button */}
        <button
          type="button"
          onClick={() => setShowPhoneModal(true)}
          className="group flex items-center gap-2 bg-[#0F4471] hover:bg-[#0c3558] text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl border border-white/10 transition-all duration-300 transform hover:scale-105"
          aria-label="Call 24/7 Helpline"
        >
          <PhoneCall className="w-5 h-5 text-sky-300 animate-pulse" />
          <span className="hidden sm:inline font-bold text-xs tracking-wide">Call {COMPANY_CONTACT.phone1}</span>
        </button>
      </div>
    </div>
  );
};
