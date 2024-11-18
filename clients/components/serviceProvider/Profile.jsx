// Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProviderNavBar from '../serviceProvider/ProviderNavBar';
import Footer from '../Homepage/Footer';

function Profile() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    city: '',
    photoUrl: '',
    certification: '',
    identityCard: '',
    password: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileNames, setFileNames] = useState({
    certification: '',
    identityCard: ''
  });
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  
  const [cities] = useState([
    { code: "TUN", name: "TUNIS", flag: "🇹🇳" },
    { code: "SFX", name: "SFAX", flag: "🇹🇳" },
    { code: "SUS", name: "SOUSSE", flag: "🇹🇳" },
    { code: "KRN", name: "KAIROUAN", flag: "🇹🇳" },
    { code: "BZT", name: "BIZERTE", flag: "🇹🇳" },
    { code: "GBS", name: "GABES", flag: "🇹🇳" },
    { code: "ARN", name: "ARIANA", flag: "🇹🇳" },
    { code: "GFS", name: "GAFSA", flag: "🇹🇳" },
    { code: "MNS", name: "MONASTIR", flag: "🇹🇳" },
    { code: "BNA", name: "BEN AROUS", flag: "🇹🇳" },
    { code: "KSR", name: "KASSERINE", flag: "🇹🇳" },
    { code: "MDN", name: "MEDENINE", flag: "🇹🇳" },
    { code: "NBL", name: "NABEUL", flag: "🇹🇳" },
    { code: "TTN", name: "TATAOUINE", flag: "🇹🇳" },
    { code: "BJA", name: "BEJA", flag: "🇹🇳" },
    { code: "JND", name: "JENDOUBA", flag: "🇹🇳" },
    { code: "MHD", name: "MAHDIA", flag: "🇹🇳" },
    { code: "SLN", name: "SILIANA", flag: "🇹🇳" },
    { code: "KEF", name: "KEF", flag: "🇹🇳" },
    { code: "TZR", name: "TOZEUR", flag: "🇹🇳" },
    { code: "MNB", name: "MANOUBA", flag: "🇹🇳" },
    { code: "ZGN", name: "ZAGHOUAN", flag: "🇹🇳" },
    { code: "KBL", name: "KEBILI", flag: "🇹🇳" }
  ]);

  useEffect(() => {
    fetchProfileData();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProfileData = async () => {
    setError(null);
    setLoading(true);
    const token = localStorage.getItem("authToken");
    
    try {
      const response = await fetch('http://localhost:3001/provider/profile', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      
      const mappedData = {
        username: data.username || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        city: data.city || '',
        photoUrl: data.photoUrl || '',
        certification: data.certification || '',
        identityCard: data.identityCard || '',
        password: ''
      };

      setFormData(mappedData);
      setOriginalData(mappedData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      city: city.name,
    });
    setIsCityDropdownOpen(false);
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasChanges = () => {
    return Object.keys(formData).some(key => {
      if (key === 'password' && formData[key] === '') {
        return false;
      }
      return formData[key] !== originalData[key];
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccessMessage('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only JPG, PNG, or GIF files');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Upload to Cloudinary
      const formDataImage = new FormData();
      formDataImage.append('file', file);
      formDataImage.append('upload_preset', 'ml_default2');

      const uploadRes = await fetch(
        'https://api.cloudinary.com/v1_1/dlg8j6m69/image/upload',
        {
          method: 'POST',
          body: formDataImage
        }
      );

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image to cloud storage');
      }

      const imageData = await uploadRes.json();
      const imageUrl = imageData.secure_url;

      // Update form data with the Cloudinary URL
      setFormData(prev => ({
        ...prev,
        [fieldName]: imageUrl
      }));
      
      setFileNames(prev => ({
        ...prev,
        [fieldName]: file.name
      }));

      setSuccessMessage('File uploaded successfully');
    } catch (error) {
      console.error('File processing error:', error);
      setError(error.message || 'Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }
  
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }
  
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only JPG, PNG, or GIF files');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);

      // Upload to Cloudinary
      const formDataImage = new FormData();
      formDataImage.append('file', file);
      formDataImage.append('upload_preset', 'ml_default2');

      const uploadRes = await fetch(
        'https://api.cloudinary.com/v1_1/dlg8j6m69/image/upload',
        {
          method: 'POST',
          body: formDataImage
        }
      );

      if (!uploadRes.ok) {
        throw new Error('Failed to upload image to cloud storage');
      }

      const imageData = await uploadRes.json();
      const imageUrl = imageData.secure_url;

      // Update form data with the Cloudinary URL
      setFormData(prev => ({
        ...prev,
        photoUrl: imageUrl
      }));

      setSuccessMessage('Profile photo uploaded successfully');
    } catch (error) {
      console.error('Photo upload error:', error);
      setError(error.message || 'Failed to upload profile photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\+?[\d\s-]{8,}$/;
    return phone === '' || re.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError('Valid email is required');
      return;
    }

    if (!hasChanges()) {
      setError('No changes to save');
      return;
    }

    setError(null);
    setSuccessMessage('');
    setLoading(true);
    
    try {
      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key] && 
            (key !== 'password' || formData[key] !== '')) {
          changedFields[key] = formData[key];
        }
      });

      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:3001/provider/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changedFields)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccessMessage('Profile updated successfully');
        setOriginalData(prev => ({
          ...prev,
          ...changedFields
        }));
        
        if (formData.password) {
          setFormData(prev => ({
            ...prev,
            password: ''
          }));
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProviderNavBar />
      <div className="min-h-screen bg-gradient-to-r from-[#0A165E] to-[#2B4DFF] p-4">
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-10 rounded-xl shadow-lg border border-gray-200 my-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <span className="text-blue-700 text-2xl font-bold mr-2">&larr;</span>
              <h2 className="text-3xl font-bold text-blue-700">Personal Information</h2>
            </div>
            <p className="text-gray-500">Please fill out the form below to update your personal information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-semibold text-gray-700">
                  ID Card
                </label>
                {formData.identityCard && (
                  <div className="mt-2 mb-2">
                    <img 
                      src={formData.identityCard}
                      alt="ID Card" 
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        console.error('Failed to load ID Card image');
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fileNames.identityCard}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  name="identityCard"
                  onChange={handleFileChange}
                  disabled={loading}
                  accept="image/*"
                  className="mt-2 block w-full rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 focus:ring-opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Certification
                </label>
                {formData.certification && (
                  <div className="mt-2 mb-2">
                    <img 
                      src={formData.certification}
                      alt="Certification" 
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        console.error('Failed to load Certification image');
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {fileNames.certification}
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  name="certification"
                  onChange={handleFileChange}
                  disabled={loading}
                  accept="image/*"
                  className="mt-2 block w-full rounded-lg border border-gray-300 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 focus:ring-opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                />
              </div>

              <div className="md:col-span-2 mb-8">
                <label className="block font-semibold text-gray-700 mb-2">Profile Photo</label>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-500">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-avatar.jpg';
                            console.error('Failed to load profile photo');
                          }}
                        />
                      ) : (
                        <span className="text-blue-500 text-5xl">
                          {formData.username ? formData.username.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <label htmlFor="photo-input" className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <input
                        id="photo-input"
                        type="file"
                        name="photoUrl"
                        onChange={handlePhotoUpload}
                        disabled={loading}
                        className="hidden"
                        accept="image/jpeg,image/png,image/gif"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Username*
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 text-gray-700 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={(e) => {
                    if (!validateEmail(e.target.value)) {
                      setError('Please enter a valid email address');
                    } else {
                      setError(null);
                    }
                  }}
                  placeholder="Enter your email"
                  required
                  className="mt-2 block w-full rounded-lg border border-gray-300 text-gray-700 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 focus:ring-opacity-50"
                />
                {!validateEmail(formData.email) && formData.email && (
                  <p className="mt-1 text-sm text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="mt-2 block w-full rounded-lg border border-gray-300 text-gray-700 p-3 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-100 focus:ring-opacity-50"
                />
              </div>

              {/* City Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className="block font-semibold text-gray-700 mb-2">
                  City
                </label>
                <div
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex items-center"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                >
                  {formData.city ? (
                    <span>{formData.city}</span>
                  ) : (
                    <span className="text-gray-400">Select City</span>
                  )}
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 mt-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </span>
                </div>

                {isCityDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-2">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Search a city"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCities.map((city) => (
                        <div
                          key={city.code}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleCitySelect(city)}
                        >
                          <span className="mr-2">{city.flag}</span>
                          <span>{city.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center space-y-4">
              <button 
                type="submit"
                disabled={loading || !hasChanges()}
                className={`
                  px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md
                  hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 
                  focus:ring-opacity-50 transition-colors duration-200
                  ${(loading || !hasChanges()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'}
                `}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </div>
                ) : 'Save Changes'}
              </button>
              
              {!hasChanges() && (
                <p className="text-sm text-gray-500">
                  No changes to save
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;