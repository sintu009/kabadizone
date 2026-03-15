import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Phone, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { scrapboyLogin } from '../features/scrapboyAuthSlice';
import InstallPrompt from '../../../shared/components/InstallPrompt';

const LOGO_URL = 'https://res.cloudinary.com/dnimidvwh/image/upload/v1773520272/kabadi-logo_d6ftxe.png';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !pin) return toast.error('Please fill all fields');
    setLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      if (phone === '9876543210' && pin === '1234') {
        dispatch(scrapboyLogin({ name: 'Rajesh Kumar', phone, role: 'scrapboy' }));
        toast.success('Welcome back, Rajesh!');
        navigate('/scrapboy', { replace: true });
      } else {
        toast.error('Invalid phone or PIN');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-emerald-950 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={LOGO_URL} alt="Kabadizone" className="h-20 w-20 rounded-2xl shadow-lg mb-4" />
          <h1 className="text-2xl font-bold text-white">Scrap Boy Portal</h1>
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
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-600/30"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-6">
          <InstallPrompt />
        </div>

        <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-xs mb-2">Demo Credentials</p>
          <p className="text-gray-300 text-sm font-mono">Phone: 9876543210</p>
          <p className="text-gray-300 text-sm font-mono">PIN: 1234</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
