import { ArrowRight, PackageOpen, Recycle, DollarSign, Clock, ShieldCheck, Leaf, Truck, Phone, MapPin, CalendarDays, Package, ChevronLeft, Search, Loader2, LocateFixed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';
import toast from 'react-hot-toast';



// Fix default leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 16);
  }, [center, map]);
  return null;
};

const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return Promise.resolve(null);
    setLocating(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
          setUserLocation(loc);
          setLocating(false);
          resolve(loc);
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
          setLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }, []);

  // Ask permission on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { userLocation, locating, requestLocation };
};

const BookPickupForm = ({ userLocation, locating, requestLocation }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', address: '', date: '', slot_id: '', scrapTypes: [], latitude: 0, longitude: 0 });
  const [garbagePrices, setGarbagePrices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState([26.12, 85.39]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);
  const appliedLocationRef = useRef(false);

  const reverseGeocode = useCallback((lat, lon) => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.display_name) {
          setForm((f) => ({ ...f, address: data.display_name, latitude: lat, longitude: lon }));
          setSearchQuery(data.display_name);
          setMapCenter([lat, lon]);
          setErrors((e) => ({ ...e, address: undefined }));
        }
      })
      .catch(() => {});
  }, []);

  const applyLocation = useCallback((loc) => {
    if (!loc) return;
    setMapCenter([loc.lat, loc.lon]);
    setForm((f) => ({ ...f, latitude: loc.lat, longitude: loc.lon }));
    reverseGeocode(loc.lat, loc.lon);
  }, [reverseGeocode]);

  // Apply user location when it becomes available
  useEffect(() => {
    if (userLocation && !appliedLocationRef.current) {
      appliedLocationRef.current = true;
      applyLocation(userLocation);
    }
  }, [userLocation, applyLocation]);

  // Re-ask when user enters step 2 if location still not set
  useEffect(() => {
    if (step === 2 && form.latitude === 0 && form.longitude === 0) {
      requestLocation().then((loc) => { if (loc) applyLocation(loc); });
    }
  }, [step, form.latitude, form.longitude, requestLocation, applyLocation]);

  useEffect(() => {
    apiClient.get(API_ENDPOINTS.SLOT_TIMES.BASE).then((res) => {
      setSlots(Array.isArray(res) ? res : res.data || []);
    }).catch(() => { });
    apiClient.get(API_ENDPOINTS.GARBAGE.PRICES).then((res) => {
      setGarbagePrices(Array.isArray(res) ? res : res.data || []);
    }).catch(() => { });
  }, []);

  const searchLocation = useCallback((query) => {
    if (!query || query.length < 3) { setSearchResults([]); return; }
    setSearching(true);
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`)
      .then((r) => r.json())
      .then((data) => setSearchResults(data))
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false));
  }, []);

  const handleSearchInput = (val) => {
    setSearchQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(val), 400);
  };

  const selectLocation = (place) => {
    const lat = parseFloat(place.lat);
    const lon = parseFloat(place.lon);
    setForm((f) => ({ ...f, address: place.display_name, latitude: lat, longitude: lon }));
    setMapCenter([lat, lon]);
    setSearchQuery(place.display_name);
    setSearchResults([]);
    setErrors((e) => ({ ...e, address: undefined }));
  };

  const isStepValid = (s) => {
    if (s === 1) return form.name.trim() && /^\d{10}$/.test(form.phone.trim());
    if (s === 2) return !!form.address;
    if (s === 3) return !!form.date && !!form.slot_id;
    if (s === 4) return form.scrapTypes.length > 0;
    return false;
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.name.trim()) e.name = t('bookPickup.required');
      if (!form.phone.trim()) e.phone = t('bookPickup.required');
      else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = t('bookPickup.invalidPhone');
    } else if (s === 2) {
      if (!form.address) e.address = t('bookPickup.required');
    } else if (s === 3) {
      if (!form.date) e.date = t('bookPickup.required');
      if (!form.slot_id) e.slot_id = t('bookPickup.required');
    } else if (s === 4) {
      if (form.scrapTypes.length === 0) e.scrapTypes = t('bookPickup.required');
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => Math.min(s + 1, 4)); };
  const canContinue = isStepValid(step);
  const canSubmit = isStepValid(4);
  const prev = () => { setErrors({}); setStep((s) => Math.max(s - 1, 1)); };
  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };
  const toggleScrap = (id) => {
    setForm((f) => ({
      ...f,
      scrapTypes: f.scrapTypes.includes(id)
        ? f.scrapTypes.filter((t) => t !== id)
        : [...f.scrapTypes, id],
    }));
    setErrors((e) => ({ ...e, scrapTypes: undefined }));
  };

  const handleSubmit = async () => {
    if (!validate(4)) return;
    setSubmitting(true);
    try {
      const selectedPrice = garbagePrices.find((g) => g.id === form.scrapTypes[0]);
      await apiClient.post(API_ENDPOINTS.PICKUP_REQUESTS.GUEST, {
        name: form.name,
        phone: form.phone,
        garbage_type_id: selectedPrice?.garbage_type_id || 1,
        estimated_weight: 5,
        garbage_price_id: selectedPrice?.id || 1,
        price_at_request: parseFloat(selectedPrice?.price_per_unit) || 0,
        total_amount: (parseFloat(selectedPrice?.price_per_unit) || 0) * 5,
        address: form.address,
        latitude: form.latitude,
        longitude: form.longitude,
        image: '',
        slot_id: Number(form.slot_id) || 1,
        request_date: form.date,
      });
      toast.success(t('bookPickup.successMessage'));
      setForm({ name: '', phone: '', address: '', date: '', slot_id: '', scrapTypes: [], latitude: 0, longitude: 0 });
      setSearchQuery('');
      setStep(1);
    } catch {
      toast.error(t('bookPickup.errorMessage'));
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: t('bookPickup.contact'), icon: Phone },
    { id: 2, label: t('bookPickup.address'), icon: MapPin },
    { id: 3, label: t('bookPickup.schedule'), icon: CalendarDays },
    { id: 4, label: t('bookPickup.type'), icon: Package },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-8">
      {/* Stepper */}
      <div className="flex items-center mb-8 sm:mb-10">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors shrink-0 ${isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`mt-1.5 text-[10px] sm:text-xs font-medium whitespace-nowrap ${isActive || isDone ? 'text-emerald-600' : 'text-gray-400'
                  }`}>{s.label}</span>
              </div>
              {idx < 3 && (
                <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full -mt-5 ${step > s.id ? 'bg-emerald-400' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[180px]">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookPickup.fullName')}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder={t('bookPickup.namePlaceholder')}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookPickup.phone')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder={t('bookPickup.phonePlaceholder')}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">{t('bookPickup.address')}</label>
                <button
                  type="button"
                  onClick={() => requestLocation().then((loc) => { if (loc) applyLocation(loc); })}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:text-gray-400"
                >
                  <LocateFixed className={`h-3.5 w-3.5 ${locating ? 'animate-spin' : ''}`} />
                  {locating ? t('bookPickup.locating') : t('bookPickup.useMyLocation')}
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder={t('bookPickup.addressPlaceholder')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              {searching && <p className="text-xs text-gray-400 mt-1">{t('bookPickup.searching')}</p>}
              {searchResults.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {searchResults.map((r) => (
                    <li key={r.place_id} onClick={() => selectLocation(r)} className="px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer border-b border-gray-50 last:border-0">
                      {r.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-200 h-52">
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} className="h-full w-full" style={{ zIndex: 1 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                <MapUpdater center={mapCenter} />
                {form.latitude !== 0 && <Marker position={[form.latitude, form.longitude]} />}
              </MapContainer>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookPickup.date')}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${errors.date ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookPickup.time')}</label>
              <select
                value={form.slot_id}
                onChange={(e) => update('slot_id', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-white ${errors.slot_id ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">{t('bookPickup.selectTime')}</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}
                  </option>
                ))}
              </select>
              {errors.slot_id && <p className="text-xs text-red-500 mt-1">{errors.slot_id}</p>}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('bookPickup.scrapTypes')}</label>
            <select
              value={form.scrapTypes[0] || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setForm((f) => ({ ...f, scrapTypes: val ? [val] : [] }));
                setErrors((er) => ({ ...er, scrapTypes: undefined }));
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors bg-white ${errors.scrapTypes ? 'border-red-400' : 'border-gray-200'}`}
            >
              <option value="">Select scrap type</option>
              {garbagePrices.filter((g) => g.is_active).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.garbage_name} — ₹{item.price_per_unit}/{item.unit_name}
                </option>
              ))}
            </select>
            {errors.scrapTypes && <p className="text-xs text-red-500 mt-1">{errors.scrapTypes}</p>}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <button
          onClick={prev}
          disabled={step === 1}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${step === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-600 hover:bg-gray-50 active:bg-gray-100'
            }`}
        >
          <ChevronLeft className="h-4 w-4" /> {t('bookPickup.back')}
        </button>

        {step < 4 ? (
          <button
            onClick={next}
            disabled={!canContinue}
            className={`inline-flex items-center gap-1.5 px-6 sm:px-8 py-3 text-sm font-semibold rounded-xl transition-colors shadow-sm ${canContinue ? 'text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800' : 'text-white bg-emerald-600/40 cursor-not-allowed'}`}
          >
            {t('bookPickup.continue')} <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
            className={`inline-flex items-center gap-1.5 px-6 sm:px-8 py-3 text-sm font-semibold rounded-xl transition-colors shadow-sm ${canSubmit && !submitting ? 'text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800' : 'text-white bg-emerald-600/40 cursor-not-allowed'}`}
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {t('bookPickup.submitting')}</> : <>{t('bookPickup.submit')} <ArrowRight className="h-4 w-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const geo = useGeolocation();
  return (
    <div className="flex flex-col min-h-screen relative bg-white">
      {/* Subtle Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/60 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-50/80 blur-[150px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-teal-50/60 blur-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section
          className="relative pt-28 pb-16 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 min-h-[60vh] md:min-h-[70vh]"
          style={{
            backgroundColor: '#001819',
            backgroundImage: "url('https://res.cloudinary.com/dnimidvwh/image/upload/v1773525771/hero_bg_ixpaof.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'scroll',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              {t('hero.title')}{' '}
              <span className="text-emerald-400">{t('hero.titleHighlight')}</span>
            </h1>

            <p className="max-w-xl mx-auto text-base md:text-lg text-gray-200 mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12">
              <Link to="#book-pickup" className="group inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-600/30">
                {t('hero.bookPickup')}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="#rates" className="inline-flex items-center justify-center px-7 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5 backdrop-blur-sm">
                {t('hero.checkRates')}
              </Link>
            </div>


          </div>
        </section>

        {/* Book Your Pickup */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8" id="book-pickup">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-xs sm:text-sm mb-2">{t('bookPickup.subtitle')}</h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('bookPickup.title')}</h3>
            </div>

            <BookPickupForm userLocation={geo.userLocation} locating={geo.locating} requestLocation={geo.requestLocation} />
          </div>
        </section>

        {/* Scrap Rate Price */}
        <section className="relative bg-gray-50/50" id="rates">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <div className="text-center mb-16">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('rates.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900">{t('rates.title')}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: t('rates.newspaper'), price: 15, icon: "📰" },
                { name: t('rates.cardboard'), price: 10, icon: "📦" },
                { name: t('rates.ironSteel'), price: 35, icon: "🔩" },
                { name: t('rates.aluminum'), price: 140, icon: "🥫" },
                { name: t('rates.plastics'), price: 12, icon: "🥤" },
                { name: t('rates.eWaste'), price: null, icon: "💻" },
                { name: t('rates.brass'), price: 420, icon: "🎺" },
                { name: t('rates.copper'), price: 650, icon: "🔌" },
              ].map((item, idx) => (
                <div key={idx} className="group bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-300 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{item.name}</h4>
                  <div className="flex items-baseline justify-center gap-0.5">
                    {item.price ? (
                      <>
                        <span className="text-xl font-bold text-emerald-600">₹{item.price}</span>
                        <span className="text-xs text-gray-400">/kg</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-400">{t('rates.varies')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/rates" className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                {t('rates.viewAll')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 relative" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-emerald-600 font-semibold tracking-widest uppercase text-sm mb-3">{t('howItWorks.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900">{t('howItWorks.title')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: PackageOpen, title: t('howItWorks.gatherScrap'), desc: t('howItWorks.gatherDesc') },
                { icon: Clock, title: t('howItWorks.bookPickup'), desc: t('howItWorks.bookDesc') },
                { icon: Truck, title: t('howItWorks.weArrive'), desc: t('howItWorks.arriveDesc') },
                { icon: DollarSign, title: t('howItWorks.getPaid'), desc: t('howItWorks.paidDesc') }
              ].map((step, idx) => (
                <div key={idx} className="group relative bg-white border border-gray-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-500 group-hover:to-emerald-500/0 transition-all duration-500 rounded-t-2xl"></div>

                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    <span className="text-emerald-400 text-sm mr-2">0{idx + 1}</span>
                    {step.title}
                  </h4>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Why Choose Us */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-950" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/50 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-900/30 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-3">{t('whyUs.subtitle')}</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">{t('whyUs.title')}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              {[
                { icon: ShieldCheck, title: t('whyUs.digitalWeighing'), desc: t('whyUs.digitalDesc') },
                { icon: DollarSign, title: t('whyUs.bestRates'), desc: t('whyUs.ratesDesc') },
                { icon: Leaf, title: t('whyUs.ecoFriendly'), desc: t('whyUs.ecoDesc') },
              ].map((feature, idx) => (
                <div key={idx} className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/0 group-hover:via-emerald-400 group-hover:to-emerald-500/0 transition-all duration-500 rounded-t-2xl" />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-emerald-200/50 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Impact Stats Row */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Recycle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold">{t('whyUs.impactTitle')}</p>
                  <p className="text-emerald-400/60 text-xs">{t('whyUs.thisMonth')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: t('whyUs.cardboardSaved'), value: '2,450 kg', pct: '75%' },
                  { label: t('whyUs.eWasteRecycled'), value: '840 kg', pct: '45%' },
                  { label: t('whyUs.plasticProcessed'), value: '1,200 kg', pct: '60%' },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-emerald-200/50">{item.label}</span>
                      <span className="text-white font-semibold">{item.value}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-emerald-600 px-6 py-16 sm:px-12 sm:py-20 text-center">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/40 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/30 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-base sm:text-lg text-emerald-100 mb-10 max-w-xl mx-auto leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/schedule" className="inline-flex items-center justify-center px-8 py-3 bg-white text-emerald-700 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all hover:-translate-y-0.5 shadow-lg">
                  {t('cta.schedule')}
                </Link>
                <Link to="/scrapboy/login" className="inline-flex items-center justify-center px-8 py-3 bg-emerald-700 border border-emerald-500 text-white rounded-xl font-semibold text-sm hover:bg-emerald-800 transition-all hover:-translate-y-0.5">
                  {t('cta.partner')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
