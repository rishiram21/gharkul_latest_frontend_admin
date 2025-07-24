import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPackage] = useState({
    packageName: '',
    price: '',
    durationDays: '',
    status: '',
    postLimit: '',
    contactLimit: '',
    userRole: '',
    features:''
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/packages/get/${id}`);
        setPackage(response.data);
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackage(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/packages/update/${id}`, pkg);
      navigate('/package'); // Redirect to the packages list page
    } catch (error) {
      console.error('Error updating package:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Package</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Package Name</label>
          <input
            type="text"
            name="packageName"
            value={pkg.packageName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={pkg.price}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Duration (Days)</label>
          <input
            type="number"
            name="durationDays"
            value={pkg.durationDays}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Features</label>
          <textarea
              name="features"
              value={pkg.features}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            name="status"
            value={pkg.status}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Post Limit</label>
          <input
            type="number"
            name="postLimit"
            value={pkg.postLimit}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contact Limit</label>
          <input
            type="number"
            name="contactLimit"
            value={pkg.contactLimit}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">User Role</label>
          <input
            readOnly
            type="text"
            name="userRole"
            value={pkg.userRole}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200"
        >
          Update Package
        </button>
      </form>
    </div>
  );
};

export default EditPackage;
