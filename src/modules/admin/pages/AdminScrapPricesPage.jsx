import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const INITIAL_PRICES = [
  { id: 1, name: 'Newspaper', category: 'Paper', price: 14, unit: 'kg' },
  { id: 2, name: 'Cardboard', category: 'Paper', price: 8, unit: 'kg' },
  { id: 3, name: 'Iron', category: 'Metal', price: 28, unit: 'kg' },
  { id: 4, name: 'Copper', category: 'Metal', price: 425, unit: 'kg' },
  { id: 5, name: 'Aluminium', category: 'Metal', price: 105, unit: 'kg' },
  { id: 6, name: 'Plastic Bottles', category: 'Plastic', price: 10, unit: 'kg' },
  { id: 7, name: 'E-Waste', category: 'Electronics', price: 200, unit: 'kg' },
  { id: 8, name: 'Glass Bottles', category: 'Glass', price: 3, unit: 'kg' },
];

const CATEGORIES = ['Paper', 'Metal', 'Plastic', 'Electronics', 'Glass', 'Other'];

const emptyItem = { name: '', category: 'Paper', price: '', unit: 'kg' };

const AdminScrapPricesPage = () => {
  const [prices, setPrices] = useState(INITIAL_PRICES);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = prices.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyItem);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ name: item.name, category: item.category, price: item.price, unit: item.unit });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return toast.error('Item name is required');
    if (!form.price || Number(form.price) <= 0) return toast.error('Enter a valid price');

    if (editingId) {
      setPrices((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form, price: Number(form.price) } : p))
      );
      toast.success(`${form.name} updated successfully`);
    } else {
      setPrices((prev) => [
        ...prev,
        { id: Date.now(), ...form, price: Number(form.price) },
      ]);
      toast.success(`${form.name} added successfully`);
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPrices((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`${deleteTarget.name} deleted`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Scrap Price List</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scrap item prices shown to customers.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-lg px-3 py-2.5 border border-gray-200 max-w-sm focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price (₹)</th>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-gray-900">₹{item.price}</td>
                  <td className="px-6 py-3.5 text-gray-500">per {item.unit}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filtered.map((item) => (
            <div key={item.id} className="px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.category} · per {item.unit}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">₹{item.price}</span>
                <button onClick={() => openEdit(item)} className="p-1 text-gray-400 hover:text-emerald-600">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleteTarget(item)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. Newspaper"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                  </select>
                </div>
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
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Check className="h-4 w-4" /> {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Scrap Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default AdminScrapPricesPage;
