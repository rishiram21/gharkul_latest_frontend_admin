import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDashboard } from '../context/DashboardContext';
import { Search, Building, User, Calendar, Phone, Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllRequirement = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateDashboardData } = useDashboard();
  const hasFetched = useRef(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/all`, {
        params: { page, size },
      });
      const data = response.data;
      setRequirements(data.content || []);
      setTotalPages(data.totalPages);
      updateDashboardData({ requirementCount: data.totalElements });
      setError(null);
    } catch (err) {
      setError(err.message);
      setRequirements([]);
      updateDashboardData({ requirementCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/requirement/status/${id}`, null, {
        params: { status },
      });
      fetchRequirements(); // Refresh the list after updating the status
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [page]);

  const filteredRequirements = requirements.filter(req =>
    req.lookingFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.preferredLocations?.some(loc =>
      loc.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Loading requirements...</span>
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
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Property Requirements</h1>
                <p className="text-sm text-gray-600">Manage and view all property requirements</p>
              </div>
            </div>
            <Link
              to="/addrequirement"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Requirement
            </Link>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search properties by looking for..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
        {/* Requirements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr. No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Looking For</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Property Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">BHK Config</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget Range</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Preferred Locations</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Requirements</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequirements.length > 0 ? (
                  filteredRequirements.map((requirement, index) => (
                    <tr key={requirement.requirementId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">{requirement.lookingFor}</td>
                      <td className="px-6 py-4">{requirement.propertyType}</td>
                      <td className="px-6 py-4">{requirement.bhkConfig}</td>
                      <td className="px-6 py-4">₹{requirement.minBudget} - ₹{requirement.maxBudget}</td>
                      <td className="px-6 py-4">{requirement.preferredLocations?.join(', ')}</td>
                      <td className="px-6 py-4">{requirement.additionalRequirements}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{requirement.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full
                            ${requirement.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              requirement.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}
                        >
                          {requirement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block text-left">
                          <div>
                            <button
                              type="button"
                              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                              id="options-menu"
                              onClick={() => document.getElementById(`options-menu-${requirement.requirementId}`).classList.toggle('hidden')}
                            >
                              Actions
                              <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
                            </button>
                          </div>
                          <div id={`options-menu-${requirement.requirementId}`} className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                              <button
                                onClick={() => updateStatus(requirement.requirementId, 'ACTIVE')}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                              >
                                Set Active
                              </button>
                              <button
                                onClick={() => updateStatus(requirement.requirementId, 'INACTIVE')}
                                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                              >
                                Set Inactive
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-600">No requirements found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

export default AllRequirement;
