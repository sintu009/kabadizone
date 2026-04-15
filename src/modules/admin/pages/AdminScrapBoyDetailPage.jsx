import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Calendar, Loader2, Mail, Droplets } from 'lucide-react';
import toast from 'react-hot-toast';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const genderColor = {
  MALE: 'bg-blue-50 text-blue-700',
  FEMALE: 'bg-pink-50 text-pink-700',
  OTHER: 'bg-purple-50 text-purple-700',
};

const AdminScrapBoyDetailPage = () => {
  const { id } = useParams();
  const [boy, setBoy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`${API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS}/${id}`);
        setBoy(res.data || res);
      } catch {
        toast.error('Failed to load scrap boy details');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

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
            {boy.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{boy.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${genderColor[boy.gender] || 'bg-gray-100 text-gray-500'}`}>
                {boy.gender || '—'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {boy.phone_number || '—'}</span>
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {boy.email || '—'}</span>
              <span className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5" /> {boy.blood_group || '—'}</span>
              {boy.added_on && (
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Joined {new Date(boy.added_on).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScrapBoyDetailPage;
