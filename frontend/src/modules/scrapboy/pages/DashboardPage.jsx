import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Clock, CheckCircle2, MapPin, Check, X, Truck, ChevronRight } from 'lucide-react';
import { acceptPickup, rejectPickup } from '../features/walletSlice';
import toast from 'react-hot-toast';

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  blue: 'bg-blue-50 text-blue-600',
};

const DashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.scrapboyAuth);
  const { pickups } = useSelector((s) => s.scrapboyWallet);

  const newPickups = pickups.filter((p) => p.status === 'Assigned');
  const runningPickups = pickups.filter((p) => p.status === 'Started');
  const completedCount = pickups.filter((p) => p.status === 'Completed').length;

  const stats = [
    { label: t('scrapboy.newRequests'), value: String(newPickups.length), icon: Package, color: 'emerald' },
    { label: t('scrapboy.active'), value: String(runningPickups.length), icon: Clock, color: 'amber' },
    { label: t('scrapboy.completed'), value: String(completedCount), icon: CheckCircle2, color: 'blue' },
  ];

  const handleAccept = (id, name) => {
    dispatch(acceptPickup(id));
    toast.success(`${t('scrapboy.startPickup')} - ${name}`);
  };

  const handleReject = (id) => {
    dispatch(rejectPickup(id));
    toast(t('scrapboy.reject'), { icon: '✕' });
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-gray-500">👋 {t('scrapboy.welcome')}</p>
        <h2 className="text-xl font-bold text-gray-900">{user?.name || 'Scrap Boy'}</h2>
      </div>

      {/* Running Trip Banner */}
      {runningPickups.map((p) => (
        <Link
          key={p.id}
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
              <p className="text-white/90 text-xs truncate">{p.customer} · {p.address}</p>
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

      {/* New Pickup Requests */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          {t('scrapboy.newPickupRequests')}
          {newPickups.length > 0 && (
            <span className="ml-2 text-xs font-medium text-white bg-emerald-600 px-2 py-0.5 rounded-full">{newPickups.length}</span>
          )}
        </h3>
        <div className="space-y-3">
          {newPickups.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">{t('scrapboy.noNewRequests')}</div>
          ) : (
            newPickups.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{p.customer}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{p.timeSlot}</span>
                </div>
                <div className="flex items-start gap-1.5 text-xs text-gray-500 mb-1.5">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                  <span>{p.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{p.scrapTypes.join(', ')} · {p.estimatedWeight}</span>
                  <span className="font-semibold text-gray-900">₹{p.estimatedAmount}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(p.id, p.customer)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <Check className="h-4 w-4" /> {t('scrapboy.accept')} & {t('scrapboy.startPickup')}
                  </button>
                  <button
                    onClick={() => handleReject(p.id)}
                    className="px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
