import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Loader2, Pencil, Check, X } from 'lucide-react';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';
import toast from 'react-hot-toast';

const AdminSettingsPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchSlots = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.SLOT_TIMES.BASE);
      setSlots(Array.isArray(res) ? res : res.data || []);
    } catch {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  // Convert HH:MM:SS to HH:MM for input[type=time]
  const toInputTime = (t) => t ? t.substring(0, 5) : '';
  // Convert HH:MM to HH:MM:SS for API
  const toApiTime = (t) => t ? t + ':00' : '';

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) return toast.error('Both times are required');
    setSubmitting(true);
    try {
      await apiClient.post(API_ENDPOINTS.SLOT_TIMES.BASE, {
        start_time: toApiTime(startTime),
        end_time: toApiTime(endTime),
      });
      toast.success('Slot created');
      setStartTime('');
      setEndTime('');
      fetchSlots();
    } catch {
      toast.error('Failed to create slot');
    } finally {
      setSubmitting(false);
    }
  };

  // EDIT - start
  const startEdit = (slot) => {
    setEditId(slot.id);
    setEditStart(toInputTime(slot.start_time));
    setEditEnd(toInputTime(slot.end_time));
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditStart('');
    setEditEnd('');
  };

  // UPDATE (PUT)
  const handleUpdate = async () => {
    if (!editStart || !editEnd) return toast.error('Both times are required');
    setEditSubmitting(true);
    try {
      await apiClient.put(`${API_ENDPOINTS.SLOT_TIMES.BASE}/${editId}`, {
        start_time: toApiTime(editStart),
        end_time: toApiTime(editEnd),
      });
      toast.success('Slot updated');
      cancelEdit();
      fetchSlots();
    } catch {
      toast.error('Failed to update slot');
    } finally {
      setEditSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await apiClient.delete(`${API_ENDPOINTS.SLOT_TIMES.BASE}/${id}`);
      toast.success('Slot deleted');
      if (editId === id) cancelEdit();
      fetchSlots();
    } catch {
      toast.error('Failed to delete slot');
    }
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-500 mt-1">Manage slot times and preferences.</p>

      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-emerald-600" /> Slot Times
        </h2>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Slot
            </button>
          </div>
        </form>

        {/* Slot List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : slots.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No slots created yet.</p>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                {editId === slot.id ? (
                  /* Edit Mode */
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 mr-2">
                    <input
                      type="time"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                    <span className="text-gray-400 text-xs">to</span>
                    <input
                      type="time"
                      value={editEnd}
                      onChange={(e) => setEditEnd(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  /* View Mode */
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  {editId === slot.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        disabled={editSubmitting}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        {editSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(slot)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
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

export default AdminSettingsPage;
