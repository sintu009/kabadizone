import { useState, useEffect } from 'react';
import { Plus, X, Check, Search, Phone, Mail, Eye, UserPlus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const emptyBoy = { name: '', email: '', phone: '', password: '', blood_group: '', gender: 'MALE' };

const genderColor = {
  MALE: 'bg-blue-50 text-blue-700',
  FEMALE: 'bg-pink-50 text-pink-700',
  OTHER: 'bg-purple-50 text-purple-700',
};

const AdminScrapBoysPage = () => {
  const [collectors, setCollectors] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyBoy);
  const [editingId, setEditingId] = useState(null);
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchCollectors = async (p = page) => {
    try {
      setLoading(true);
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS, { params: { page: p, limit } });
      setCollectors(res.data || []);
      setTotal(res.total || 0);
    } catch {
      toast.error('Failed to load scrap collectors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollectors(page); }, [page]);

  const totalPages = Math.ceil(total / limit);

  const filtered = collectors.filter(
    (b) =>
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone_number?.includes(search)
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyBoy);
    setShowForm(true);
  };

  const openEdit = (boy) => {
    setEditingId(boy.id);
    setForm({
      name: boy.name || '',
      email: boy.email || '',
      phone: boy.phone_number || '',
      blood_group: boy.blood_group || '',
      gender: boy.gender || 'MALE',
      password: '',
    });
    setShowForm(true);
  };

  const validateAndConfirm = () => {
    if (!form.name.trim()) return toast.error('Full name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.phone.trim()) return toast.error('Phone number is required');
    if (!/^\d{10}$/.test(form.phone.trim())) return toast.error('Enter a valid 10-digit phone number');
    if (!editingId) {
      if (!form.password.trim()) return toast.error('Password is required');
      if (form.password.trim().length < 6) return toast.error('Password must be at least 6 characters');
    }
    if (!form.blood_group.trim()) return toast.error('Blood group is required');
    setConfirmAdd(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        const { password, ...payload } = form;
        await apiClient.put(`${API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS}/${editingId}`, payload);
        toast.success(`${form.name} updated successfully`);
      } else {
        await apiClient.post(API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS, form);
        toast.success(`${form.name} added successfully`);
      }
      setShowForm(false);
      setConfirmAdd(false);
      setEditingId(null);
      setForm(emptyBoy);
      fetchCollectors(page);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} scrap boy`);
      setConfirmAdd(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`${API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS}/${confirmDelete.id}`);
      toast.success(`${confirmDelete.name} deleted successfully`);
      setConfirmDelete(null);
      fetchCollectors(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete scrap boy');
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Scrap Boys</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scrap collection boys.</p>
        </div>
        <button
          onClick={openAdd}
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
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Cards grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((boy) => (
            <div key={boy.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                    {boy.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{boy.name}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${genderColor[boy.gender] || 'bg-gray-100 text-gray-500'}`}>
                      {boy.gender || '—'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(boy)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => setConfirmDelete(boy)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link to={`/admin/scrapboys/${boy.id}`} className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {boy.phone_number}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5" /> {boy.email || '—'}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm">
                <span className="text-gray-500">Blood: <span className="font-semibold text-gray-900">{boy.blood_group || '—'}</span></span>
                <span className="text-gray-500">Added: <span className="font-semibold text-gray-900">{boy.added_on ? new Date(boy.added_on).toLocaleDateString() : '—'}</span></span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              No scrap boys found.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
          <span className="text-sm text-gray-500">Page {page} of {totalPages} ({total} total)</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{editingId ? 'Edit Scrap Boy' : 'Add Scrap Boy'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1 text-gray-400 hover:text-gray-600">
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
                  placeholder="e.g. Ramesh"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. ramesh@gmail.com"
                />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Min 6 characters"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. 9876543212"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <select
                  value={form.blood_group}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={validateAndConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Check className="h-4 w-4" /> {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Confirmation */}
      <ConfirmModal
        open={confirmAdd}
        title={editingId ? 'Update Scrap Boy' : 'Add Scrap Boy'}
        message={editingId ? `Update "${form.name}"?` : `Add "${form.name}" as a new scrap boy?`}
        confirmText={editingId ? 'Update' : 'Add'}
        variant="info"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmAdd(false)}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Scrap Boy"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminScrapBoysPage;
