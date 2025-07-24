import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRequirement = () => {
  const { requirementId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lookingFor: '',
    propertyType: '',
    bhkConfig: '',
    minBudget: '',
    maxBudget: '',
    preferredLocations: ['', '', ''],
    additionalRequirements: '',
    phoneNumber: '',
    userName: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
  if (!requirementId || isNaN(requirementId)) {
    console.warn("Invalid requirementId:", requirementId);
    return;
  }

  const fetchRequirement = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/requirement/${requirementId}`);
      const requirementData = response.data;
      setFormData({
        lookingFor: requirementData.lookingFor || '',
        propertyType: requirementData.propertyType || '',
        bhkConfig: requirementData.bhkConfig || '',
        minBudget: requirementData.minBudget || '',
        maxBudget: requirementData.maxBudget || '',
        preferredLocations: requirementData.preferredLocations || ['', '', ''],
        additionalRequirements: requirementData.additionalRequirements || '',
        phoneNumber: requirementData.phoneNumber || '',
        userName: requirementData.userName || '',
      });
    } catch (error) {
      console.error('Error fetching requirement:', error);
    }
  };

  fetchRequirement();
}, [requirementId]);


  const validateField = (name, value) => {
    switch (name) {
      case 'lookingFor':
        if (!value.trim()) return 'Please specify what you are looking for';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';
      case 'propertyType':
        if (!value.trim()) return 'Please specify the property type';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';
      case 'bhkConfig':
        if (!value.trim()) return 'Please specify BHK configuration';
        return '';
      case 'minBudget':
        if (!value) return 'Please enter starting budget';
        const startAmount = parseFloat(value);
        if (isNaN(startAmount) || startAmount <= 0) return 'Please enter a valid amount';
        if (startAmount < 1000) return 'Minimum budget should be ₹1,000';
        return '';
      case 'maxBudget':
        if (!value) return 'Please enter maximum budget';
        const endAmount = parseFloat(value);
        if (isNaN(endAmount) || endAmount <= 0) return 'Please enter a valid amount';
        if (endAmount < 5000) return 'Maximum budget should be ₹5,000';
        const startBudget = parseFloat(formData.minBudget);
        if (!isNaN(startBudget) && endAmount <= startBudget) {
          return 'Maximum budget should be greater than starting budget';
        }
        return '';
      case 'preferredLocations':
        const filledLocations = value.filter(loc => loc.trim() !== '');
        if (filledLocations.length === 0) return 'Please enter at least one location';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return 'Please enter your phone number';
        if (!/^\d{10}$/.test(value.trim())) return 'Please enter a valid phone number';
        return '';
      case 'userName':
        if (!value.trim()) return 'Please enter your name';
        if (value.trim().length < 2) return 'Please enter at least 2 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === 'additionalRequirements') return;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.preferredLocations];
    newLocations[index] = value;
    handleInputChange('preferredLocations', newLocations);
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const submissionData = {
        ...formData,
        preferredLocations: formData.preferredLocations.filter(location => location.trim() !== '')
      };

      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/requirement/update/${requirementId}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      navigate('/allrequirement');
    } catch (error) {
      console.error('Error updating requirement:', error);
      alert('There was an error updating the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClasses} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200`;
    } else if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClasses} border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200`;
    }
    return `${baseClasses} border-gray-300 hover:border-gray-400 focus:border-indigo-500`;
  };

  const ErrorMessage = ({ error }) => (
    error ? (
      <div className="flex items-center mt-1 text-red-600 text-xs animate-pulse">
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Requirement</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lookingFor">
                Looking For
              </label>
              <select
                id="lookingFor"
                name="lookingFor"
                value={formData.lookingFor}
                onChange={(e) => handleInputChange('lookingFor', e.target.value)}
                onBlur={() => handleBlur('lookingFor')}
                className={getInputClasses('lookingFor')}
              >
                <option value="" disabled>Select an option</option>
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
                <option value="PG/Hostel">PG/Hostel</option>
                <option value="Roommate">Roommate</option>
              </select>
              <ErrorMessage error={errors.lookingFor} />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="propertyType">
                Property Type
              </label>
              <input
                type="text"
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                onBlur={() => handleBlur('propertyType')}
                placeholder="e.g., Villa, Apartment, Bungalow, Studio"
                className={getInputClasses('propertyType')}
              />
              <ErrorMessage error={errors.propertyType} />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bhkConfig">
                BHK Configuration
              </label>
              <input
                type="text"
                id="bhkConfig"
                name="bhkConfig"
                value={formData.bhkConfig}
                onChange={(e) => handleInputChange('bhkConfig', e.target.value)}
                onBlur={() => handleBlur('bhkConfig')}
                placeholder="e.g., 1 BHK, 2 BHK, 3 BHK, Studio"
                className={getInputClasses('bhkConfig')}
              />
              <ErrorMessage error={errors.bhkConfig} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="minBudget">
                  Minimum Budget
                </label>
                <input
                  type="number"
                  id="minBudget"
                  name="minBudget"
                  value={formData.minBudget}
                  onChange={(e) => handleInputChange('minBudget', e.target.value)}
                  onBlur={() => handleBlur('minBudget')}
                  placeholder="Enter minimum budget"
                  className={getInputClasses('minBudget')}
                />
                <ErrorMessage error={errors.minBudget} />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxBudget">
                  Maximum Budget
                </label>
                <input
                  type="number"
                  id="maxBudget"
                  name="maxBudget"
                  value={formData.maxBudget}
                  onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                  onBlur={() => handleBlur('maxBudget')}
                  placeholder="Enter maximum budget"
                  className={getInputClasses('maxBudget')}
                />
                <ErrorMessage error={errors.maxBudget} />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Locations</label>
              {formData.preferredLocations.map((location, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    onBlur={() => handleBlur('preferredLocations')}
                    placeholder={`Location ${index + 1}`}
                    className={getInputClasses('preferredLocations')}
                  />
                </div>
              ))}
              <ErrorMessage error={errors.preferredLocations} />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalRequirements">
                Additional Requirements
              </label>
              <textarea
                id="additionalRequirements"
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                placeholder="Any specific requirements like parking, furnishing, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                  placeholder="Enter your phone number"
                  className={getInputClasses('phoneNumber')}
                />
                <ErrorMessage error={errors.phoneNumber} />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                  Your Name
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  onBlur={() => handleBlur('userName')}
                  placeholder="Enter your name"
                  className={getInputClasses('userName')}
                />
                <ErrorMessage error={errors.userName} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-lg text-white font-bold transition-all duration-300 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'}`}
            >
              {isSubmitting ? 'Updating...' : 'Update Requirement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequirement;
