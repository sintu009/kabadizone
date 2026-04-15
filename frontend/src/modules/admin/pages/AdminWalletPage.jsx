import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, X, Check, IndianRupee, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import apiClient from '../../../api/axios';
import { API_ENDPOINTS } from '../../../api/endpoints';

const AdminWalletPage = () => {
  const [collectors, setCollectors] = useState([]);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ owner_id: '', amount: '', type: 'credit', remarks: '' });
  const [confirmTx, setConfirmTx] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCollectors = useCallback(async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.ADMIN.SCRAP_COLLECTORS, { params: { page: 1, limit: 100 } });
      setCollectors(res.data || []);
    } catch {
      toast.error('Failed to load collectors');
    }
  }, []);

  useEffect(() => {
    fetchCollectors().finally(() => setLoading(false));
  }, [fetchCollectors]);

  const fetchWallet = useCallback(async (collectorId) => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.WALLETS.BASE, {
        params: { owner_type: 'COLLECTOR', owner_id: collectorId },
      });
      setWallet(res.data || res);
    } catch {
      setWallet(null);
    }
  }, []);

  const fetchTransactions = useCallback(async (collectorId) => {
    setTxLoading(true);
    try {
      const res = await apiClient.get(API_ENDPOINTS.WALLETS.TRANSACTIONS, {
        params: { owner_type: 'COLLECTOR', owner_id: collectorId },
      });
      const data = Array.isArray(res) ? res : res.data || [];
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, []);

  const handleSelectCollector = (collector) => {
    setSelectedCollector(collector);
    fetchWallet(collector.id);
    fetchTransactions(collector.id);
  };

  const openForm = () => {
    setForm({
      owner_id: selectedCollector?.id || '',
      amount: '',
      type: 'credit',
      remarks: '',
    });
    setShowForm(true);
  };

  const validateAndConfirm = () => {
    if (!form.owner_id) return toast.error('Please select a collector');
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount');
    setConfirmTx(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const endpoint = form.type === 'credit' ? API_ENDPOINTS.WALLETS.CREDIT : API_ENDPOINTS.WALLETS.DEBIT;
      await apiClient.post(endpoint, {
        owner_type: 'COLLECTOR',
        owner_id: Number(form.owner_id),
        amount: Number(form.amount),
        remarks: form.remarks || (form.type === 'credit' ? 'Credit' : 'Debit'),
      });
      toast.success(`₹${form.amount} ${form.type === 'credit' ? 'credited' : 'debited'} successfully`);
      setShowForm(false);
      setConfirmTx(false);
      setForm({ owner_id: '', amount: '', type: 'credit', remarks: '' });
      // Refresh data for selected collector
      const cid = Number(form.owner_id);
      const col = collectors.find((c) => c.id === cid);
      if (col) {
        setSelectedCollector(col);
        fetchWallet(cid);
        fetchTransactions(cid);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setSubmitting(false);
      setConfirmTx(false);
    }
  };

  const getConfirmCollectorName = () => collectors.find((c) => c.id === Number(form.owner_id))?.name || '';

  const filteredTx = transactions.filter(
    (t) =>
      (t.remarks || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.transaction_type || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalCredits = transactions
    .filter((t) => (t.transaction_type || '').toUpperCase() === 'CREDIT')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalDebits = transactions
    .filter((t) => (t.transaction_type || '').toUpperCase() === 'DEBIT')
    .reduce((s, t) => s + Number(t.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet & Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage collector payments and balances.</p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      </div>

      {/* Collector selector */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Select Collector</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y sm:divide-y-0 divide-gray-100">
          {collectors.map((col) => (
            <button
              key={col.id}
              onClick={() => handleSelectCollector(col)}
              className={`flex items-center justify-between px-5 py-3.5 sm:border-b sm:border-r border-gray-100 text-left transition-colors ${
                selectedCollector?.id === col.id ? 'bg-emerald-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                  {col.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span className="text-sm font-medium text-gray-900">{col.name}</span>
              </div>
              {selectedCollector?.id === col.id && (
                <span className="text-xs font-medium text-emerald-600">Selected</span>
              )}
            </button>
          ))}
          {collectors.length === 0 && (
            <div className="col-span-full px-5 py-8 text-center text-gray-400">No collectors found.</div>
          )}
        </div>
      </div>

      {/* Wallet info & transactions (shown after selecting a collector) */}
      {selectedCollector && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="inline-flex p-2 rounded-lg bg-emerald-50 text-emerald-600 mb-3">
                <IndianRupee className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Number(wallet?.balance ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">{selectedCollector.name}'s Balance</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="inline-flex p-2 rounded-lg bg-indigo-50 text-indigo-600 mb-3">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{totalCredits.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Total Credits</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="inline-flex p-2 rounded-lg bg-red-50 text-red-600 mb-3">
                <ArrowDownLeft className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{totalDebits.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Total Debits</p>
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 sm:px-6 py-4 border-b border-gray-100 gap-3">
              <h2 className="text-base font-semibold text-gray-900">Transaction History</h2>
              <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 w-full sm:w-64 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="ml-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                />
              </div>
            </div>

            {txLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredTx.map((tx, i) => {
                        const isCredit = (tx.transaction_type || '').toUpperCase() === 'CREDIT';
                        return (
                          <tr key={tx.id || i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-3.5 text-gray-500">
                              {tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isCredit ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                {isCredit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                                {isCredit ? 'Credit' : 'Debit'}
                              </span>
                            </td>
                            <td className={`px-6 py-3.5 font-semibold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isCredit ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-3.5 text-gray-500">{tx.remarks || '—'}</td>
                          </tr>
                        );
                      })}
                      {filteredTx.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No transactions found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {filteredTx.map((tx, i) => {
                    const isCredit = (tx.transaction_type || '').toUpperCase() === 'CREDIT';
                    return (
                      <div key={tx.id || i} className="px-4 py-4 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isCredit ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                            {isCredit ? 'Credit' : 'Debit'}
                          </span>
                          <span className={`text-sm font-bold ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isCredit ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{tx.remarks || '—'}</span>
                          <span>{tx.created_at ? new Date(tx.created_at).toLocaleDateString() : '—'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {!selectedCollector && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          Select a collector above to view wallet details and transactions.
        </div>
      )}

      {/* Add Transaction Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Add Transaction</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collector</label>
                <select
                  value={form.owner_id}
                  onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select collector</option>
                  {collectors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="credit">Credit (Add Money)</option>
                  <option value="debit">Debit (Deduct Money)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="e.g. Weekly payment"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={validateAndConfirm}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Confirmation */}
      <ConfirmModal
        open={confirmTx}
        title="Confirm Transaction"
        message={`${form.type === 'credit' ? 'Credit' : 'Debit'} ₹${form.amount} ${form.type === 'credit' ? 'to' : 'from'} ${getConfirmCollectorName()}?`}
        confirmText={form.type === 'credit' ? 'Credit' : 'Debit'}
        variant={form.type === 'debit' ? 'warning' : 'info'}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmTx(false)}
      />
    </div>
  );
};

export default AdminWalletPage;
