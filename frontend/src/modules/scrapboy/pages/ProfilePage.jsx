import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Phone, Star, IndianRupee } from 'lucide-react';
import { scrapboyLogout } from '../features/scrapboyAuthSlice';
import { fetchMyWallet, fetchDashboard, resetWalletState } from '../features/walletSlice';
import toast from 'react-hot-toast';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.scrapboyAuth);
  const { balance, dashboard } = useSelector((s) => s.scrapboyWallet);

  useEffect(() => {
    dispatch(fetchMyWallet());
    dispatch(fetchDashboard());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(scrapboyLogout());
    dispatch(resetWalletState());
    toast.success(t('scrapboy.logout'));
    navigate('/scrapboy/login', { replace: true });
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
        <img src={LOGO_URL} alt="Avatar" className="h-16 w-16 rounded-2xl bg-gray-100" />
        <div>
          <h2 className="text-lg font-bold text-gray-900">{user?.name || 'Scrap Boy'}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Phone className="h-3.5 w-3.5" />
            {user?.phone || user?.username || 'N/A'}
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-500 mt-0.5">
            <Star className="h-3.5 w-3.5 fill-amber-400" /> 4.8 Rating
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center gap-2 text-emerald-100 text-sm mb-1">
          <IndianRupee className="h-4 w-4" /> {t('scrapboy.walletBalance')}
        </div>
        <p className="text-3xl font-bold">₹{Number(balance).toLocaleString()}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {[
          { label: t('scrapboy.totalPickups'), value: String(dashboard?.completed_requests || 0) },
          { label: t('scrapboy.newRequests'), value: String(dashboard?.pending_requests || 0) },
          { label: t('scrapboy.active'), value: String(dashboard?.in_progress_requests || 0) },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
      >
        <LogOut className="h-5 w-5" />
        {t('scrapboy.logout')}
      </button>
    </div>
  );
};

export default ProfilePage;
