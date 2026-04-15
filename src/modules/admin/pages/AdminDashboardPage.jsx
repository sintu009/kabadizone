import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Users, Truck, TrendingUp, TrendingDown, IndianRupee,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Package,
  Calendar, MapPin, CalendarClock, Plus, X, Phone, Loader2,
} from 'lucide-react';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const SCRAP_TYPE_OPTIONS = [
  { label: 'Newspaper', icon: '📰' },
  { label: 'Cardboard', icon: '📦' },
  { label: 'Iron & Steel', icon: '🔩' },
  { label: 'Plastics', icon: '🥤' },
  { label: 'E-Waste', icon: '💻' },
  { label: 'Aluminum', icon: '🥫' },
];

const TIME_SLOTS = ['10 AM - 12 PM', '12 PM - 2 PM', '2 PM - 4 PM', '4 PM - 6 PM'];

const EMPTY_FORM = { name: '', phone: '', address: '', date: '', timeSlot: '', scrapTypes: [] };


const statusStyle = {
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  ASSIGNED: 'bg-blue-50 text-blue-700',
  UNASSIGNED: 'bg-amber-50 text-amber-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Assigned: 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
};

const AddPickupModal = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleScrap = (label) =>
    setForm((f) => ({
      ...f,
      scrapTypes: f.scrapTypes.includes(label)
        ? f.scrapTypes.filter((t) => t !== label)
        : [...f.scrapTypes, label],
    }));

  const canSubmit = form.name && form.phone && form.address && form.date && form.timeSlot && form.scrapTypes.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd(form);
    setForm(EMPTY_FORM);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add Pickup</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manual booking via call / WhatsApp</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Full name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="10-digit number" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="House no, Street, Landmark, City" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select value={form.timeSlot} onChange={(e) => update('timeSlot', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                <option value="">Select time</option>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Scrap Types</label>
            <div className="flex flex-wrap gap-2">
              {SCRAP_TYPE_OPTIONS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => toggleScrap(t.label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    form.scrapTypes.includes(t.label)
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Add Pickup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchPickups = () => {
    setLoading(true);
    apiClient.get(API_ENDPOINTS.PICKUP_REQUESTS.BASE)
      .then((res) => setPickups(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPickups(); }, []);

  const unassignedPickups = pickups.filter((p) => p.status === 'UNASSIGNED');
  const assignedPickups = pickups.filter((p) => p.status === 'ASSIGNED');
  const completedPickups = pickups.filter((p) => p.status === 'COMPLETED');
  const pendingCount = unassignedPickups.length;

  const handleAddPickup = () => { fetchPickups(); };

  const stats = [
    { label: 'Total Pickups', value: String(pickups.length), change: '', up: true, icon: Package, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Completed', value: String(completedPickups.length), change: '', up: true, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Needs Assignment', value: String(pendingCount), change: pendingCount > 0 ? `${pendingCount} pending` : '', up: false, icon: CalendarClock, color: 'bg-amber-50 text-amber-600', to: '/admin/bookings' },
    { label: 'Assigned', value: String(assignedPickups.length), change: '', up: true, icon: Truck, color: 'bg-blue-50 text-blue-600' },
  ];

  const todaySummary = {
    newBookings: pickups.length,
    completedPickups: completedPickups.length,
    pendingPickups: pendingCount,
    assignedPickups: assignedPickups.length,
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Pickup
          </button>
          {pendingCount > 0 && (
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">{pendingCount} pickups need assignment</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-amber-600" />
            </Link>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {stats.map(({ label, value, change, up, icon: Icon, color, to }) => {
          const Card = (
            <div className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${to ? 'border-amber-200 cursor-pointer' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-lg ${color}`}><Icon className="h-5 w-5" /></div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          );
          return to ? <Link key={label} to={to}>{Card}</Link> : <div key={label}>{Card}</div>;
        })}
      </div>

      {/* Summary + Needs Assignment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Bookings', value: todaySummary.newBookings, icon: Package, color: 'text-blue-600 bg-blue-50' },
              { label: 'Completed', value: todaySummary.completedPickups, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Unassigned', value: todaySummary.pendingPickups, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
              { label: 'Assigned', value: todaySummary.assignedPickups, icon: Truck, color: 'text-blue-600 bg-blue-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4" /></div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pickups Need Assignment */}
        <div className="bg-white rounded-xl border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h2 className="text-base font-semibold text-gray-900">Needs Assignment</h2>
            </div>
            <Link to="/admin/bookings" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">View all</Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            </div>
          ) : unassignedPickups.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">All pickups assigned 🎉</p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {unassignedPickups.map((p) => (
                <Link
                  key={p.id}
                  to="/admin/bookings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.user_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" />{p.address}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="h-3 w-3" />{p.slot_time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{p.garbage_type} · {p.estimated_weight} {p.unit_name}</span>
                      <span className="font-medium text-gray-700">₹{p.total_amount}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-amber-600 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Pickups */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Pickups</h2>
          <span className="text-sm text-gray-400">Latest {Math.min(pickups.length, 10)}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        ) : pickups.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No pickups yet</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Slot</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Weight</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pickups.slice(0, 10).map((p) => (
                    <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${p.status === 'UNASSIGNED' ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-6 py-3.5 font-medium text-gray-900">#{p.id}</td>
                      <td className="px-6 py-3.5 text-gray-700">{p.user_name}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />{p.slot_time}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{p.garbage_type}</td>
                      <td className="px-6 py-3.5 text-gray-500">{p.estimated_weight} {p.unit_name}</td>
                      <td className="px-6 py-3.5 font-medium text-gray-900">₹{p.total_amount}</td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[p.status] || 'bg-gray-50 text-gray-700'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        {p.status === 'UNASSIGNED' && (
                          <Link
                            to="/admin/bookings"
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                          >
                            Assign
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {pickups.slice(0, 10).map((p) => (
                <div key={p.id} className={`px-4 py-4 space-y-2 ${p.status === 'UNASSIGNED' ? 'bg-amber-50/30' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">#{p.id}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[p.status] || 'bg-gray-50 text-gray-700'}`}>{p.status}</span>
                  </div>
                  <p className="text-sm text-gray-700">{p.user_name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />{p.slot_time}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{p.garbage_type} · {p.estimated_weight} {p.unit_name}</span>
                    <span className="text-sm font-semibold text-gray-900">₹{p.total_amount}</span>
                  </div>
                  {p.status === 'UNASSIGNED' && (
                    <Link
                      to="/admin/bookings"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Truck className="h-3 w-3" /> Assign Scrap Boy
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Add Pickup Modal */}
      <AddPickupModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddPickup} />
    </div>
  );
};

export default AdminDashboardPage;
