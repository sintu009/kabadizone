import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Calendar, Package, IndianRupee } from 'lucide-react';

const BOYS_DATA = {
  1: {
    name: 'Ravi Kumar', phone: '9876543210', area: 'Banjara Hills', status: 'Active',
    joinedDate: '2024-03-15', totalPickups: 142, balance: 3200, totalEarnings: 28500,
    orders: [
      { id: '#ORD-2041', customer: 'Rahul Sharma', type: 'Paper', weight: '12.5 kg', amount: '₹312', date: '2025-01-10', status: 'Completed' },
      { id: '#ORD-2035', customer: 'Sneha Reddy', type: 'Metal', weight: '8 kg', amount: '₹1,120', date: '2025-01-09', status: 'Completed' },
      { id: '#ORD-2028', customer: 'Amit Kumar', type: 'Plastic', weight: '5 kg', amount: '₹75', date: '2025-01-08', status: 'Completed' },
    ],
  },
  2: {
    name: 'Suresh Yadav', phone: '9876543211', area: 'Jubilee Hills', status: 'Active',
    joinedDate: '2024-05-20', totalPickups: 98, balance: 1800, totalEarnings: 18200,
    orders: [
      { id: '#ORD-2040', customer: 'Priya Patel', type: 'Metal', weight: '8.2 kg', amount: '₹1,230', date: '2025-01-10', status: 'In Progress' },
    ],
  },
};

const statusColor = {
  Completed: 'bg-emerald-50 text-emerald-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Pending: 'bg-amber-50 text-amber-700',
};

const AdminScrapBoyDetailPage = () => {
  const { id } = useParams();
  const boy = BOYS_DATA[id];

  if (!boy) {
    return (
      <div className="space-y-4">
        <Link to="/admin/scrapboys" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
          <ArrowLeft className="h-4 w-4" /> Back to Scrap Boys
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
          Scrap boy not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/scrapboys" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
        <ArrowLeft className="h-4 w-4" /> Back to Scrap Boys
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
            {boy.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{boy.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${boy.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {boy.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {boy.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {boy.area}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {boy.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Pickups', value: boy.totalPickups, icon: Package, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Wallet Balance', value: `₹${boy.balance.toLocaleString()}`, icon: IndianRupee, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Earnings', value: `₹${boy.totalEarnings.toLocaleString()}`, icon: IndianRupee, color: 'bg-violet-50 text-violet-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Pickups</h2>
        </div>
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Weight</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {boy.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-3.5 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-3.5 text-gray-500">{order.type}</td>
                  <td className="px-6 py-3.5 text-gray-500">{order.weight}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-3.5 text-gray-500">{order.date}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile */}
        <div className="sm:hidden divide-y divide-gray-100">
          {boy.orders.map((order) => (
            <div key={order.id} className="px-4 py-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{order.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-700">{order.customer}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{order.type} · {order.weight}</span>
                <span className="font-semibold text-gray-900">{order.amount}</span>
              </div>
            </div>
          ))}
        </div>
        {boy.orders.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-400">No pickups yet.</div>
        )}
      </div>
    </div>
  );
};

export default AdminScrapBoyDetailPage;
