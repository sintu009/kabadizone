import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Users, Truck, TrendingUp, TrendingDown, IndianRupee,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, Package,
  Calendar, MapPin, CalendarClock, Plus, X, Phone,
} from 'lucide-react';

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

const initialStats = [
  { label: 'Total Users', value: '1,245', change: '+12.5%', up: true, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Active Scrapboys', value: '48', change: '+4.1%', up: true, icon: Truck, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Pending Pickups', value: '5', change: '+2', up: false, icon: CalendarClock, color: 'bg-amber-50 text-amber-600', to: '/admin/bookings' },
  { label: 'Revenue', value: '₹4,52,300', change: '+18.2%', up: true, icon: IndianRupee, color: 'bg-violet-50 text-violet-600' },
];

const initialPendingPickups = [
  { id: 'PK-1001', customer: 'Rahul Sharma', phone: '98XXXXXX10', address: 'Sector 12, Noida', timeSlot: '10 AM - 12 PM', source: 'online' },
  { id: 'PK-1002', customer: 'Priya Patel', phone: '98XXXXXX11', address: 'MG Road, Gurgaon', timeSlot: '2 PM - 4 PM', source: 'online' },
  { id: 'PK-1003', customer: 'Amit Kumar', phone: '98XXXXXX12', address: 'Laxmi Nagar, Delhi', timeSlot: '10 AM - 12 PM', source: 'online' },
];

const initialRecentOrders = [
  { id: '#ORD-2041', customer: 'Rahul Sharma', scrapBoy: 'Ravi Kumar', type: 'Paper & Cardboard', weight: '12.5 kg', amount: '₹312', status: 'Completed', timeSlot: '10 AM - 12 PM', source: 'online' },
  { id: '#ORD-2040', customer: 'Priya Patel', scrapBoy: 'Suresh Yadav', type: 'Metal Scrap', weight: '8.2 kg', amount: '₹1,230', status: 'Assigned', timeSlot: '2 PM - 4 PM', source: 'online' },
  { id: '#ORD-2039', customer: 'Amit Kumar', scrapBoy: null, type: 'Plastic', weight: '5.0 kg', amount: '₹75', status: 'Pending', timeSlot: '10 AM - 12 PM', source: 'online' },
  { id: '#ORD-2038', customer: 'Sneha Reddy', scrapBoy: null, type: 'E-Waste', weight: '3.1 kg', amount: '₹620', status: 'Pending', timeSlot: '4 PM - 6 PM', source: 'online' },
  { id: '#ORD-2037', customer: 'Vikram Singh', scrapBoy: 'Deepak Verma', type: 'Iron', weight: '22.0 kg', amount: '₹880', status: 'Completed', timeSlot: '10 AM - 12 PM', source: 'online' },
];

const statusStyle = {
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
  const [recentOrders, setRecentOrders] = useState(initialRecentOrders);
  const [pendingPickups, setPendingPickups] = useState(initialPendingPickups);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [orderCounter, setOrderCounter] = useState(2042);
  const [pickupCounter, setPickupCounter] = useState(1004);

  const pendingCount = recentOrders.filter((o) => o.status === 'Pending').length;

  const handleAddPickup = (form) => {
    const newPickupId = `PK-${pickupCounter}`;
    const newOrderId = `#ORD-${orderCounter}`;

    setPendingPickups((prev) => [
      { id: newPickupId, customer: form.name, phone: form.phone, address: form.address, timeSlot: form.timeSlot, source: 'manual' },
      ...prev,
    ]);

    setRecentOrders((prev) => [
      { id: newOrderId, customer: form.name, scrapBoy: null, type: form.scrapTypes.join(', '), weight: '—', amount: '—', status: 'Pending', timeSlot: form.timeSlot, source: 'manual' },
      ...prev,
    ]);

    setPickupCounter((c) => c + 1);
    setOrderCounter((c) => c + 1);
  };

  const stats = [
    { label: 'Total Users', value: '1,245', change: '+12.5%', up: true, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Active Scrapboys', value: '48', change: '+4.1%', up: true, icon: Truck, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Pickups', value: String(pendingCount), change: `+${pendingCount}`, up: false, icon: CalendarClock, color: 'bg-amber-50 text-amber-600', to: '/admin/bookings' },
    { label: 'Revenue', value: '₹4,52,300', change: '+18.2%', up: true, icon: IndianRupee, color: 'bg-violet-50 text-violet-600' },
  ];

  const todaySummary = {
    newBookings: 14 + (recentOrders.length - initialRecentOrders.length),
    completedPickups: recentOrders.filter((o) => o.status === 'Completed').length,
    pendingPickups: pendingCount,
    assignedPickups: recentOrders.filter((o) => o.status === 'Assigned').length,
    todayRevenue: '₹12,450',
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

      {/* Today's Summary + Top Scrap Boys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Bookings', value: todaySummary.newBookings, icon: Package, color: 'text-blue-600 bg-blue-50' },
              { label: 'Completed', value: todaySummary.completedPickups, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Pending', value: todaySummary.pendingPickups, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
              { label: 'Assigned', value: todaySummary.assignedPickups, icon: Truck, color: 'text-blue-600 bg-blue-50' },
              { label: "Today's Revenue", value: todaySummary.todayRevenue, icon: IndianRupee, color: 'text-violet-600 bg-violet-50' },
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
          {pendingPickups.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">All pickups assigned 🎉</p>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {pendingPickups.map((p) => (
                <Link
                  key={p.id}
                  to="/admin/bookings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/50 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.customer}</p>
                      {p.source === 'manual' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                          <Phone className="h-2.5 w-2.5" /> Manual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.address}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.timeSlot}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-amber-600 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders — with time slot & assign action */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <span className="text-sm text-gray-400">Latest 5</span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Time Slot</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Scrap Boy</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className={`hover:bg-gray-50/50 transition-colors ${order.status === 'Pending' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-6 py-3.5 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {order.id}
                      {order.source === 'manual' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                          <Phone className="h-2.5 w-2.5" /> Manual
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />{order.timeSlot}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{order.type}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-3.5">
                    {order.scrapBoy
                      ? <span className="text-gray-700">{order.scrapBoy}</span>
                      : <span className="text-amber-600 text-xs font-medium">Unassigned</span>
                    }
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {order.status === 'Pending' && (
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
          {recentOrders.map((order) => (
            <div key={order.id} className={`px-4 py-4 space-y-2 ${order.status === 'Pending' ? 'bg-amber-50/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{order.id}</span>
                  {order.source === 'manual' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
                      <Phone className="h-2.5 w-2.5" /> Manual
                    </span>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}>{order.status}</span>
              </div>
              <p className="text-sm text-gray-700">{order.customer}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />{order.timeSlot}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {order.scrapBoy || <span className="text-amber-600 font-medium">Unassigned</span>}
                </span>
                <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
              </div>
              {order.status === 'Pending' && (
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
      </div>
      {/* Add Pickup Modal */}
      <AddPickupModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddPickup} />
    </div>
  );
};

export default AdminDashboardPage;
