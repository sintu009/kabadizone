import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, CheckCircle2, X, Banknote, Smartphone, Navigation, XCircle, Truck, Loader2, Camera } from 'lucide-react';
import { fetchAssignedPickups, fetchMyWallet, completePickupAsync } from '../features/walletSlice';
import toast from 'react-hot-toast';

const FILTERS = ['all', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const statusStyle = {
  IN_PROGRESS: 'bg-amber-50 text-amber-600',
  COMPLETED: 'bg-emerald-50 text-emerald-600',
  CANCELLED: 'bg-red-50 text-red-500',
};

const statusLabel = {
  IN_PROGRESS: 'started',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

const PickupsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pickups, balance, loading } = useSelector((s) => s.scrapboyWallet);
  const [filter, setFilter] = useState('all');
  const [completing, setCompleting] = useState(null);
  const [actualWeight, setActualWeight] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Compress image to ~800KB max using canvas
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 1200;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = (height * MAX) / width; width = MAX; }
            else { width = (width * MAX) / height; height = MAX; }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const compressed = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(compressed);
          }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImageFile(compressed);
    setImagePreview(URL.createObjectURL(compressed));
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    dispatch(fetchAssignedPickups());
    dispatch(fetchMyWallet());
  }, [dispatch]);

  // Exclude ASSIGNED from this page (those show on dashboard)
  const myPickups = pickups.filter((p) => p.status !== 'ASSIGNED');
  const filtered = filter === 'all' ? myPickups : myPickups.filter((p) => p.status === filter);
  const getCount = (f) => f === 'all' ? myPickups.length : myPickups.filter((p) => p.status === f).length;

  const openComplete = (pickup) => {
    setCompleting(pickup);
    setActualWeight(String(pickup.estimated_weight || ''));
    setFinalPrice(String(pickup.price_at_request || ''));
    setImageFile(null);
    setImagePreview(null);
  };

  const handleConfirm = async () => {
    const weight = Number(actualWeight);
    const price = Number(finalPrice);
    if (!weight || weight <= 0) return toast.error('Enter valid weight');
    if (!price || price <= 0) return toast.error('Enter valid price');

    setSubmitting(true);
    try {
      await dispatch(completePickupAsync({
        pickupRequestId: completing.pickup_request_id,
        actual_weight: weight,
        final_price: price,
        image: imageFile,
      })).unwrap();
      toast.success(t('scrapboy.completed') + '!');
      setCompleting(null);
      dispatch(fetchAssignedPickups());
      dispatch(fetchMyWallet());
    } catch (err) {
      toast.error(err || 'Failed to complete pickup');
    }
    setSubmitting(false);
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
            {f === 'all' ? t('scrapboy.all') : t(`scrapboy.${statusLabel[f]}`)} <span className={`ml-1 ${filter === f ? 'text-emerald-100' : 'text-gray-400'}`}>({getCount(f)})</span>
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
              key={p.pickup_request_id}
              className={`rounded-2xl border shadow-sm overflow-hidden ${
                p.status === 'IN_PROGRESS' ? 'border-amber-400 bg-amber-50/30'
                : p.status === 'CANCELLED' ? 'border-gray-100 bg-white opacity-60'
                : 'border-gray-100 bg-white'
              }`}
            >
              {/* Running banner */}
              {p.status === 'IN_PROGRESS' && (
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
                  <span className="font-semibold text-gray-900">{p.user_name}</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusStyle[p.status] || 'bg-gray-50 text-gray-700'}`}>
                    {t(`scrapboy.${statusLabel[p.status] || p.status.toLowerCase()}`)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                  <span>{p.address}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{p.garbage_type} · {p.estimated_weight} {p.unit_name}</span>
                  <span className="font-semibold text-gray-900">₹{p.total_amount}</span>
                </div>

                {p.status === 'IN_PROGRESS' && (
                  <div className="flex gap-2">
                    {p.latitude && p.longitude && (
                      <button onClick={() => openDirections(p.latitude, p.longitude)} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200">
                        <Navigation className="h-4 w-4" />
                      </button>
                    )}
                    {p.phone_number && (
                      <a href={`tel:${p.phone_number}`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200">
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    <button onClick={() => openComplete(p)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                      <CheckCircle2 className="h-4 w-4" /> {t('scrapboy.completeAndPay')}
                    </button>
                  </div>
                )}

                {p.status === 'COMPLETED' && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> {t('scrapboy.paymentDone')}
                  </div>
                )}

                {p.status === 'CANCELLED' && (
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
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t('scrapboy.completePickup')}</h3>
                <button onClick={() => setCompleting(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900">{completing.user_name}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-start gap-1"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {completing.address}</p>
              </div>
              {completing.latitude && completing.longitude && (
                <button onClick={() => openDirections(completing.latitude, completing.longitude)} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-xl hover:bg-blue-100 transition-colors">
                  <Navigation className="h-4 w-4" /> {t('scrapboy.openDirections')}
                </button>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Weight ({completing.unit_name})</label>
                <input type="number" value={actualWeight} onChange={(e) => setActualWeight(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per {completing.unit_name || 'unit'} (₹)</label>
                <input type="number" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20" />
                <p className="text-xs text-gray-400 mt-1">
                  Total: ₹{(Number(actualWeight) * Number(finalPrice)).toLocaleString() || 0} · {t('scrapboy.deductedFromWallet')} (₹{Number(balance).toLocaleString()})
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proof Photo</label>
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Proof" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                    <Camera className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Tap to take photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageCapture}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {submitting ? 'Processing...' : `${t('scrapboy.confirmAndPay')} ₹${(Number(actualWeight) * Number(finalPrice)) || 0}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupsPage;
