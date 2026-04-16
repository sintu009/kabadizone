import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package, Clock, CheckCircle2, MapPin, Check, X, Truck,
  ChevronRight, Loader2, Phone, Calendar, IndianRupee,
  Navigation, Scale, Tag,
} from 'lucide-react';
import { fetchAssignedPickups, fetchMyWallet, fetchDashboard, updatePickupStatus } from '../features/walletSlice';
import toast from 'react-hot-toast';

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
};

// Helper to get field value with fallback names
const f = (obj, ...keys) => {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return null;
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.scrapboyAuth);
  const { pickups, dashboard, loading } = useSelector((s) => s.scrapboyWallet);
  const [selected, setSelected] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    dispatch(fetchAssignedPickups());
    dispatch(fetchDashboard());
    dispatch(fetchMyWallet());
  }, [dispatch]);

  const assignedPickups = pickups.filter((p) => p.status === 'ASSIGNED');
  const inProgressPickups = pickups.filter((p) => p.status === 'IN_PROGRESS');
  const completedCount = dashboard?.completed_requests || pickups.filter((p) => p.status === 'COMPLETED').length;

  const stats = [
    { label: t('scrapboy.newRequests'), value: String(assignedPickups.length), icon: Package, color: 'emerald' },
    { label: t('scrapboy.active'), value: String(inProgressPickups.length), icon: Clock, color: 'amber' },
    { label: t('scrapboy.completed'), value: String(completedCount), icon: CheckCircle2, color: 'blue' },
  ];

  const handleAccept = async () => {
    if (!selected) return;
    setAccepting(true);
    try {
      await dispatch(updatePickupStatus({ pickupRequestId: selected.pickup_request_id, status: 'IN_PROGRESS' })).unwrap();
      toast.success(`${t('scrapboy.startPickup')} - ${selected.user_name}`);
      setSelected(null);
    } catch (err) {
      toast.error(err || 'Failed to accept');
    }
    setAccepting(false);
  };

  const handleReject = async () => {
    if (!selected) return;
    setRejecting(true);
    try {
      await dispatch(updatePickupStatus({ pickupRequestId: selected.pickup_request_id, status: 'CANCELLED' })).unwrap();
      toast(t('scrapboy.reject'), { icon: '✕' });
      setSelected(null);
    } catch (err) {
      toast.error(err || 'Failed to reject');
    }
    setRejecting(false);
  };

  const openDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">👋 {t('scrapboy.welcome')}</p>
        <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Scrap Boy'}</h2>
      </div>

      {/* Running Trip Banner */}
      {inProgressPickups.map((p) => (
        <Link
          key={p.pickup_request_id}
          to="/scrapboy/pickups"
          className="block relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
          <div className="relative flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-white/30 rounded-xl animate-ping" />
              <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Truck className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold">{t('scrapboy.tripRunning')}</span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
              </div>
              <p className="text-white/90 text-xs truncate">{p.user_name} · {p.address}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70 shrink-0" />
          </div>
        </Link>
      ))}

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[s.color]}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* New Pickup Requests (ASSIGNED) */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {t('scrapboy.newPickupRequests')}
          {assignedPickups.length > 0 && (
            <span className="ml-2 text-xs font-medium text-white bg-emerald-600 px-2 py-0.5 rounded-full">{assignedPickups.length}</span>
          )}
        </h3>
        <div className="space-y-3">
          {assignedPickups.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">{t('scrapboy.noNewRequests')}</div>
          ) : (
            assignedPickups.map((p) => (
              <div
                key={p.pickup_request_id}
                onClick={() => setSelected(p)}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{p.user_name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                    {f(p, 'slot_time', 'slot_label', 'time_slot') || '—'}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                  <span>{p.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{f(p, 'garbage_type', 'garbage_name', 'type_name') || '—'} · {p.estimated_weight} {f(p, 'unit_name', 'unit') || ''}</span>
                  <span className="font-semibold text-gray-900">₹{p.total_amount}</span>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl">
                  <ChevronRight className="h-3.5 w-3.5" /> Tap to view details
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Pickup Detail Modal ── */}
      {selected && (() => {
        const slotTime = f(selected, 'slot_time', 'slot_label', 'time_slot');
        const requestDate = f(selected, 'request_date', 'pickup_date', 'created_on', 'created_at');
        const pricePerUnit = f(selected, 'price_at_request', 'price_per_unit', 'unit_price');
        const garbageType = f(selected, 'garbage_type', 'garbage_name', 'type_name');
        const unitName = f(selected, 'unit_name', 'unit');
        const lat = f(selected, 'latitude', 'lat');
        const lng = f(selected, 'longitude', 'lng');

        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Pickup Details</h3>
                  <p className="text-xs text-gray-400">#{selected.pickup_request_id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                      {selected.user_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{selected.user_name}</p>
                      {selected.phone_number && (
                        <a href={`tel:${selected.phone_number}`} className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Phone className="h-3 w-3" /> {selected.phone_number}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Address</p>
                    <p className="text-sm text-gray-700 mt-0.5">{selected.address || '—'}</p>
                  </div>
                </div>

                {/* Directions */}
                {lat && lng && (
                  <button
                    onClick={() => openDirections(lat, lng)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <Navigation className="h-4 w-4" /> Open Directions
                  </button>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem icon={Tag} label="Scrap Type" value={garbageType || '—'} color="purple" />
                  <DetailItem icon={Scale} label="Est. Weight" value={`${selected.estimated_weight || '—'} ${unitName || ''}`} color="amber" />
                  <DetailItem icon={IndianRupee} label="Amount" value={`₹${selected.total_amount || 0}`} color="emerald" />
                  <DetailItem icon={IndianRupee} label="Price/Unit" value={pricePerUnit ? `₹${pricePerUnit}` : '—'} color="blue" />
                  <DetailItem icon={Calendar} label="Date" value={requestDate ? new Date(requestDate).toLocaleDateString() : '—'} color="rose" />
                  <DetailItem icon={Clock} label="Slot" value={slotTime || '—'} color="indigo" />
                </div>

                {/* Image if present */}
                {selected.image && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">Scrap Image</p>
                    <img src={selected.image} alt="Scrap" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAccept}
                    disabled={accepting || rejecting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                  >
                    {accepting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Starting...</>
                    ) : (
                      <><Check className="h-4 w-4" /> {t('scrapboy.accept')} & {t('scrapboy.startPickup')}</>
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={accepting || rejecting}
                    className="px-5 py-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60"
                  >
                    {rejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

const iconBg = {
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  blue: 'bg-blue-50 text-blue-600',
  rose: 'bg-rose-50 text-rose-600',
  indigo: 'bg-indigo-50 text-indigo-600',
};

const DetailItem = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg[color]}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

export default DashboardPage;
