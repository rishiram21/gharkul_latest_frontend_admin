import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSubscription = () => {
  const navigate = useNavigate();

  const [newSubscription, setNewSubscription] = useState({
    userId: '',
    packageId: '',
    price: '',
    paymentType: '',
    subscriptionStartDate: '',
    subscriptionEndDate: '',
    status: 'ACTIVE',
    role: 'USER',
    postsUsed: 0,
    contactsUsed: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubscription = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/subscriptions/add`, newSubscription);
      alert('Subscription added successfully!');
      navigate('/subscriptions'); // Redirect to the subscriptions list page
    } catch (error) {
      console.error('Error adding subscription:', error);
      alert('Failed to add subscription');
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Subscription</h1>
      <form onSubmit={handleAddSubscription} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="number"
              name="userId"
              value={newSubscription.userId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Package ID</label>
            <input
              type="number"
              name="packageId"
              value={newSubscription.packageId}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={newSubscription.price}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Payment Type</label>
            <input
              type="text"
              name="paymentType"
              value={newSubscription.paymentType}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription Start Date</label>
            <input
              type="date"
              name="subscriptionStartDate"
              value={newSubscription.subscriptionStartDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscription End Date</label>
            <input
              type="date"
              name="subscriptionEndDate"
              value={newSubscription.subscriptionEndDate}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={newSubscription.status}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={newSubscription.role}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posts Used</label>
            <input
              type="number"
              name="postsUsed"
              value={newSubscription.postsUsed}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contacts Used</label>
            <input
              type="number"
              name="contactsUsed"
              value={newSubscription.contactsUsed}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Subscription
        </button>
      </form>
    </div>
  );
};

export default AddSubscription;
