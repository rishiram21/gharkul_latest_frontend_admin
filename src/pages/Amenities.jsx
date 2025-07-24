import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDashboard } from '../context/DashboardContext';
import { Building, Plus } from 'lucide-react';

const Amenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [newAmenityName, setNewAmenityName] = useState('');
  const { updateDashboardData } = useDashboard();
  const hasFetched = useRef(false);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);


 const fetchAmenities = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/amenities/get`, {
      params: { page, size },
    });
    const data = response.data;
    setAmenities(data.content || []);
    setTotalPages(data.totalPages);
    updateDashboardData({ amenityCount: data.totalElements });
  } catch (error) {
    console.error('Error fetching amenities:', error);
    setAmenities([]);
    updateDashboardData({ amenityCount: 0 });
  }
};

useEffect(() => {
  fetchAmenities();
}, [page]);


  const handleAddAmenity = async () => {
  if (!newAmenityName.trim()) {
    alert('Amenity name is required');
    return;
  }
  try {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/api/amenities/add`, {
      name: newAmenityName.trim(),
    });
    setNewAmenityName('');
    setPage(0);  // Reset to first page and trigger re-fetch of amenities
  } catch (error) {
    console.error('Error adding amenity:', error);
    alert('Failed to add amenity');
  }
};


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
                <h1 className="text-3xl font-bold text-gray-900">Manage Amenities</h1>
                <p className="text-sm text-gray-600">View and add amenities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Amenity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              placeholder="Enter amenity name"
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddAmenity}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Amenity
            </button>
          </div>
        </div>

        {/* Amenities List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr. No.</th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {amenities.length > 0 ? (
                  amenities.map((amenity, index) => (
                    <tr key={amenity.amenityId} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-semibold">
                          {index + 1}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">{amenity.amenityId}</td> */}
                      <td className="px-6 py-4">{amenity.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-12">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="text-gray-600">No amenities found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-6 py-2 bg-white border-t border-gray-200 rounded-b-xl max-w-7xl mx-auto">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
    disabled={page === 0}
    className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
  >
    Previous
  </button>
  <span className="text-gray-700">
    Page {page + 1} of {totalPages}
  </span>
  <button
    onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
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

export default Amenities;