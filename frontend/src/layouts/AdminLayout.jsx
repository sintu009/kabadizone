import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  LayoutDashboard, Users, Settings, Menu, X, LogOut, Bell, Search, ChevronDown,
  IndianRupee, Truck, ListOrdered, Wallet, CalendarClock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logout } from '../modules/admin/features/authSlice';
import ConfirmModal from '../shared/components/ConfirmModal';
import NotificationPanel from '../modules/admin/components/NotificationPanel';



const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Scrap Prices', to: '/admin/scrap-prices', icon: ListOrdered },
  { label: 'Scrap Boys', to: '/admin/scrapboys', icon: Truck },
  { label: 'Wallet', to: '/admin/wallet', icon: Wallet },
  { label: 'Pickup Bookings', to: '/admin/bookings', icon: CalendarClock },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.adminAuth.user);

  const isActive = (to) => to === '/admin' ? pathname === to : pathname.startsWith(to);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutConfirm(false);
    toast.success('Logged out successfully');
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <>
      {/* Title */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
        <span className="text-lg font-bold text-white tracking-tight">Kabadizone Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(to)
                ? 'bg-white/15 text-white'
                : 'text-emerald-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom logout */}
      <div className="px-3 py-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-white/10 hover:text-red-200 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 flex flex-col transform transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-3 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 bg-emerald-900 flex-col z-30">
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-colors">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {(user?.username?.[0] || 'A').toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user?.username || 'Admin'}
                </span>
                <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'Admin'}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
                    </div>
                    <Link
                      to="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <button
                      onClick={() => { setProfileOpen(false); setShowLogoutConfirm(true); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Logout Confirmation */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default AdminLayout;
