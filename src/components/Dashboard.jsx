import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
              <p className="text-gray-600 mt-1">Your account is verified via {user?.preferredChannel?.toUpperCase()}</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div><label className="text-sm text-gray-500">Name</label><p className="text-lg font-medium">{user?.name}</p></div>
              <div><label className="text-sm text-gray-500">Mobile Number</label><p className="text-lg font-medium">{user?.mobileNumber}</p></div>
              <div><label className="text-sm text-gray-500">Verification Status</label><p className="text-lg font-medium text-green-600">✓ Verified</p></div>
              <div><label className="text-sm text-gray-500">Preferred Channel</label><p className="text-lg font-medium">{user?.preferredChannel?.toUpperCase()}</p></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">Your session is secured with JWT tokens stored in HTTP-only cookies.</p>
              <p className="text-xs text-blue-600">Access tokens expire in 15 minutes, refresh tokens in 7 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;