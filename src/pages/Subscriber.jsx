import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Building, AlertCircle, Search } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Subscriber = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { updateDashboardData } = useDashboard();
  const hasFetched = useRef(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSubscriptions();
    }
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/subscriptions/get`, {
        params: { page, size },
      });
      const data = response.data;
      setSubscriptions(data.content || []);
      setTotalPages(data.totalPages);

      updateDashboardData({ subscriberCount: data.totalElements });
    } catch (error) {
      setError(error.message);
      updateDashboardData({ subscriberCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page]);


  const handleDeactivateSubscription = async (userId, packageId) => {
    if (window.confirm('Are you sure you want to deactivate this subscription?')) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/subscriptions/check-and-deactivate`,
          null,
          { params: { userId, packageId } }
        );
        alert(response.data);
        const updated = subscriptions.map(sub =>
          sub.userId === userId && sub.packageId === packageId
            ? { ...sub, status: 'INACTIVE' }
            : sub
        );
        setSubscriptions(updated);
      } catch (error) {
        console.error('Error deactivating subscription:', error);
        setError('Failed to deactivate subscription');
      } finally {
        setLoading(false);
      }
    }
  };

 const filteredSubscriptions = subscriptions.filter(subscription => {
    return (
      subscription.price.toString().includes(searchTerm.toLowerCase()) ||
      subscription.paymentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Loading subscriptions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-4 text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Subscriptions</h1>
                <p className="text-sm text-gray-600">View and manage subscriptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Posts Used</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contacts Used</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription, index) => (
                    <tr key={subscription.subscriberId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
  {subscription.userName.replace(/([a-z])([A-Z])/g, '$1 $2')}
</td>

                      <td className="px-6 py-4">₹{subscription.price}</td>
                      <td className="px-6 py-4">{subscription.paymentType}</td>
                      <td className="px-6 py-4">{new Date(subscription.subscriptionStartDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(subscription.subscriptionEndDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{subscription.role}</td>
                      <td className="px-6 py-4">{subscription.remainingPostsUsed}</td>
                      <td className="px-6 py-4">{subscription.remainingContactsUsed}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          subscription.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {subscription.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-600">No subscriptions found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination controls below the table */}
      <div className="flex justify-between items-center mt-4 px-6 py-2 bg-white border-t border-gray-200 rounded-b-xl max-w-7xl mx-auto">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriber;
