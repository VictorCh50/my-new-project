import React from 'react';

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Tembo Bank Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>
              <p className="text-gray-600">Your banking features will appear here.</p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg">Account Balance</h3>
                  <p className="text-3xl font-bold mt-2">$5,000.00</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg">Recent Transactions</h3>
                  <p className="text-gray-600 mt-2">No recent transactions</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg">Quick Actions</h3>
                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 rounded">Transfer Money</button>
                    <button className="w-full bg-green-600 text-white py-2 rounded">Pay Bills</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
