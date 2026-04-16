import { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, User, Truck, Search,
  CheckCircle2, AlertCircle, Filter, RefreshCw,
  LayoutGrid, Table2, ChevronLeft, ChevronRight, Loader2, IndianRupee, Package,
} from 'lucide-react';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const STATUSES = ['All', 'UNASSIGNED', 'ASSIGNED', 'COMPLETED', 'CANCELLED'];
const PER_PAGE = 10;

const statusStyle = {
  UNASSIGNED: 'bg-amber-50 text-amber-700',
  ASSIGNED: 'bg-blue-50 text-blue-700',
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

const statusLabel = {
  UNASSIGNED: 'Unassigned',
  ASSIGNED: 'Assigned',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const AdminPickupBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [scrapBoys, setScrapBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('card');
  const [page, setPage] = useState(1);
  const [assigningId, setAssigningId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      apiClient.get(API_ENDPOINTS.PICKUP_REQUESTS.BASE),
      apiClient.get(API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS_DROPDOWN),
    ])
      .then(([pickupRes, scrapRes]) => {
        setBookings(pickupRes.data || []);
        setScrapBoys(scrapRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (b.user_name || '').toLowerCase().includes(q) ||
      String(b.id).includes(q) ||
      (b.address || '').toLowerCase().includes(q) ||
      (b.garbage_type || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const requestAssign = (bookingId, scrapBoyId, scrapBoyName) => {
    setConfirmData({ bookingId, scrapBoyId, scrapBoyName });
  };

  const confirmAssign = async () => {
    if (!confirmData) return;
    setAssigning(true);
    try {
      await apiClient.post(API_ENDPOINTS.PICKUP_ASSIGNMENTS.BASE, {
        pickup_request_id: confirmData.bookingId,
        scrap_collector_id: confirmData.scrapBoyId,
      });
      fetchData();
    } catch {}
    setAssigning(false);
    setConfirmData(null);
    setAssigningId(null);
  };

  const handleFilterChange = (s) => { setStatusFilter(s); setPage(1); };
  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  const unassignedCount = bookings.filter((b) => b.status === 'UNASSIGNED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pickup Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pickup requests and assign scrap boys</p>
        </div>
        {unassignedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">{unassignedCount} needs assignment</span>
          </div>
        )}
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, ID, address, type..."
            value={search}
            onChange={handleSearchChange}
            className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <Filter className="h-4 w-4 text-gray-400" />
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {s === 'All' ? 'All' : statusLabel[s]}
              {s === 'UNASSIGNED' && unassignedCount > 0 ? ` (${unassignedCount})` : ''}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5">
          <button
            onClick={() => setView('card')}
            className={`p-1.5 rounded-md transition-colors ${view === 'card' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            title="Card View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            title="Table View"
          >
            <Table2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
          No bookings found.
        </div>
      )}

      {/* Table View */}
      {filtered.length > 0 && view === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((b) => (
                  <tr key={b.id} className={`hover:bg-gray-50/50 transition-colors ${b.status === 'UNASSIGNED' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">#{b.id}</td>
                    <td className="px-4 py-3 text-gray-700">{b.user_name}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{b.address}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.request_date ? new Date(b.request_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{b.slot_time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{b.garbage_type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.estimated_weight} {b.unit_name}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">₹{b.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle[b.status] || 'bg-gray-50 text-gray-700'}`}>
                        {statusLabel[b.status] || b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.status === 'UNASSIGNED' && (
                        <button
                          onClick={() => setAssigningId(assigningId === b.id ? null : b.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inline scrap boy picker for table view */}
          {assigningId && paginated.find((b) => b.id === assigningId) && (
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-gray-500">Assign #{assigningId} to:</span>
                {scrapBoys.map((sb) => (
                  <button
                    key={sb.id}
                    onClick={() => requestAssign(assigningId, sb.id, sb.name)}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                  >
                    {sb.name} <span className="text-gray-400">· {sb.phone_number}</span>
                  </button>
                ))}
                <button onClick={() => setAssigningId(null)} className="text-xs text-gray-400 hover:text-gray-600 ml-1">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Card View */}
      {filtered.length > 0 && view === 'card' && (
        <div className="space-y-3">
          {paginated.map((booking) => (
            <div key={booking.id} className={`bg-white rounded-xl border p-4 sm:p-5 hover:shadow-sm transition-shadow ${booking.status === 'UNASSIGNED' ? 'border-amber-200' : 'border-gray-200'}`}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">#{booking.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[booking.status] || 'bg-gray-50 text-gray-700'}`}>
                      {statusLabel[booking.status] || booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.user_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{booking.request_date ? new Date(booking.request_date).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{booking.slot_time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{booking.garbage_type}</span>
                    <span className="text-xs text-gray-400">· {booking.estimated_weight} {booking.unit_name}</span>
                    <span className="text-xs font-medium text-gray-700">· ₹{booking.total_amount}</span>
                  </div>
                </div>

                {/* Assignment Section */}
                <div className="lg:w-64 shrink-0">
                  {booking.status === 'UNASSIGNED' ? (
                    assigningId === booking.id ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Select Scrap Boy</p>
                        {scrapBoys.map((sb) => (
                          <button
                            key={sb.id}
                            onClick={() => requestAssign(booking.id, sb.id, sb.name)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-left"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{sb.name}</p>
                              <p className="text-xs text-gray-500">{sb.phone_number}</p>
                            </div>
                            <Truck className="h-4 w-4 text-gray-400" />
                          </button>
                        ))}
                        <button onClick={() => setAssigningId(null)} className="w-full text-xs text-gray-500 hover:text-gray-700 py-1">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAssigningId(booking.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <Truck className="h-4 w-4" /> Assign Scrap Boy
                      </button>
                    )
                  ) : booking.status === 'ASSIGNED' ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs text-blue-600">Assigned</p>
                        <p className="text-sm font-medium text-blue-800">Scrap Boy Assigned</p>
                      </div>
                    </div>
                  ) : booking.status === 'COMPLETED' ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-sm font-medium text-emerald-800">Completed</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                  page === n ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Confirm Assignment Modal */}
      <ConfirmModal
        open={!!confirmData}
        title="Assign Pickup"
        message={`Assign ${confirmData?.scrapBoyName} to pickup #${confirmData?.bookingId}?`}
        confirmText={assigning ? 'Assigning...' : 'Assign'}
        variant="info"
        onConfirm={confirmAssign}
        onCancel={() => setConfirmData(null)}
      />
    </div>
  );
};

export default AdminPickupBookingsPage;
