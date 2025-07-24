import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  IndianRupee, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Building,
  Trees,
  Wifi,
  Dumbbell,
  Waves,
  Shield,
  Heart,
  Share2,
  Camera,
  Star,
  Clock,
  Users,
  Square,
  Ruler,
  DollarSign,
  Warehouse,
  Mountain,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const ViewPropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/properties/get/${propertyId}`);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-red-600 mb-2">Error loading property</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/allproperty')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-600 mb-2">Property not found</p>
          <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/allproperty')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // const formatPrice = (price) => {
  //   if (!price) return 'Price not specified';
  //   return new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //     maximumFractionDigits: 0
  //   }).format(price);
  // };

  const formatPrice = (price) => {
  if (price >= 10000000) return `${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 1)}Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 1)}L`;
  if (price >= 1000) return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
  return price;
};

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPropertyTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'apartment': return <Building className="w-5 h-5" />;
      case 'villa': return <Home className="w-5 h-5" />;
      case 'plot': return <Square className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      case 'rented': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const amenityIcons = {
    'Parking': <Car className="w-5 h-5" />,
    'Gym': <Dumbbell className="w-5 h-5" />,
    'Swimming Pool': <Waves className="w-5 h-5" />,
    'Security': <Shield className="w-5 h-5" />,
    'WiFi': <Wifi className="w-5 h-5" />,
    'Garden': <Trees className="w-5 h-5" />,
    'default': <CheckCircle className="w-5 h-5" />
  };

  // Mock gallery images if propertyGallery is a string
  const galleryImages =
    property.propertyGallery
      ? typeof property.propertyGallery === 'string'
        ? [property.propertyGallery]
        : property.propertyGallery
      : ['/api/placeholder/800/600'];

  // const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/allproperty')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Properties</span>
              </button>
            </div>
            {/* <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg transition-colors ${isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/media/${galleryImages[selectedImage]}`}
          alt={property.propertyName}
          className="w-full h-96 object-cover transition duration-300"
        />

        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
              'available'
            )}`}
          >
            Available
          </span>
        </div>

        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
          <Camera className="w-4 h-4" />
          <span className="text-sm">{galleryImages.length} Photos</span>
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {galleryImages.map((image, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_BASE_URL}/media/${image}`}
                alt={`Property ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                  selectedImage === index
                    ? 'ring-2 ring-indigo-500'
                    : 'hover:opacity-75'
                }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>

            {/* Property Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.propertyName}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>
                      {property.address?.street && `${property.address.street}, `}
                      {property.address?.city && `${property.address.city}, `}
                      {property.address?.state && `${property.address.state}`}
                      {property.address?.zipCode && ` - ${property.address.zipCode}`}
                    </span>
                  </div>
                  {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Posted: {formatDate(property.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      ID: {property.propertyId}
                    </span>
                  </div> */}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    ₹{formatPrice(property.expectedPrice)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.propertyFor === 'RENT' ? 'Monthly Rent' : 'Total Price'}
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-2">
                    <Bed className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{property.bhkType || 'N/A'}</div>
                  <div className="text-xs text-gray-500">BHK Type</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Bath className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{property.bathroom || 'N/A'}</div>
                  <div className="text-xs text-gray-500">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <Square className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{property.totalBuildUpArea || 'N/A'}</div>
                  <div className="text-xs text-gray-500">Sq. Ft.</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
                    <Building className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{property.floor}/{property.totalFloors || 'N/A'}</div>
                  <div className="text-xs text-gray-500">Floor</div>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <DetailItem 
                    icon={<Home className="w-5 h-5" />}
                    label="Property Category"
                    value={property.category || 'Not specified'}
                  />
                  <DetailItem 
                    icon={getPropertyTypeIcon(property.apartmentType)}
                    label="Property Type"
                    value={property.apartmentType || 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Building className="w-5 h-5" />}
                    label="Building Type"
                    value={property.buildingType || 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Maximize className="w-5 h-5" />}
                    label="Carpet Area"
                    value={property.carpetArea ? `${property.carpetArea} sq. ft.` : 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Square className="w-5 h-5" />}
                    label="Plot Area"
                    value={property.plotArea ? `${property.plotArea} sq. ft.` : 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Ruler className="w-5 h-5" />}
                    label="Dimensions"
                    value={property.length && property.width ? `${property.length} x ${property.width} ft` : 'Not specified'}
                  />
                </div>

                <div className="space-y-4">
                  <DetailItem 
                    icon={<Calendar className="w-5 h-5" />}
                    label="Available From"
                    value={formatDate(property.availableFrom)}
                  />
                  <DetailItem 
                    icon={<Users className="w-5 h-5" />}
                    label="Preferred Tenants"
                    value={property.preferred_tenants || 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Home className="w-5 h-5" />}
                    label="Furnished Type"
                    value={property.furnishedType || 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Mountain className="w-5 h-5" />}
                    label="Balcony"
                    value={property.balcony ? `${property.balcony} Balconies` : 'Not specified'}
                  />
                  <DetailItem 
                    icon={<Warehouse className="w-5 h-5" />}
                    label="Boundary Wall"
                    value={property.boundaryWall || 'Not specified'}
                  />
                  <DetailItem 
                    icon={<IndianRupee className="w-5 h-5" />}
                    label="Monthly Maintenance"
                    value={property.monthlyMaintenance ? formatPrice(property.monthlyMaintenance) : 'Not specified'}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-indigo-600">
                        {amenityIcons[amenity.name] || amenityIcons.default}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact and Pricing */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {property.postedByUserName || 'Owner'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.postedByUserRole || 'Property Owner'}
                    </div>
                  </div>
                </div>
                
                {property.postedByUserPhoneNumber && (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{property.postedByUserPhoneNumber}</div>
                      <div className="text-sm text-gray-500">Phone Number</div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  {/* <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {property.postedByUserName || `User ${property.postedBy?.userId || 'N/A'}`}
                    </div>
                    <div className="text-sm text-gray-500">Posted By</div>
                  </div> */}
                </div>
              </div>

              {/* Pricing Details */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Price</span>
                    <span className="font-semibold text-gray-900">₹{formatPrice(property.expectedPrice)}</span>
                  </div>
                  {property.deposit && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Security Deposit</span>
                      <span className="font-semibold text-gray-900">₹{formatPrice(property.deposit)}</span>
                    </div>
                  )}
                  {property.monthlyMaintenance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Maintenance</span>
                      <span className="font-semibold text-gray-900">₹{formatPrice(property.monthlyMaintenance)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {/* <div className="mt-6 space-y-3">
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Contact Owner
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Schedule Visit
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  </div>
);

export default ViewPropertyDetails;