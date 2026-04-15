import { useState } from 'react';
import { Search, Loader2, Package, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
  ASSIGNED: { label: 'Assigned', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Package },
  IN_PROGRESS: { label: 'In Progress', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Truck },
  COMPLETED: { label: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
};

const TrackOrderPage = () => {
  const [phone, setPhone] = useState('');
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post(API_ENDPOINTS.PICKUP_REQUESTS.GUEST_STATUS, {
        phone: phone.trim(),
        page_number: 1,
        page_size: 50,
      });
      setPickups(res.data || []);
      setSearched(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
            <Search className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Track Your Pickup</h1>
          <p className="text-gray-500 text-sm mt-2">Enter your phone number to check the status of your pickup requests</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              placeholder="Enter 10-digit phone number"
              className={`flex-1 px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:bg-emerald-600/40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </form>

        {/* Results */}
        {searched && pickups.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">
            <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No pickup requests found for this phone number.</p>
          </div>
        )}

        {pickups.length > 0 && (
          <div className="space-y-3">
            {pickups.map((p) => (
              <div key={p.pickup_request_id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:border-emerald-200 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Order #{p.pickup_request_id}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {p.created_on ? new Date(p.created_on).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mt-3 pt-3 border-t border-gray-50">
                  {p.address && (
                    <div className="col-span-2">
                      <span className="text-gray-400 text-xs">Address</span>
                      <p className="text-gray-700 text-xs mt-0.5 line-clamp-1">{p.address}</p>
                    </div>
                  )}
                  {p.estimated_weight != null && (
                    <div>
                      <span className="text-gray-400 text-xs">Est. Weight</span>
                      <p className="text-gray-700 font-medium">{p.estimated_weight} kg</p>
                    </div>
                  )}
                  {p.actual_weight != null && (
                    <div>
                      <span className="text-gray-400 text-xs">Actual Weight</span>
                      <p className="text-gray-700 font-medium">{p.actual_weight} kg</p>
                    </div>
                  )}
                  {p.total_amount != null && (
                    <div>
                      <span className="text-gray-400 text-xs">Est. Amount</span>
                      <p className="text-gray-700 font-medium">₹{p.total_amount}</p>
                    </div>
                  )}
                  {p.final_amount != null && (
                    <div>
                      <span className="text-gray-400 text-xs">Final Amount</span>
                      <p className="text-emerald-600 font-semibold">₹{p.final_amount}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
