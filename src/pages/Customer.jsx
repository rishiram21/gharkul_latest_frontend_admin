import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Building, AlertCircle, Search } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const Customer = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { updateDashboardData } = useDashboard();
  const hasUpdatedDashboard = useRef(false);
  const [page, setPage] = useState(0); // zero-based page index
  const [size] = useState(10); // page size (can also be state if you want to change it)
  const [totalPages, setTotalPages] = useState(0);


  const fetchUsers = async () => {
  setLoading(true);
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/auth/users`,
      {
        params: {
          page,
          size,
          // you can pass sort param if you want: sort: ['id,asc']
        },
      }
    );

    const data = response.data;
    setUsers(data.content || []);
    setTotalPages(data.totalPages);

    if (!hasUpdatedDashboard.current) {
      const customerCount = data.content.filter(user => user.userRole === 'CUSTOMER').length;
      updateDashboardData({ customerCount });
      hasUpdatedDashboard.current = true;
    }
  } catch (err) {
    setError(err.message);
    updateDashboardData({ customerCount: 0 });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUsers();
}, [page, updateDashboardData]);


  const filteredUsers = users.filter(user => {
    return (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userRole.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col justify-center items-center">
        <div className="p-4 bg-red-100 rounded-full mb-4">
          <AlertCircle className="text-red-500" />
        </div>
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User List</h1>
                <p className="text-sm text-gray-600">View and manage users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.userId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.firstName}</td>
                      <td className="px-6 py-4">{user.lastName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                          user.userRole === 'CUSTOMER' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                          {user.userRole === 'CUSTOMER' ? 'Customer' : user.userRole}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-600">No users found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-6 py-2 bg-white border-t border-gray-200 rounded-b-xl">
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

export default Customer;
