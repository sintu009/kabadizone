import { useState } from 'react';
import { X, Check, CheckCheck, Trash2, Package, IndianRupee, UserPlus, AlertCircle, Bell } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'New Booking', message: 'Neha Gupta booked a scrap pickup #ORD-2042', time: '2 min ago', read: false, icon: Package, color: 'text-blue-500 bg-blue-50' },
  { id: 2, title: 'Pickup Completed', message: 'Ravi Kumar completed pickup #ORD-2041 (₹312)', time: '15 min ago', read: false, icon: Check, color: 'text-emerald-500 bg-emerald-50' },
  { id: 3, title: 'Payment Sent', message: '₹2,000 credited to Deepak Verma\'s wallet', time: '1 hr ago', read: false, icon: IndianRupee, color: 'text-violet-500 bg-violet-50' },
  { id: 4, title: 'New Scrap Boy', message: 'Arun Patel has been added as a scrap boy', time: '2 hr ago', read: true, icon: UserPlus, color: 'text-indigo-500 bg-indigo-50' },
  { id: 5, title: 'Pending Alert', message: 'Pickup #ORD-2039 is pending for over 3 hours', time: '3 hr ago', read: false, icon: AlertCircle, color: 'text-red-500 bg-red-50' },
  { id: 6, title: 'Pickup Completed', message: 'Deepak Verma completed pickup #ORD-2037 (₹880)', time: '5 hr ago', read: true, icon: Check, color: 'text-emerald-500 bg-emerald-50' },
  { id: 7, title: 'Price Updated', message: 'Iron scrap price updated to ₹30/kg', time: '6 hr ago', read: true, icon: Package, color: 'text-amber-500 bg-amber-50' },
];

const NotificationPanel = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeOne = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Actions bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100 shrink-0">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <Bell className="h-10 w-10 text-gray-200" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${!n.read ? 'bg-emerald-50/30' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${n.color}`}>
                    <n.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeOne(n.id); }}
                    className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
