import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getIssueById, updateIssueStatus } from '../services/api';
import { ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle, Image as ImageIcon } from 'lucide-react';

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const res = await getIssueById(id);
        setIssue(res.data);
      } catch (err) {
        setError('Failed to load issue details');
      } finally {
        setLoading(false);
      }
    };
    fetchIssueDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'The issue you are looking for does not exist or has been removed.'}</p>
        <Link to="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    if (status === 'Resolved') return <CheckCircle className="w-6 h-6 text-green-500" />;
    if (status === 'In Progress') return <Clock className="w-6 h-6 text-yellow-500" />;
    return <AlertTriangle className="w-6 h-6 text-red-500" />;
  };

  const getStatusBg = (status) => {
    if (status === 'Resolved') return 'bg-green-50 border-green-200 text-green-800';
    if (status === 'In Progress') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-red-50 border-red-200 text-red-800';
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header section w/ optional Image */}
          <div className="relative h-64 bg-gray-200 sm:h-80 w-full overflow-hidden flex items-center justify-center">
            {issue.image && issue.image !== 'no-photo.jpg' ? (
              <img 
                src={`${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000'}/uploads/${issue.image}`} 
                alt={issue.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <ImageIcon className="w-16 h-16 mb-2 opacity-50" />
                <span>No photo provided</span>
              </div>
            )}
            
            {/* Status Overlay */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center px-4 py-2 rounded-full border shadow-sm font-bold backdrop-blur-md bg-white/90 ${getStatusBg(issue.status)}`}>
                {getStatusIcon(issue.status)}
                <span className="ml-2">{issue.status}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
                {issue.category}
              </span>
              <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${
                issue.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                issue.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                issue.severity === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-green-50 text-green-700 border-green-200'
              }`}>
                {issue.severity} Severity
              </span>
              <div className="ml-auto text-sm text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                Reported {new Date(issue.createdAt).toLocaleDateString()}
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{issue.title}</h1>
            
            <div className="prose prose-primary max-w-none text-gray-600 mb-8">
              <p className="whitespace-pre-wrap">{issue.description}</p>
            </div>

            <div className="border-t border-gray-100 pt-8 mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-primary-600 mr-2" /> Location Details
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 font-mono mb-2">Lat: {issue.latitude}</p>
                  <p className="text-sm text-gray-700 font-mono mb-4">Lng: {issue.longitude}</p>
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${issue.latitude}&mlon=${issue.longitude}#map=15/${issue.latitude}/${issue.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                  >
                    Open in OpenStreetMap &rarr;
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-primary-600 mr-2" /> Admin Actions
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                  <p className="text-sm text-gray-600">Update the resolution status of this report:</p>
                  <select
                    value={issue.status}
                    onChange={(e) => {
                       updateIssueStatus(issue._id, e.target.value)
                        .then(() => setIssue({...issue, status: e.target.value}))
                        .catch(() => alert('Failed to update'));
                    }}
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 outline-none shadow-sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
