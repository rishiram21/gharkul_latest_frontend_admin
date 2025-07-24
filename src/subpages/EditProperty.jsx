// src/subpages/EditProperty.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProperty = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { propertyId } = useParams();
  const pinCodeRegex = /^[1-9][0-9]{0,5}$/;

  const [enums, setEnums] = useState({
    propertyCategory: [],
    furnishedType: [],
    bhkType: [],
    propertyFor: [],
    apartmentType: [],
  });

  const [amenities, setAmenities] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [property, setProperty] = useState({
    propertyName: "",
    apartmentType: "",
    bhkType: "",
    floor: "",
    balcony: 0,
    bathroom: 0,
    totalFloors: "",
    totalBuildUpArea: "",
    carpetArea: "",
    area: "",
    state: "",
    pincode: "",
    expectedDeposit: "",
    monthlyMaintenance: "",
    availableFrom: "",
    preferredTenants: "",
    furnishedType: "",
    expectedPrice: "",
    description: "",
    buildingType: "",
    plotArea: "",
    length: "",
    width: "",
    boundaryWall: "",
    selectedAmenities: [],
    status: "",
  });

  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const formatBHK = (bhkEnum) => {
  if (!bhkEnum) return 'BHK';

  // Remove leading underscore
  const cleanEnum = bhkEnum.startsWith('_') ? bhkEnum.slice(1) : bhkEnum;

  const parts = cleanEnum.split('_');

  // RK case
  if (parts.length === 2 && parts[1] === 'RK') {
    return `${parts[0]} RK`;
  }

  // BHK cases (remove last part 'BHK' and join the rest with dot)
  const bhkNumber = parts.slice(0, -1).join('.'); // e.g. ['2', '5'] => "2.5"
  return `${bhkNumber} BHK`;
};

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/all_enum`);
        setEnums(response.data);
      } catch (error) {
        console.error("Error fetching enums:", error);
      }
    };

    const fetchAmenities = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/amenities/get`);
        const data = await response.json();
        setAmenities(data);
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };

    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/get/${propertyId}`);
        const propertyData = response.data;
        setProperty({
          ...propertyData,
          area: propertyData.address?.area || "",
          state: propertyData.address?.state || "",
          pincode: propertyData.address?.pinCode || "",
          selectedAmenities: propertyData.selectedAmenities || [],
          status: propertyData.status || "",
        });
        setPropertyType(propertyData.category || "");
        setTransactionType(propertyData.propertyFor || "");
        setSelectedFiles(propertyData.propertyGallery ? propertyData.propertyGallery.split(',') : []);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchEnums();
    fetchAmenities();
    fetchPropertyDetails();
  }, [propertyId]);

  const handleAmenityChange = (amenityId) => {
    setProperty((prevState) => {
      const selectedAmenities = prevState.selectedAmenities || [];
      return {
        ...prevState,
        selectedAmenities: selectedAmenities.includes(amenityId)
          ? selectedAmenities.filter((id) => id !== amenityId)
          : [...selectedAmenities, amenityId],
      };
    });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > 8) {
      toast.error("You can upload a maximum of 8 images.");
      return;
    }
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (!property.propertyName || !property.area || !property.expectedPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const propertyData = {
      propertyId: propertyId,
      postedByUserId: property.postedByUserId,
      category: propertyType,
      propertyFor: transactionType,
      apartmentType: property.apartmentType,
      propertyName: property.propertyName,
      bhkType: property.bhkType,
      floor: property.floor,
      balcony: property.balcony,
      bathroom: property.bathroom,
      totalFloors: property.totalFloors,
      totalBuildUpArea: property.totalBuildUpArea,
      carpetArea: property.carpetArea,
      address: {
        area: property.area,
        city: "Pune",
        state: property.state,
        pinCode: property.pincode,
      },
      buildingType: property.buildingType,
      plotArea: property.plotArea,
      length: property.length,
      width: property.width,
      boundaryWall: property.boundaryWall,
      expectedPrice: property.expectedPrice,
      deposit: property.expectedDeposit,
      monthlyMaintenance: property.monthlyMaintenance,
      availableFrom: property.availableFrom,
      preferred_tenants: property.preferredTenants,
      furnishedType: property.furnishedType,
      description: property.description,
      amenityIds: property.selectedAmenities,
      userPhoneNumber: property.userPhoneNumber,
      role: property.role,
      ownerName: property.ownerName,
      status: property.status,
    };

    formData.append("property", JSON.stringify(propertyData));

    if (selectedFiles.length === 0) {
      try {
        toast.info("No images uploaded. Attaching default image...");
        const response = await fetch("/default.png");
        const blob = await response.blob();
        const defaultFile = new File([blob], "default.png", { type: blob.type });
        formData.append("images", defaultFile);
      } catch (error) {
        console.error("Failed to load default image:", error);
        toast.error("Default image could not be attached. Please try again.");
        return;
      }
    } else {
      selectedFiles.forEach((file) => {
        if (!(typeof file === 'string')) {
          formData.append("images", file);
        }
      });
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/properties/update/${propertyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Property updated successfully:", response.data);
      toast.success("Property updated successfully!");
      navigate('/allproperty');
    } catch (error) {
      console.error("Error updating property:", error.response ? error.response.data : error.message);
      const errorMessage = error.response ? error.response.data.message : "Error updating property. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const renderBasicSelection = () => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        {enums.propertyCategory.map((type) => (
          <button
            key={type}
            type="button"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              propertyType === type
                ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            }`}
            onClick={() => setPropertyType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      {propertyType && (
        <div className="flex flex-wrap gap-3 mb-4">
          {enums.propertyFor
            .filter((type) => {
              if (propertyType === "RESIDENTIAL") {
                return type === "RENT" || type === "SELL" || type === "PG" || type === "HOSTEL";
              } else if (propertyType === "COMMERCIAL") {
                return type === "RENT" || type === "SELL";
              } else if (propertyType === "PLOT") {
                return type === "SELL" || type === "RESELL";
              }
              return false;
            })
            .map((type) => (
              <button
                key={type}
                type="button"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  transactionType === type
                    ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
                onClick={() => setTransactionType(type)}
              >
                {type}
              </button>
            ))}
        </div>
      )}
    </div>
  );

  const renderPropertyDetails = () => {
    if (!propertyType || !transactionType) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
            2
          </span>
          Property Details
        </h2>
        {propertyType === "RESIDENTIAL" && (transactionType === "RENT" || transactionType === "SELL") && (
          <>
            <input
              type="text"
              placeholder="Property Name"
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              name="propertyName"
              value={property.propertyName}
              onChange={handleInputChange}
            />
            <div className="flex flex-wrap gap-3 mb-3">
              {enums.apartmentType.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    property.apartmentType === type
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setProperty(prev => ({ ...prev, apartmentType: type }))}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="flex space-x-3 mb-3">
              <select
  className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  name="bhkType"
  value={property.bhkType}
  onChange={handleInputChange}
>
  <option value="">BHK Type</option>
  {enums.bhkType.map((type) => (
    <option key={type} value={type}>
      {formatBHK(type)}
    </option>
  ))}
</select>
              <input
                type="number"
                className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Total Floors"
                name="totalFloors"
                value={property.totalFloors}
                onChange={handleInputChange}
                min={1}
              />
              <input
                type="number"
                className="w-1/3 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Floor"
                name="floor"
                value={property.floor}
                onChange={handleInputChange}
                min={0}
              />
            </div>
            <div className="flex space-x-3 mb-3">
              <input
                type="text"
                placeholder="Built-up Area (sq.ft)"
                className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                name="totalBuildUpArea"
                value={property.totalBuildUpArea}
                onChange={handleInputChange}
              />
              <input
                type="text"
                placeholder="Carpet Area (sq.ft)"
                className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                name="carpetArea"
                value={property.carpetArea}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLocationDetails = () => {
    if (!propertyType || !transactionType) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
            3
          </span>
          Location Details
        </h2>
        <input
          type="text"
          placeholder="Area"
          className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          name="area"
          value={property.area}
          onChange={handleInputChange}
        />
        <div className="flex space-x-3 mb-3">
          <input
            type="text"
            placeholder="State"
            className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            name="state"
            value={property.state}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Pin Code"
            className="w-1/2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            name="pincode"
            value={property.pincode}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || pinCodeRegex.test(val)) {
                handleInputChange(e);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const renderPricingDetails = () => {
    if (!propertyType || !transactionType) return null;
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
            4
          </span>
          Pricing Details
        </h2>
        {propertyType === "RESIDENTIAL" && transactionType === "RENT" && (
          <>
            <div className="flex space-x-3 mb-3">
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Expected Rent (INR)"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  name="expectedPrice"
                  value={property.expectedPrice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  placeholder="Expected Deposit (INR)"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  name="expectedDeposit"
                  value={property.expectedDeposit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Monthly Maintenance (INR)"
                className="w-full p-3 border border-gray-300 rounded-xl mb-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                name="monthlyMaintenance"
                value={property.monthlyMaintenance}
                onChange={handleInputChange}
              />
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available From
            </label>
            <input
              type="date"
              placeholder="Available From"
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              name="availableFrom"
              value={property.availableFrom}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
            />
          </>
        )}
        {propertyType === "RESIDENTIAL" && transactionType === "SELL" && (
          <div className="w-full">
            <input
              type="text"
              placeholder="Expected Price (INR)"
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              name="expectedPrice"
              value={property.expectedPrice}
              onChange={handleInputChange}
            />
          </div>
        )}
      </div>
    );
  };

  const renderAmenities = () => {
    if (!propertyType || !transactionType || !amenities || !property.selectedAmenities) return null;

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
            5
          </span>
          Amenities
        </h2>
        <div className="flex flex-wrap gap-3">
          {amenities.map((amenity) => (
            <button
              key={amenity.amenityId}
              type="button"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                property.selectedAmenities.includes(amenity.amenityId)
                  ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={() => handleAmenityChange(amenity.amenityId)}
            >
              {amenity.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderPropertyPhotos = () => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
          6
        </span>
        Property Photos
      </h2>
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
        <p className="mb-2 text-gray-700">
          Upload 1–8 images (required)
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        {selectedFiles.length === 0 ? (
          <div className="flex justify-center mt-4">
            <img
              src="/default.png"
              alt="Default"
              className="w-40 h-40 object-cover rounded-lg border"
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={`Selected ${index}`}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStatusSection = () => (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold text-sm">
          7
        </span>
        Property Status
      </h2>
      <select
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        name="status"
        value={property.status}
        onChange={handleInputChange}
      >
        <option value="AVAILABLE">Available</option>
        <option value="SOLD">Sold</option>
        <option value="PENDING">Pending</option>
        <option value="RENTED">Rented</option>
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
            Edit Property
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Update the details of this property
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <form onSubmit={handleSubmit}>
            {renderBasicSelection()}
            {renderPropertyDetails()}
            {renderLocationDetails()}
            {renderPricingDetails()}
            {renderAmenities()}
            {renderPropertyPhotos()}
            {renderStatusSection()}
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                onClick={() => navigate('/allproperty')}
                className="w-1/2 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Update Property
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditProperty;
