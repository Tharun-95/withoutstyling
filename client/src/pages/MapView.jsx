import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getIssues } from '../services/api';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';

// Fix for default marker icons in Leaflet + Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const MapView = () => {
  const [issues, setIssues] = useState([]);
  const [activeIssue, setActiveIssue] = useState(null);
  const [filter, setFilter] = useState('All');
  
  // Default to center of India if geolocation is not available
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [locationLoaded, setLocationLoaded] = useState(false);

  const fetchIssues = useCallback(async () => {
    try {
      const res = await getIssues(filter !== 'All' ? filter : null);
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch issues details');
    }
  }, [filter]);

  useEffect(() => {
    fetchIssues();
    
    // Poll for real-time map updates every 10 seconds
    const interval = setInterval(() => {
      fetchIssues();
    }, 10000);
    
    // Get user's current location to center map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setLocationLoaded(true);
      }, () => {
        setLocationLoaded(true); // default center if failed
      });
    } else {
      setLocationLoaded(true);
    }

    return () => clearInterval(interval);
  }, [fetchIssues]);

  const categories = ['All', 'Pothole', 'Garbage', 'Water Leak', 'Streetlight', 'Other'];

  const getCustomIcon = (status) => {
    const color = status === 'Resolved' ? 'green' : status === 'In Progress' ? 'orange' : 'red';
    
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-full">
      {/* Filters Overlay */}
      <div className="absolute top-4 left-4 z-[999] bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 max-w-sm w-full sm:w-80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-gray-900 font-bold">
            <Filter className="w-5 h-5" />
            <h2>Filter Issues</h2>
          </div>
          <div className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span> Live
          </div>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <div className="mt-4 space-y-2 text-xs text-gray-600">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Pending</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span> In Progress</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Resolved</div>
        </div>
      </div>

      {!locationLoaded ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map((issue) => (
             issue.latitude && issue.longitude && (
              <Marker
                key={issue._id}
                position={[issue.latitude, issue.longitude]}
                icon={getCustomIcon(issue.status)}
                eventHandlers={{
                  click: () => setActiveIssue(issue),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {issue.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${
                        issue.status === 'Resolved' ? 'text-green-700 bg-green-100' : 
                        issue.status === 'In Progress' ? 'text-orange-800 bg-orange-100' : 'text-red-700 bg-red-100'
                      }`}>
                        {issue.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mt-2 mb-1 text-sm">{issue.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">{issue.description}</p>
                    <Link 
                      to={`/issue/${issue._id}`}
                      className="block w-full text-center text-xs bg-primary-600 hover:bg-primary-700 text-white py-1.5 rounded transition-colors no-underline"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default MapView;