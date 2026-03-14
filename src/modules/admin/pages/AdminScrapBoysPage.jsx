import { useState } from 'react';
import { Plus, X, Check, Search, Phone, MapPin, Eye, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const INITIAL_BOYS = [
  { id: 1, name: 'Ravi Kumar', phone: '9876543210', area: 'Banjara Hills', status: 'Active', totalPickups: 142, balance: 3200 },
  { id: 2, name: 'Suresh Yadav', phone: '9876543211', area: 'Jubilee Hills', status: 'Active', totalPickups: 98, balance: 1800 },
  { id: 3, name: 'Manoj Singh', phone: '9876543212', area: 'Madhapur', status: 'Inactive', totalPickups: 56, balance: 500 },
  { id: 4, name: 'Deepak Verma', phone: '9876543213', area: 'Gachibowli', status: 'Active', totalPickups: 210, balance: 5400 },
  { id: 5, name: 'Arun Patel', phone: '9876543214', area: 'Kukatpally', status: 'Active', totalPickups: 75, balance: 2100 },
];

const emptyBoy = { name: '', phone: '', area: '', status: 'Active' };

const statusColor = {
  Active: 'bg-emerald-50 text-emerald-700',
  Inactive: 'bg-gray-100 text-gray-500',
};

const AdminScrapBoysPage = () => {
  const [boys, setBoys] = useState(INITIAL_BOYS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyBoy);
  const [confirmAdd, setConfirmAdd] = useState(false);

  const filtered = boys.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.area.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search)
  );

  const validateAndConfirm = () => {
    if (!form.name.trim()) return toast.error('Full name is required');
    if (!form.phone.trim()) return toast.error('Phone number is required');
    if (!/^\d{10}$/.test(form.phone.trim())) return toast.error('Enter a valid 10-digit phone number');
    if (!form.area.trim()) return toast.error('Assigned area is required');
    setConfirmAdd(true);
  };

  const handleAdd = () => {
    setBoys((prev) => [
      ...prev,
      { id: Date.now(), ...form, totalPickups: 0, balance: 0 },
    ]);
    setShowForm(false);
    setConfirmAdd(false);
    toast.success(`${form.name} added successfully`);
    setForm(emptyBoy);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Scrap Boys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scrap collection boys.</p>
        </div>
        <button
          onClick={() => { setForm(emptyBoy); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Add Scrap Boy
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-lg px-3 py-2.5 border border-gray-200 max-w-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((boy) => (
          <div key={boy.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                  {boy.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{boy.name}</p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[boy.status]}`}>
                    {boy.status}
                  </span>
                </div>
              </div>
              <Link
                to={`/admin/scrapboys/${boy.id}`}
                className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-1.5 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" /> {boy.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" /> {boy.area}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm">
              <span className="text-gray-500">Pickups: <span className="font-semibold text-gray-900">{boy.totalPickups}</span></span>
              <span className="text-gray-500">Balance: <span className="font-semibold text-emerald-600">₹{boy.balance}</span></span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            No scrap boys found.
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Scrap Boy</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. Ravi Kumar"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Area</label>
                <input
                  type="text"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. Banjara Hills"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={validateAndConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Check className="h-4 w-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Confirmation */}
      <ConfirmModal
        open={confirmAdd}
        title="Add Scrap Boy"
        message={`Add "${form.name}" as a new scrap boy in ${form.area}?`}
        confirmText="Add"
        variant="info"
        onConfirm={handleAdd}
        onCancel={() => setConfirmAdd(false)}
      />
    </div>
  );
};

export default AdminScrapBoysPage;
