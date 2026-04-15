import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { scrapboyLoginAsync, clearError } from '../features/scrapboyAuthSlice';
import InstallPrompt from '../../../shared/components/InstallPrompt';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.scrapboyAuth);

  useEffect(() => {
    if (isAuthenticated) navigate('/scrapboy', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return toast.error('Phone number is required');

    const result = await dispatch(scrapboyLoginAsync({ username: phone, password: phone }));
    if (scrapboyLoginAsync.fulfilled.match(result)) {
      toast.success('Welcome back!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-emerald-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={LOGO_URL} alt="Kabadizone" className="h-20 w-20 rounded-2xl shadow-lg mb-4" />
          <h1 className="text-2xl font-bold text-white">Scrap Collector Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Login to manage your pickups</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              disabled={loading}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/30"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</>
            ) : (
              <><LogIn className="h-5 w-5" /> Login</>
            )}
          </button>
        </form>

        <div className="mt-6">
          <InstallPrompt />
        </div>

        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Login Info</p>
          <p className="text-gray-300 text-sm">Enter your registered phone number to login</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
