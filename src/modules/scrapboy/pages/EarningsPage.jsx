import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IndianRupee, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const EarningsPage = () => {
  const { t } = useTranslation();
  const { balance, transactions } = useSelector((s) => s.scrapboyWallet);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{t('scrapboy.earnings')}</h2>
        <p className="text-sm text-gray-500">{t('scrapboy.walletAndTransactions')}</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-emerald-100 text-sm">{t('scrapboy.walletBalance')}</p>
        <p className="text-3xl font-bold mt-1 flex items-center gap-1">
          <IndianRupee className="h-7 w-7" />{balance.toLocaleString()}
        </p>
        <p className="text-emerald-200 text-xs mt-2">{t('scrapboy.adminLoadsMoney')}</p>
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3">{t('scrapboy.transactions')}</h3>
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">{t('scrapboy.noTransactions')}</div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {tx.type === 'credit' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.label}</p>
                  <p className="text-xs text-gray-400">
                    {tx.date}{tx.paymentMode ? ` · ${tx.paymentMode}` : ''}
                  </p>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
