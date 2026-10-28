import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation,
  Compass,
  Car,
  Truck,
  User,
  Phone,
  Radio,
  Clock,
  Gauge,
  MapPin,
  Sparkles,
} from 'lucide-react';
import api from '../api/axiosClient';
import { useSocket } from '../context/SocketContext';
import { Badge, StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { formatCurrency, formatDateTime } from '../utils/formatters';

// Custom Leaflet DivIcon Creators for Taxi vs Truck
const createVehicleIcon = (serviceType: string, isMoving: boolean) => {
  const isTruck = serviceType === 'GOODS_TRUCK';
  const color = isTruck ? '#38bdf8' : '#22c55e';
  const symbol = isTruck ? '🚚' : '🚕';

  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background: ${color};
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 15px ${color}80;
        border: 2px solid #ffffff;
        transform: translate(-50%, -50%);
        ${isMoving ? 'animation: live-bounce 1s infinite alternate;' : ''}
      ">
        ${symbol}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

// Component to dynamically re-center map
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

type MapLayerType = 'roadmap' | 'satellite' | 'traffic' | 'terrain';

const MAP_LAYERS: Record<MapLayerType, { name: string; icon: string; url: string; subdomains?: string[] }> = {
  roadmap: {
    name: 'OpenStreetMap Standard',
    icon: '🗺️',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
  },
  satellite: {
    name: 'Satellite View',
    icon: '🛰️',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    subdomains: [],
  },
  traffic: {
    name: 'CartoDB Voyager',
    icon: '🚦',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
  },
  terrain: {
    name: 'OpenTopoMap / Terrain',
    icon: '🏔️',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
  },
};

export const FleetTrackingPage: React.FC = () => {
  const { liveFleet } = useSocket();
  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('roadmap');

  // Initial Fetch of Fleet
  const { data: fleetData, isLoading } = useQuery({
    queryKey: ['fleet-tracking', serviceFilter, statusFilter],
    queryFn: () =>
      api
        .get('/tracking/fleet', {
          params: { serviceType: serviceFilter, status: statusFilter },
        })
        .then((res: any) => res.data),
    refetchInterval: 8000,
  });

  const driversList = (liveFleet && liveFleet.length > 0) ? liveFleet : (fleetData?.drivers || []);
  const activeTrips = fleetData?.activeTrips || [];

  const centerPos: [number, number] = selectedDriver
    ? [selectedDriver.location.lat, selectedDriver.location.lng]
    : [13.0827, 80.2707]; // Chennai center

  const currentLayerConfig = MAP_LAYERS[activeLayer];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
              Live Fleet Radar & GPS Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              Google Maps Live
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
            Real-time moving vehicle tracking powered by WebSocket telemetry & Google Maps Engine.
          </p>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-cloudy-300 dark:border-slate-800 text-xs text-emerald-800 dark:text-emerald-300 font-extrabold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse" />
            <span>{driversList.length} Vehicles Broadcasting</span>
          </div>
        </div>
      </div>

      {/* Main Map + Fleet Drawer Grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 min-h-[75vh]">
        {/* Left 3 cols: Full Interactive Leaflet Map */}
        <div className="lg:col-span-3 h-[52vh] sm:h-[60vh] lg:h-full min-h-[380px] rounded-2xl overflow-hidden glass-panel border border-cloudy-200 dark:border-slate-800 relative z-10 shadow-card">
          <MapContainer
            center={centerPos}
            zoom={12}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <ChangeView center={centerPos} zoom={selectedDriver ? 14 : 12} />

            <TileLayer
              key={activeLayer}
              attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
              url={currentLayerConfig.url}
              subdomains={currentLayerConfig.subdomains || ['0', '1', '2', '3']}
              maxZoom={20}
            />

            {/* Drivers Live Markers */}
            {driversList.map((driver: any) => {
              const pos: [number, number] = [
                driver.location?.lat || 13.0827,
                driver.location?.lng || 80.2707,
              ];
              const isMoving = driver.location?.speed > 0;

              return (
                <Marker
                  key={driver._id || driver.id}
                  position={pos}
                  icon={createVehicleIcon(driver.serviceType, isMoving)}
                  eventHandlers={{
                    click: () => setSelectedDriver(driver),
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 text-slate-900 dark:text-slate-100">
                      <p className="font-extrabold text-slate-950 dark:text-white text-sm">{driver.name}</p>
                      <p className="font-mono text-brand-700 dark:text-emerald-400 font-bold">{driver.driverId}</p>
                      <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        {driver.serviceType === 'DROP_TAXI' ? '🚕 DropTaxi' : '🚚 Goods Truck'}
                      </p>
                      <p className="text-[11px] font-semibold">Speed: <span className="font-bold text-slate-950 dark:text-white">{driver.location?.speed || 0} km/h</span></p>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">{driver.location?.address}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Overlay Quick Service Filters (Top Left) */}
          <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-cloudy-300 dark:border-slate-800 text-xs shadow-md">
            <button
              onClick={() => setServiceFilter('')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                serviceFilter === '' ? 'bg-brand-600 text-white shadow' : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setServiceFilter('DROP_TAXI')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                serviceFilter === 'DROP_TAXI'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              🚕 DropTaxi
            </button>
            <button
              onClick={() => setServiceFilter('GOODS_TRUCK')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                serviceFilter === 'GOODS_TRUCK'
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              🚚 Goods Truck
            </button>
          </div>

          {/* Map Layer Mode Switcher (Top Right) */}
          <div className="absolute top-4 right-4 z-[400] flex items-center gap-1 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-cloudy-200 dark:border-slate-800 text-xs shadow-md">
            {(Object.keys(MAP_LAYERS) as MapLayerType[]).map((layerKey) => {
              const layer = MAP_LAYERS[layerKey];
              const isActive = activeLayer === layerKey;
              return (
                <button
                  key={layerKey}
                  onClick={() => setActiveLayer(layerKey)}
                  title={layer.name}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{layer.icon}</span>
                  <span className="hidden sm:inline text-[11px]">{layer.name.replace('Google ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 1 col: Live Driver Telemetry & Active Trips Inspector */}
        <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between overflow-hidden shadow-card border border-cloudy-200 dark:border-slate-800">
          <div className="space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-cloudy-200 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                {selectedDriver ? 'Inspecting Vehicle' : 'Fleet Active Roster'}
              </h3>
              {selectedDriver && (
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {selectedDriver ? (
              // Selected Driver Live Telemetry Card
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{selectedDriver.name}</h4>
                    <StatusBadge status={selectedDriver.onlineStatus} />
                  </div>
                  <p className="font-mono text-brand-600 dark:text-brand-400 text-xs font-semibold">{selectedDriver.driverId}</p>
                  <p className="text-slate-600 dark:text-slate-400">{selectedDriver.mobile}</p>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      Current Speed
                    </span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {selectedDriver.location?.speed || 38} <span className="text-xs font-normal">km/h</span>
                    </span>
                  </div>

                  <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      Heading
                    </span>
                    <span className="text-lg font-bold text-brand-600 dark:text-sky-400 mt-0.5 block">
                      {selectedDriver.location?.heading || 90}°
                    </span>
                  </div>
                </div>

                {/* Vehicle Paired */}
                <div className="p-3 bg-cloudy-50 dark:bg-slate-950 rounded-xl border border-cloudy-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Paired Vehicle
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">
                    {selectedDriver.vehicle?.vehicleNumber || 'TN 01 AB 1234'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {selectedDriver.vehicle?.brand || 'Toyota'} {selectedDriver.vehicle?.model || 'Innova'}
                  </p>
                </div>
              </div>
            ) : (
              // Full Fleet List Scroll
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {driversList.map((d: any) => (
                  <div
                    key={d._id || d.id}
                    onClick={() => setSelectedDriver(d)}
                    className="p-3 bg-cloudy-50 hover:bg-cloudy-100 dark:bg-slate-950/70 dark:hover:bg-slate-900 rounded-xl border border-cloudy-200/80 dark:border-slate-800/80 cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{d.name}</span>
                      <StatusBadge status={d.onlineStatus} className="text-[9px] py-0.5" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{d.serviceType === 'DROP_TAXI' ? '🚕 Taxi' : '🚚 Truck'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{d.location?.speed || 0} km/h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
