import { useState } from 'react';
import { Search, Plus, X, Check, IndianRupee, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../shared/components/ConfirmModal';

const SCRAP_BOYS = [
  { id: 1, name: 'Ravi Kumar', balance: 3200 },
  { id: 2, name: 'Suresh Yadav', balance: 1800 },
  { id: 3, name: 'Manoj Singh', balance: 500 },
  { id: 4, name: 'Deepak Verma', balance: 5400 },
  { id: 5, name: 'Arun Patel', balance: 2100 },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, scrapBoyId: 1, scrapBoyName: 'Ravi Kumar', type: 'credit', amount: 2000, note: 'Weekly payment', date: '2025-01-10' },
  { id: 2, scrapBoyId: 2, scrapBoyName: 'Suresh Yadav', type: 'credit', amount: 1500, note: 'Weekly payment', date: '2025-01-10' },
  { id: 3, scrapBoyId: 4, scrapBoyName: 'Deepak Verma', type: 'credit', amount: 3000, note: 'Bonus payment', date: '2025-01-09' },
  { id: 4, scrapBoyId: 1, scrapBoyName: 'Ravi Kumar', type: 'debit', amount: 500, note: 'Fuel expense', date: '2025-01-09' },
  { id: 5, scrapBoyId: 3, scrapBoyName: 'Manoj Singh', type: 'credit', amount: 1000, note: 'Weekly payment', date: '2025-01-08' },
  { id: 6, scrapBoyId: 5, scrapBoyName: 'Arun Patel', type: 'credit', amount: 2100, note: 'Weekly payment', date: '2025-01-08' },
];

const AdminWalletPage = () => {
  const [boys, setBoys] = useState(SCRAP_BOYS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ scrapBoyId: '', amount: '', type: 'credit', note: '' });
  const [confirmTx, setConfirmTx] = useState(false);

  const totalBalance = boys.reduce((sum, b) => sum + b.balance, 0);

  const filteredTx = transactions.filter(
    (t) => t.scrapBoyName.toLowerCase().includes(search.toLowerCase()) || t.note.toLowerCase().includes(search.toLowerCase())
  );

  const validateAndConfirm = () => {
    if (!form.scrapBoyId) return toast.error('Please select a scrap boy');
    if (!form.amount || Number(form.amount) <= 0) return toast.error('Enter a valid amount');
    setConfirmTx(true);
  };

  const handleAdd = () => {
    const boy = boys.find((b) => b.id === Number(form.scrapBoyId));
    if (!boy) return;

    const amt = Number(form.amount);
    setTransactions((prev) => [
      { id: Date.now(), scrapBoyId: boy.id, scrapBoyName: boy.name, type: form.type, amount: amt, note: form.note || '-', date: new Date().toISOString().split('T')[0] },
      ...prev,
    ]);
    setBoys((prev) =>
      prev.map((b) =>
        b.id === boy.id
          ? { ...b, balance: form.type === 'credit' ? b.balance + amt : Math.max(0, b.balance - amt) }
          : b
      )
    );
    setShowForm(false);
    setConfirmTx(false);
    setForm({ scrapBoyId: '', amount: '', type: 'credit', note: '' });
    toast.success(`₹${amt} ${form.type === 'credit' ? 'credited to' : 'debited from'} ${boy.name}`);
  };

  const getConfirmBoyName = () => boys.find((b) => b.id === Number(form.scrapBoyId))?.name || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Wallet & Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage scrap boy payments and balances.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="inline-flex p-2 rounded-lg bg-emerald-50 text-emerald-600 mb-3">
            <IndianRupee className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{totalBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Outstanding Balance</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="inline-flex p-2 rounded-lg bg-indigo-50 text-indigo-600 mb-3">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Credits</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="inline-flex p-2 rounded-lg bg-red-50 text-red-600 mb-3">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₹{transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total Debits</p>
        </div>
      </div>

      {/* Balances */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Scrap Boy Balances</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 divide-y sm:divide-y-0 divide-gray-100">
          {boys.map((boy) => (
            <div key={boy.id} className="flex items-center justify-between px-5 py-3.5 sm:border-b sm:border-r border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                  {boy.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <span className="text-sm font-medium text-gray-900">{boy.name}</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">₹{boy.balance.toLocaleString()}</span>
            </div>
          ))}
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

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Scrap Boy</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 text-gray-500">{tx.date}</td>
                  <td className="px-6 py-3.5 font-medium text-gray-900">{tx.scrapBoyName}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      {tx.type === 'credit' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {tx.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td className={`px-6 py-3.5 font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{tx.note}</td>
                </tr>
              ))}
              {filteredTx.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filteredTx.map((tx) => (
            <div key={tx.id} className="px-4 py-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{tx.scrapBoyName}</span>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{tx.note}</span>
                <span>{tx.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Scrap Boy</label>
                <select
                  value={form.scrapBoyId}
                  onChange={(e) => setForm({ ...form, scrapBoyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select scrap boy</option>
                  {boys.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} (₹{b.balance})</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
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
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
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
        message={`${form.type === 'credit' ? 'Credit' : 'Debit'} ₹${form.amount} ${form.type === 'credit' ? 'to' : 'from'} ${getConfirmBoyName()}?`}
        confirmText={form.type === 'credit' ? 'Credit' : 'Debit'}
        variant={form.type === 'debit' ? 'warning' : 'info'}
        onConfirm={handleAdd}
        onCancel={() => setConfirmTx(false)}
      />
    </div>
  );
};

export default AdminWalletPage;
