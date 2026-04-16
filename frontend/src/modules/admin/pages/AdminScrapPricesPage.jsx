import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const extract = (r) => Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : [];



const AdminScrapPricesPage = () => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('All');

  const [showModal, setShowModal] = useState(false);
  const [itemForm, setItemForm] = useState({ name: '', catId: '', price: '', unit: '' });
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemSaving, setItemSaving] = useState(false);

  const [editPriceId, setEditPriceId] = useState(null);
  const [editPriceVal, setEditPriceVal] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catImage, setCatImage] = useState(null);
  const [catImagePreview, setCatImagePreview] = useState(null);
  const [catSaving, setCatSaving] = useState(false);
  const [deleteCatTarget, setDeleteCatTarget] = useState(null);

  // ── Fetch categories from API ──
  const fetchData = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const [catRes, unitRes, priceRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.GARBAGE.TYPES),
        apiClient.get(API_ENDPOINTS.GARBAGE.UNITS),
        apiClient.get(API_ENDPOINTS.GARBAGE.PRICES),
      ]);
      setCategories(extract(catRes));
      setUnits(extract(unitRes).sort((a, b) => a.sort_order - b.sort_order));
      setItems(extract(priceRes));
    } catch (err) {
      console.error('fetchData error:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(true); }, [fetchData]);

  // ── Helpers ──
  const unitLabel = (val) => {
    const u = units.find((u) => u.sort_order === Number(val) || u.sort_name === val);
    return u ? u.sort_name : val;
  };
  const catName4Id = (id) => categories.find((c) => c.id === id)?.name || '';
  const filtered = activeCat === 'All' ? items : items.filter((i) => i.garbage_type_id === activeCat);

  // ── Category actions (real API) ──
  const openAddCat = () => { setEditingCatId(null); setCatName(''); setCatImage(null); setCatImagePreview(null); setShowCatModal(true); };
  const openEditCat = (cat) => { setEditingCatId(cat.id); setCatName(cat.name); setCatImage(null); setCatImagePreview(cat.image_url); setShowCatModal(true); };

  const saveCat = async () => {
    if (!catName.trim()) return toast.error('Enter category name');
    const fd = new FormData();
    fd.append('name', catName.trim());
    if (catImage) fd.append('image', catImage);
    try {
      setCatSaving(true);
      if (editingCatId) {
        await apiClient.put(`${API_ENDPOINTS.GARBAGE.TYPES}/${editingCatId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category updated');
      } else {
        await apiClient.post(API_ENDPOINTS.GARBAGE.TYPES, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Category added');
      }
      setShowCatModal(false);
      fetchData();
    } catch (err) {
      console.error('saveCat error:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setCatSaving(false);
    }
  };

  const confirmDeleteCat = async () => {
    if (!deleteCatTarget) return;
    try {
      await apiClient.delete(`${API_ENDPOINTS.GARBAGE.TYPES}/${deleteCatTarget.id}`);
      if (activeCat === deleteCatTarget.id) setActiveCat('All');
      toast.success('Category deleted');
      setDeleteCatTarget(null);
      fetchData();
    } catch (err) {
      console.error('deleteCat error:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  // ── Item actions (real API) ──
  const openAddItem = () => { setEditingItemId(null); setItemForm({ name: '', catId: '', price: '', unit: '' }); setShowModal(true); };
  const openEditItem = (item) => {
    setEditingItemId(item.id);
    setItemForm({
      name: item.garbage_name || item.name || '',
      catId: String(item.garbage_type_id || ''),
      price: String(item.price_per_unit || ''),
      unit: String(item.unit ?? ''),
    });
    setShowModal(true);
  };

  const saveItem = async () => {
    if (!itemForm.name.trim()) { toast.error('Enter type name'); return; }
    if (!itemForm.catId) { toast.error('Select a category'); return; }
    if (!itemForm.price || Number(itemForm.price) <= 0) { toast.error('Enter valid price'); return; }
    if (!itemForm.unit) { toast.error('Select a unit'); return; }

    const body = {
      name: itemForm.name.trim(),
      garbage_type_id: Number(itemForm.catId),
      unit: Number(itemForm.unit),
      price_per_unit: Number(itemForm.price),
    };
    try {
      setItemSaving(true);
      if (editingItemId) {
        await apiClient.put(`${API_ENDPOINTS.GARBAGE.PRICES}/${editingItemId}`, body);
        toast.success('Updated');
      } else {
        await apiClient.post(API_ENDPOINTS.GARBAGE.PRICES, body);
        toast.success('Added');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('saveItem error:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Failed to save');
    } finally {
      setItemSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient.delete(`${API_ENDPOINTS.GARBAGE.PRICES}/${deleteTarget.id}`);
      toast.success('Deleted');
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      console.error('deleteItem error:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Failed to delete');
    }
  };

  const savePrice = async (id) => {
    const v = Number(editPriceVal);
    if (!v || v <= 0) return toast.error('Enter valid price');
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      await apiClient.put(`${API_ENDPOINTS.GARBAGE.PRICES}/${id}`, {
        name: item.garbage_name || item.name,
        garbage_type_id: item.garbage_type_id,
        unit: Number(item.unit),
        price_per_unit: v,
      });
      setEditPriceId(null);
      toast.success('Price updated');
      fetchData();
    } catch (err) {
      console.error('savePrice error:', err?.response || err);
      toast.error(err?.response?.data?.message || 'Failed to update price');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Scrap Prices</h1>
        <button onClick={openAddItem} className="px-3 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4 inline -mt-0.5" /> Add Type
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setActiveCat('All')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCat === 'All' ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'}`}>All</button>
        {categories.map((cat) => (
          <div key={cat.id} className="relative group flex items-center">
            <button onClick={() => setActiveCat(cat.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${activeCat === cat.id ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
              {cat.image_url && <img src={cat.image_url} alt="" className="h-4 w-4 rounded-full object-cover" />}
              {cat.name}
            </button>
            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
              <button onClick={() => openEditCat(cat)} className="p-0.5 text-gray-300 hover:text-emerald-600"><Pencil className="h-3 w-3" /></button>
              <button onClick={() => setDeleteCatTarget(cat)} className="p-0.5 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
        <button onClick={openAddCat} className="px-2 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">No items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.garbage_name}</p>
                  <p className="text-xs text-gray-400">{item.garbage_type_name || catName4Id(item.garbage_type_id)} · per {item.unit_name || unitLabel(item.unit)}</p>
                </div>
                <div className="flex gap-0.5">
                  <button onClick={() => openEditItem(item)} className="p-1 text-gray-300 hover:text-emerald-600"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => setDeleteTarget(item)} className="p-1 text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              {editPriceId === item.id ? (
                <div className="flex items-center gap-1 mt-3">
                  <span className="text-lg font-bold text-gray-400">₹</span>
                  <input type="number" value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} className="w-20 text-lg font-bold border-b-2 border-emerald-400 outline-none bg-transparent" autoFocus onKeyDown={(e) => { if (e.key === 'Enter') savePrice(item.id); if (e.key === 'Escape') setEditPriceId(null); }} />
                  <button onClick={() => savePrice(item.id)} className="p-1 text-emerald-600"><Check className="h-4 w-4" /></button>
                  <button onClick={() => setEditPriceId(null)} className="p-1 text-gray-400"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <p onClick={() => { setEditPriceId(item.id); setEditPriceVal(item.price_per_unit); }} className="text-2xl font-bold text-gray-900 mt-3 cursor-pointer hover:text-emerald-600 transition-colors" title="Click to edit price">
                  ₹{item.price_per_unit}<span className="text-xs font-normal text-gray-400">/{item.unit_name || unitLabel(item.unit)}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Type Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">{editingItemId ? 'Edit Type' : 'Add Type'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <select value={itemForm.catId} onChange={(e) => setItemForm({ ...itemForm, catId: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="text" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400" placeholder="Type name (e.g. Newspaper)" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400" placeholder="Price ₹" />
              <select value={itemForm.unit} onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400">
                <option value="">Select unit</option>
                {units.map((u) => <option key={u.sort_order} value={u.sort_order}>{u.display_name} ({u.sort_name})</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={saveItem} disabled={itemSaving} className="px-3 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {itemSaving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : editingItemId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">{editingCatId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowCatModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400" placeholder="Category name (e.g. Plastic)" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Image (optional)</label>
              <div className="flex items-center gap-3">
                {catImagePreview ? (
                  <img src={catImagePreview} alt="" className="h-14 w-14 rounded-lg object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center"><ImagePlus className="h-5 w-5 text-gray-300" /></div>
                )}
                <label className="px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-50">
                  Choose File
                  <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCatImage(f); setCatImagePreview(URL.createObjectURL(f)); } }} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCatModal(false)} className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={saveCat} disabled={catSaving} className="px-3 py-2 text-sm text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {catSaving ? <Loader2 className="h-4 w-4 animate-spin inline" /> : editingCatId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="Delete Type" message={`Delete "${deleteTarget?.garbage_name || deleteTarget?.name}"?`} confirmText="Delete" variant="danger" onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} />
      <ConfirmModal open={!!deleteCatTarget} title="Delete Category" message={`Delete "${deleteCatTarget?.name}"?`} confirmText="Delete" variant="danger" onConfirm={confirmDeleteCat} onCancel={() => setDeleteCatTarget(null)} />
    </div>
  );
};

export default AdminScrapPricesPage;
