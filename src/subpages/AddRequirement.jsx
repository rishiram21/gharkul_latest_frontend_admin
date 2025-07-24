import React, { useState } from 'react';

function AddRequirement() {
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
    status: 'ACTIVE'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key === 'additionalRequirements') return; // Optional field
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
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

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '';
    if (numAmount >= 10000000) {
      return `₹${(numAmount / 10000000).toFixed(1)}Cr`;
    } else if (numAmount >= 100000) {
      return `₹${(numAmount / 100000).toFixed(1)}L`;
    } else if (numAmount >= 1000) {
      return `₹${(numAmount / 1000).toFixed(1)}K`;
    }
    return `₹${numAmount.toLocaleString()}`;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
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
      const submissionData = {
        ...formData,
        preferredLocations: formData.preferredLocations.filter(location => location.trim() !== '')
      };

      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/requirement/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with an error:', errorData);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form submitted:', result);
      alert('🎉 Requirement posted successfully! We will connect you with suitable properties soon.');

      // Reset form
      setFormData({
        lookingFor: '',
        propertyType: '',
        bhkConfig: '',
        minBudget: '',
        maxBudget: '',
        preferredLocations: ['', '', ''],
        additionalRequirements: '',
        phoneNumber: '',
        userName: '',
        status: 'ACTIVE'
      });

      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-3 py-3 sm:px-4 sm:py-3 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base";

    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClasses} border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-200`;
    } else if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClasses} border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-200`;
    }

    return `${baseClasses} border-gray-300 hover:border-gray-400 focus:border-indigo-500`;
  };

  const ErrorMessage = ({ error }) => (
    error ? (
      <div className="flex items-center mt-2 text-red-600 text-xs sm:text-sm animate-pulse">
        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 001-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    ) : null
  );

  const SuccessIcon = ({ show }) => (
    show ? (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-4 px-3 sm:py-6 sm:px-4 lg:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-3 sm:mb-4 shadow-lg">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Post Your Property Requirement
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto px-2">
            Tell us exactly what you're looking for and we'll connect you with the perfect property matches
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-lg mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Form Progress</span>
            <span className="text-xs sm:text-sm font-medium text-indigo-600">
              {Math.round((Object.values(formData).filter(val =>
                Array.isArray(val) ? val.some(v => v.trim()) : val.trim()
              ).length / 9) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(Object.values(formData).filter(val =>
                  Array.isArray(val) ? val.some(v => v.trim()) : val.trim()
                ).length / 9) * 100}%`
              }}
            ></div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-6">
          {/* Row 1: Looking For */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">1</span>
              What are you looking for?
            </h2>
            <div className="relative">
              <select
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
              <SuccessIcon show={touched.lookingFor && !errors.lookingFor && formData.lookingFor} />
            </div>
            <ErrorMessage error={errors.lookingFor} />
          </div>

          {/* Row 2: Property Type & BHK Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Property Type */}
            <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">2</span>
                Property Type
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  onBlur={() => handleBlur('propertyType')}
                  placeholder="e.g., Villa, Apartment, Bungalow, Studio"
                  className={getInputClasses('propertyType')}
                />
                <SuccessIcon show={touched.propertyType && !errors.propertyType && formData.propertyType} />
              </div>
              <ErrorMessage error={errors.propertyType} />
            </div>

            {/* BHK Configuration */}
            <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">3</span>
                BHK Type
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={formData.bhkConfig}
                  onChange={(e) => handleInputChange('bhkConfig', e.target.value)}
                  onBlur={() => handleBlur('bhkConfig')}
                  placeholder="e.g., 1 BHK, 2 BHK, 3 BHK, Studio"
                  className={getInputClasses('bhkConfig')}
                />
                <SuccessIcon show={touched.bhkConfig && !errors.bhkConfig && formData.bhkConfig} />
              </div>
              <ErrorMessage error={errors.bhkConfig} />
            </div>
          </div>

          {/* Row 3: Budget Range */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">4</span>
              Budget Range
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Starting Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">₹</span>
                  <input
                    type="number"
                    value={formData.minBudget}
                    onChange={(e) => handleInputChange('minBudget', e.target.value)}
                    onBlur={() => handleBlur('minBudget')}
                    placeholder="Enter minimum budget"
                    className={`${getInputClasses('minBudget')} pl-6 sm:pl-8`}
                  />
                  <SuccessIcon show={touched.minBudget && !errors.minBudget && formData.minBudget} />
                </div>
                {formData.minBudget && !errors.minBudget && (
                  <div className="text-xs sm:text-sm text-indigo-600 mt-2 font-medium">
                    {formatCurrency(formData.minBudget)}
                  </div>
                )}
                <ErrorMessage error={errors.minBudget} />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Maximum Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">₹</span>
                  <input
                    type="number"
                    value={formData.maxBudget}
                    onChange={(e) => handleInputChange('maxBudget', e.target.value)}
                    onBlur={() => handleBlur('maxBudget')}
                    placeholder="Enter maximum budget"
                    className={`${getInputClasses('maxBudget')} pl-6 sm:pl-8`}
                  />
                  <SuccessIcon show={touched.maxBudget && !errors.maxBudget && formData.maxBudget} />
                </div>
                {formData.maxBudget && !errors.maxBudget && (
                  <div className="text-xs sm:text-sm text-indigo-600 mt-2 font-medium">
                    {formatCurrency(formData.maxBudget)}
                  </div>
                )}
                <ErrorMessage error={errors.maxBudget} />
              </div>
            </div>
          </div>

          {/* Row 4: Locations */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">5</span>
              Preferred Locations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formData.preferredLocations.map((location, index) => (
                <div key={index}>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Location {index + 1} {index === 0 && '*'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => handleLocationChange(index, e.target.value)}
                      onBlur={() => handleBlur('preferredLocations')}
                      placeholder={`Enter location ${index + 1}`}
                      className={getInputClasses('preferredLocations')}
                    />
                    <SuccessIcon show={location.trim() !== ''} />
                  </div>
                </div>
              ))}
            </div>
            <ErrorMessage error={errors.preferredLocations} />
          </div>

          {/* Row 5: Additional Requirements */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">6</span>
              Additional Requirements
              <span className="text-xs sm:text-sm text-gray-500 font-normal ml-2">(Optional)</span>
            </h2>
            <textarea
              value={formData.additionalRequirements}
              onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
              rows="4"
              placeholder="Any specific requirements like parking, furnishing, floor preference, amenities, pet-friendly, etc."
              className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 hover:border-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Row 6: Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">7</span>
                Phone Number
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                  placeholder="Enter your phone number"
                  className={getInputClasses('phoneNumber')}
                />
                <SuccessIcon show={touched.phoneNumber && !errors.phoneNumber && formData.phoneNumber} />
              </div>
              <ErrorMessage error={errors.phoneNumber} />
            </div>

            <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 text-white font-bold text-sm sm:text-base shadow-lg">8</span>
                Your Name
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleInputChange('userName', e.target.value)}
                  onBlur={() => handleBlur('userName')}
                  placeholder="Enter your name"
                  className={getInputClasses('userName')}
                />
                <SuccessIcon show={touched.userName && !errors.userName && formData.userName} />
              </div>
              <ErrorMessage error={errors.userName} />
            </div>
          </div>
        </div>

        {/* Enhanced Submit Button */}
        <div className="bg-white rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mt-4 sm:mt-6 lg:mt-8 border border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-xl text-base sm:text-lg font-bold transition-all duration-300 shadow-lg ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl'
            } text-white`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">Posting Your Requirement...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🏠</span>
                Post My Requirement
              </span>
            )}
          </button>
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
            Your requirement will be shared with verified agents and property owners in your area
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddRequirement;
