import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PlusCircle, UserPlus, Truck, Send, PlayCircle, CheckCircle2 } from 'lucide-react';
import api from '../../api/axiosClient';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'create_booking' | 'add_driver' | 'broadcast'>('create_booking');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Booking Form State
  const [pickup, setPickup] = useState('Chennai Central Station, Park Town');
  const [drop, setDrop] = useState('Tidel Park, OMR, Taramani');
  const [serviceType, setServiceType] = useState<'DROP_TAXI' | 'GOODS_TRUCK'>('DROP_TAXI');
  const [category, setCategory] = useState('TAXI_SEDAN');

  // Driver Form State
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverMobile, setDriverMobile] = useState('');

  // Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Fetch any customer
      const custRes: any = await api.get('/customers?limit=1');
      const custId = custRes.data[0]?._id;

      await api.post('/bookings', {
        customerId: custId,
        serviceType,
        vehicleCategory: category,
        bookingType: 'INSTANT',
        pickupLocation: {
          address: pickup,
          lat: 13.0827,
          lng: 80.2707,
        },
        dropLocation: {
          address: drop,
          lat: 12.9830,
          lng: 80.2594,
        },
        paymentMethod: 'UPI',
      });

      setMessage('Trip booking created & assigned successfully!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/drivers', {
        name: driverName,
        email: driverEmail,
        mobile: driverMobile,
        serviceType,
      });
      setMessage('Driver added and queued for KYC approval!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to add driver');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/notifications/send', {
        title: broadcastTitle,
        message: broadcastMsg,
        channel: 'PUSH',
        targetAudience: 'ALL',
      });
      setMessage('Broadcast notification dispatched to all drivers & users!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setMessage(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Dispatch & Operations Center" size="lg">
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-cloudy-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('create_booking')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'create_booking'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Quick Booking Dispatch
          </button>
          <button
            onClick={() => setActiveTab('add_driver')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'add_driver'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Onboard Driver
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'broadcast'
                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                : 'text-slate-600 hover:text-slate-900 bg-cloudy-100 hover:bg-cloudy-200 dark:text-slate-400 dark:hover:text-white dark:bg-slate-800/40'
            }`}
          >
            <Send className="w-4 h-4" /> Broadcast Push
          </button>
        </div>

        {message && (
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {/* Tab 1: Quick Booking Dispatch */}
        {activeTab === 'create_booking' && (
          <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e: any) => setServiceType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                >
                  <option value="DROP_TAXI">DropTaxi (Passenger)</option>
                  <option value="GOODS_TRUCK">Goods Truck (Logistics)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Vehicle Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                >
                  {serviceType === 'DROP_TAXI' ? (
                    <>
                      <option value="TAXI_MINI">DropTaxi Mini</option>
                      <option value="TAXI_SEDAN">DropTaxi Sedan (Dzire / Etios)</option>
                      <option value="TAXI_SUV">DropTaxi Prime SUV (Innova)</option>
                    </>
                  ) : (
                    <>
                      <option value="TRUCK_MINI_1TON">Mini Truck 1-Ton (Tata Ace)</option>
                      <option value="TRUCK_MEDIUM_3TON">Medium Freight 3-Ton (Eicher)</option>
                      <option value="TRUCK_HEAVY_7TON">Heavy Carrier 7-Ton (BharatBenz)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Pickup Address</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Drop Address</label>
              <input
                type="text"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                Dispatch Live Trip
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Onboard Driver */}
        {activeTab === 'add_driver' && (
          <form onSubmit={handleAddDriver} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Driver Full Name</label>
              <input
                type="text"
                placeholder="e.g. Senthil Nathan"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98400 00000"
                  value={driverMobile}
                  onChange={(e) => setDriverMobile(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Email Address</label>
                <input
                  type="email"
                  placeholder="driver@gmail.com"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                Register Driver
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Broadcast Push */}
        {activeTab === 'broadcast' && (
          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Broadcast Title</label>
              <input
                type="text"
                placeholder="e.g. Festive Surge Bonus Alert!"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Message Content</label>
              <textarea
                rows={3}
                placeholder="Type push notification message here..."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                required
                className="w-full bg-white dark:bg-slate-800 border border-cloudy-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading}>
                Send Broadcast
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
