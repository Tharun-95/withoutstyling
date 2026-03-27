import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIssue } from '../services/api';
import { Camera, MapPin, AlertCircle, Loader2, Navigation } from 'lucide-react';

const ReportIssue = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    latitude: null,
    longitude: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['Pothole', 'Garbage', 'Water Leak', 'Streetlight', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    setLocationStatus('Locating...');
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus('Location found');
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          setLocationStatus('Unable to retrieve your location');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      setError('Please provide your location to report an issue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let dataToSend = formData;
      if (imageFile) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach(key => {
          if (formData[key] !== null) {
            formDataObj.append(key, formData[key]);
          }
        });
        formDataObj.append('image', imageFile);
        dataToSend = formDataObj;
      }

      await createIssue(dataToSend);
      setSuccess(true);
      setTimeout(() => navigate('/map'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform scale-100 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-500 mb-6">Thank you for helping keep our city safe. The local authorities have been notified.</p>
          <p className="text-sm text-gray-400">Redirecting to map view...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Report a Civic Issue</h1>
          <p className="mt-2 text-lg text-gray-500">Provide details so authorities can resolve it quickly.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start text-red-800">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Photo Upload Area */}
          <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors group relative border-b border-gray-100 overflow-hidden">
            {imagePreview ? (
              <div className="w-full h-full relative">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-10 h-10 text-white mb-2" />
                  <span className="text-sm font-medium text-white">Change photo</span>
                </div>
              </div>
            ) : (
              <>
                <Camera className="w-12 h-12 text-gray-400 group-hover:text-primary-500 mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Tap to take a photo or upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Huge pothole on Main St"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none bg-white"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <button
                  type="button"
                  onClick={getLocation}
                  className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg shadow-sm text-sm font-medium focus:outline-none transition-colors ${
                    formData.latitude ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {formData.latitude ? (
                    <><MapPin className="w-4 h-4 mr-2" /> Location Captured</>
                  ) : (
                    <><Navigation className="w-4 h-4 mr-2" /> Detect My Location</>
                  )}
                </button>
                {locationStatus && <p className="mt-1 text-xs text-gray-500">{locationStatus}</p>}
                {(formData.latitude && formData.longitude) && (
                  <p className="mt-1 text-xs text-gray-400 font-mono">
                    {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description Details</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                placeholder="Please describe the issue in detail..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting Report...</>
                ) : 'Submit Report'}
              </button>
            </div>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;
