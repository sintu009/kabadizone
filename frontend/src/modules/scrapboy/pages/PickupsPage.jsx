import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, CheckCircle2, X, Banknote, Smartphone, Navigation, XCircle, Truck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { completePickup } from '../features/walletSlice';
import toast from 'react-hot-toast';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FILTERS = ['all', 'started', 'completed', 'cancelled'];

const statusStyle = {
  Started: 'bg-amber-50 text-amber-600',
  Completed: 'bg-emerald-50 text-emerald-600',
  Cancelled: 'bg-red-50 text-red-500',
};

const PickupsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pickups, balance } = useSelector((s) => s.scrapboyWallet);
  const [filter, setFilter] = useState('all');
  const [completing, setCompleting] = useState(null);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [amount, setAmount] = useState('');

  const myPickups = pickups.filter((p) => p.status !== 'Assigned');
  const filtered = filter === 'all' ? myPickups : myPickups.filter((p) => p.status.toLowerCase() === filter);
  const getCount = (f) => f === 'all' ? myPickups.length : myPickups.filter((p) => p.status.toLowerCase() === f).length;

  const openComplete = (pickup) => {
    setCompleting(pickup);
    setAmount(String(pickup.estimatedAmount));
    setPaymentMode('Cash');
  };

  const handleConfirm = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error('Enter valid amount');
    if (amt > balance) return toast.error('Insufficient wallet balance');
    dispatch(completePickup({ pickupId: completing.id, amount: amt, paymentMode }));
    toast.success(`₹${amt} via ${paymentMode}. ${t('scrapboy.completed')}!`);
    setCompleting(null);
  };

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('scrapboy.myPickups')}</h2>
        <p className="text-sm text-gray-500">{t('scrapboy.managePickups')}</p>
      </div>

      {/* Capsule Filters */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              filter === f
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {t(`scrapboy.${f}`)} <span className={`ml-1 ${filter === f ? 'text-emerald-100' : 'text-gray-400'}`}>({getCount(f)})</span>
          </button>
        ))}
      </div>

      {/* Pickup Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">{t('scrapboy.noPickups')}</div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                p.status === 'Started' ? 'border-amber-400 bg-amber-50/30'
                : p.status === 'Cancelled' ? 'border-gray-100 bg-white opacity-60'
                : 'border-gray-100 bg-white'
              }`}
            >
              {/* Running banner */}
              {p.status === 'Started' && (
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 flex items-center gap-2.5 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
                  <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-white/30 rounded-lg animate-ping" />
                    <div className="relative w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Truck className="h-4 w-4" />
                    </div>
                  </div>
                  <span className="relative text-xs font-bold flex items-center gap-2">
                    {t('scrapboy.tripRunning')}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                  </span>
                </div>
              )}

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{p.customer}</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle[p.status]}`}>
                    {t(`scrapboy.${p.status.toLowerCase()}`)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                  <span>{p.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{p.scrapTypes.join(', ')} · {p.estimatedWeight}</span>
                  <span className="font-semibold text-gray-900">₹{p.estimatedAmount}</span>
                </div>

                {p.status === 'Started' && (
                  <div className="flex gap-2">
                    <button onClick={() => openDirections(p.lat, p.lng)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200">
                      <Navigation className="h-4 w-4" />
                    </button>
                    <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200">
                      <Phone className="h-4 w-4" />
                    </a>
                    <button onClick={() => openComplete(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                      <CheckCircle2 className="h-4 w-4" /> {t('scrapboy.completeAndPay')}
                    </button>
                  </div>
                )}

                {p.status === 'Completed' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> {t('scrapboy.paymentDone')}
                  </div>
                )}

                {p.status === 'Cancelled' && (
                  <div className="flex items-center gap-2 text-xs text-red-500 font-medium">
                    <XCircle className="h-4 w-4" /> {t('scrapboy.cancelled')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Complete Pickup Modal */}
      {completing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div style={{ height: 180 }}>
              <MapContainer key={completing.id} center={[completing.lat, completing.lng]} zoom={15} scrollWheelZoom={false} zoomControl={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[completing.lat, completing.lng]}>
                  <Popup>{completing.customer}<br />{completing.address}</Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t('scrapboy.completePickup')}</h3>
                <button onClick={() => setCompleting(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{completing.customer}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-start gap-1"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {completing.address}</p>
              </div>
              <button onClick={() => openDirections(completing.lat, completing.lng)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors">
                <Navigation className="h-4 w-4" /> {t('scrapboy.openDirections')}
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('scrapboy.paymentAmount')} (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" />
                <p className="text-xs text-gray-400 mt-1">{t('scrapboy.deductedFromWallet')} (₹{balance.toLocaleString()})</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('scrapboy.paymentMode')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setPaymentMode('Cash')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${paymentMode === 'Cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <Banknote className="h-5 w-5" /> {t('scrapboy.cash')}
                  </button>
                  <button onClick={() => setPaymentMode('GPay')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${paymentMode === 'GPay' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    <Smartphone className="h-5 w-5" /> {t('scrapboy.gpay')}
                  </button>
                </div>
              </div>
              <button onClick={handleConfirm} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                {t('scrapboy.confirmAndPay')} ₹{amount || 0}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupsPage;
