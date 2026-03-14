import { useState } from 'react';
import {
  Calendar, Clock, MapPin, User, Truck, Search,
  CheckCircle2, AlertCircle, Filter, RefreshCw,
  LayoutGrid, Table2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const STATUSES = ['All', 'Pending', 'Assigned', 'Completed', 'Cancelled'];
const PER_PAGE = 10;

// Mock data — replace with API call
const initialBookings = [
  { id: 'PK-1001', customer: 'Rahul Sharma', phone: '98XXXXXX10', address: 'Sector 12, Noida', date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Paper', 'Cardboard'], estimatedWeight: '~15 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1002', customer: 'Priya Patel', phone: '98XXXXXX11', address: 'MG Road, Gurgaon', date: '2025-01-20', timeSlot: '2:00 PM - 4:00 PM', scrapTypes: ['Metal', 'Iron'], estimatedWeight: '~8 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1003', customer: 'Amit Kumar', phone: '98XXXXXX12', address: 'Laxmi Nagar, Delhi', date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Plastic', 'E-Waste'], estimatedWeight: '~5 kg', status: 'Assigned', assignedTo: 'Ravi Kumar' },
  { id: 'PK-1004', customer: 'Sneha Reddy', phone: '98XXXXXX13', address: 'Banjara Hills, Hyderabad', date: '2025-01-19', timeSlot: '4:00 PM - 6:00 PM', scrapTypes: ['Paper'], estimatedWeight: '~20 kg', status: 'Completed', assignedTo: 'Deepak Verma' },
  { id: 'PK-1005', customer: 'Vikram Singh', phone: '98XXXXXX14', address: 'Connaught Place, Delhi', date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Iron', 'Metal'], estimatedWeight: '~30 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1006', customer: 'Neha Gupta', phone: '98XXXXXX15', address: 'Andheri West, Mumbai', date: '2025-01-20', timeSlot: '2:00 PM - 4:00 PM', scrapTypes: ['E-Waste'], estimatedWeight: '~2 kg', status: 'Assigned', assignedTo: 'Suresh Yadav' },
  { id: 'PK-1007', customer: 'Rajesh Khanna', phone: '98XXXXXX16', address: 'Koramangala, Bangalore', date: '2025-01-20', timeSlot: '4:00 PM - 6:00 PM', scrapTypes: ['Paper', 'Plastic'], estimatedWeight: '~10 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1008', customer: 'Pooja Mehta', phone: '98XXXXXX17', address: 'Salt Lake, Kolkata', date: '2025-01-19', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Cardboard'], estimatedWeight: '~25 kg', status: 'Completed', assignedTo: 'Arun Patel' },
  { id: 'PK-1009', customer: 'Sunil Das', phone: '98XXXXXX18', address: 'Jubilee Hills, Hyderabad', date: '2025-01-20', timeSlot: '2:00 PM - 4:00 PM', scrapTypes: ['Metal'], estimatedWeight: '~12 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1010', customer: 'Kavita Rao', phone: '98XXXXXX19', address: 'Whitefield, Bangalore', date: '2025-01-20', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Paper', 'E-Waste'], estimatedWeight: '~7 kg', status: 'Assigned', assignedTo: 'Deepak Verma' },
  { id: 'PK-1011', customer: 'Manoj Tiwari', phone: '98XXXXXX20', address: 'Vaishali, Ghaziabad', date: '2025-01-20', timeSlot: '4:00 PM - 6:00 PM', scrapTypes: ['Iron'], estimatedWeight: '~18 kg', status: 'Pending', assignedTo: null },
  { id: 'PK-1012', customer: 'Anita Desai', phone: '98XXXXXX21', address: 'Powai, Mumbai', date: '2025-01-19', timeSlot: '10:00 AM - 12:00 PM', scrapTypes: ['Plastic', 'Cardboard'], estimatedWeight: '~9 kg', status: 'Completed', assignedTo: 'Ravi Kumar' },
];

const scrapBoys = [
  { id: 1, name: 'Ravi Kumar', area: 'Noida', activePickups: 2 },
  { id: 2, name: 'Deepak Verma', area: 'Gurgaon', activePickups: 1 },
  { id: 3, name: 'Suresh Yadav', area: 'Delhi', activePickups: 0 },
  { id: 4, name: 'Arun Patel', area: 'Hyderabad', activePickups: 3 },
];

const statusStyle = {
  Pending: 'bg-amber-50 text-amber-700',
  Assigned: 'bg-blue-50 text-blue-700',
  Completed: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700',
};

const AdminPickupBookingsPage = () => {
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('card'); // 'card' | 'table'
  const [page, setPage] = useState(1);
  const [assigningId, setAssigningId] = useState(null);
  const [confirmData, setConfirmData] = useState(null);

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const requestAssign = (bookingId, scrapBoyName, isReassign = false) => {
    setConfirmData({ bookingId, scrapBoyName, isReassign });
  };

  const confirmAssign = () => {
    if (!confirmData) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === confirmData.bookingId
          ? { ...b, assignedTo: confirmData.scrapBoyName, status: 'Assigned' }
          : b
      )
    );
    setConfirmData(null);
    setAssigningId(null);
  };

  // Reset page when filter/search changes
  const handleFilterChange = (s) => { setStatusFilter(s); setPage(1); };
  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Pickup Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user pickup requests and assign scrap boys</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">{pendingCount} pending assignment{pendingCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Filters + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-white rounded-lg px-3 py-2 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, ID, or address..."
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
              {s}
            </button>
          ))}
        </div>
        {/* View Toggle */}
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
                  <th className="px-4 py-3">Time Slot</th>
                  <th className="px-4 py-3">Scrap Types</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((b) => (
                  <tr key={b.id} className={`hover:bg-gray-50/50 transition-colors ${b.status === 'Pending' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900">{b.customer}</p>
                      <p className="text-xs text-gray-400">{b.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{b.address}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{b.date}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{b.timeSlot}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {b.scrapTypes.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {b.assignedTo
                        ? <span className="text-gray-700">{b.assignedTo}</span>
                        : <span className="text-amber-600 text-xs font-medium">Unassigned</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusStyle[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {b.status === 'Pending' && (
                        <button
                          onClick={() => setAssigningId(assigningId === b.id ? null : b.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                        >
                          Assign
                        </button>
                      )}
                      {b.status === 'Assigned' && (
                        <button
                          onClick={() => setAssigningId(assigningId === b.id ? null : b.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" /> Reassign
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
                <span className="text-xs font-medium text-gray-500">
                  {bookings.find((b) => b.id === assigningId)?.status === 'Assigned' ? 'Reassign' : 'Assign'} {assigningId} to:
                </span>
                {scrapBoys
                  .filter((sb) => sb.name !== bookings.find((b) => b.id === assigningId)?.assignedTo)
                  .map((sb) => (
                    <button
                      key={sb.id}
                      onClick={() => requestAssign(assigningId, sb.name, bookings.find((b) => b.id === assigningId)?.status === 'Assigned')}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                    >
                      {sb.name} <span className="text-gray-400">· {sb.area} · {sb.activePickups} active</span>
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
            <div key={booking.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">{booking.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.customer} · {booking.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {booking.scrapTypes.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
                    ))}
                    <span className="text-xs text-gray-400">· {booking.estimatedWeight}</span>
                  </div>
                </div>

                {/* Assignment Section */}
                <div className="lg:w-64 shrink-0">
                  {booking.status === 'Pending' ? (
                    assigningId === booking.id ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Select Scrap Boy</p>
                        {scrapBoys.map((sb) => (
                          <button
                            key={sb.id}
                            onClick={() => requestAssign(booking.id, sb.name)}
                            className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-left"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{sb.name}</p>
                              <p className="text-xs text-gray-500">{sb.area} · {sb.activePickups} active</p>
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
                  ) : booking.status === 'Assigned' ? (
                    assigningId === booking.id ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Reassign to</p>
                        {scrapBoys
                          .filter((sb) => sb.name !== booking.assignedTo)
                          .map((sb) => (
                            <button
                              key={sb.id}
                              onClick={() => requestAssign(booking.id, sb.name, true)}
                              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                            >
                              <div>
                                <p className="text-sm font-medium text-gray-900">{sb.name}</p>
                                <p className="text-xs text-gray-500">{sb.area} · {sb.activePickups} active</p>
                              </div>
                              <Truck className="h-4 w-4 text-gray-400" />
                            </button>
                          ))}
                        <button onClick={() => setAssigningId(null)} className="w-full text-xs text-gray-500 hover:text-gray-700 py-1">Cancel</button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <Truck className="h-4 w-4 text-blue-600 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-600">Assigned to</p>
                            <p className="text-sm font-medium text-blue-800">{booking.assignedTo}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setAssigningId(booking.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reassign
                        </button>
                      </div>
                    )
                  ) : booking.status === 'Completed' ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-xs text-emerald-600">Completed by</p>
                        <p className="text-sm font-medium text-emerald-800">{booking.assignedTo}</p>
                      </div>
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
        title={confirmData?.isReassign ? 'Reassign Pickup' : 'Assign Pickup'}
        message={confirmData?.isReassign
          ? `Are you sure you want to reassign ${confirmData?.bookingId} to ${confirmData?.scrapBoyName}?`
          : `Assign ${confirmData?.scrapBoyName} to pickup ${confirmData?.bookingId}?`
        }
        confirmText={confirmData?.isReassign ? 'Reassign' : 'Assign'}
        variant="info"
        onConfirm={confirmAssign}
        onCancel={() => setConfirmData(null)}
      />
    </div>
  );
};

export default AdminPickupBookingsPage;
