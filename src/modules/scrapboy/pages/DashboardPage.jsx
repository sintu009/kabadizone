const DashboardPage = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Scrapboy Dashboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Welcome to your portal.</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="text-green-800 font-semibold mb-2">Today's Pickups</h4>
            <span className="text-3xl font-bold text-green-600">5</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-blue-800 font-semibold mb-2">Pending Requests</h4>
            <span className="text-3xl font-bold text-blue-600">12</span>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="text-yellow-800 font-semibold mb-2">Total Earnings</h4>
            <span className="text-3xl font-bold text-yellow-600">₹4500</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
