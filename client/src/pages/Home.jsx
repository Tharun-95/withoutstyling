import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getIssues } from '../services/api';
import { AlertCircle, Clock, MapPin, CheckCircle, ArrowRight, Shield, Zap, Target } from 'lucide-react';

const Home = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await getIssues();
        // Top 3 issues
        setRecentIssues(res.data.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch issues');
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Resolved') return <CheckCircle className="w-5 h-5 text-secondary-600" />;
    if (status === 'In Progress') return <Clock className="w-5 h-5 text-accent-gold" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      Critical: 'bg-red-50 text-red-700 border-red-200',
      High: 'bg-orange-50 text-orange-700 border-orange-200',
      Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      Low: 'bg-secondary-50 text-secondary-700 border-secondary-200'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[severity] || colors.Medium}`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 pt-28 pb-36 sm:pt-36 sm:pb-48">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-x-0 top-0 h-full opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="absolute inset-x-0 bottom-0 text-gray-50 transform translate-y-1/2 flex justify-center z-0">
          <svg className="w-full h-auto max-w-7xl mx-auto" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/50 border border-primary-700 backdrop-blur-sm mb-8">
             <span className="flex h-2 w-2 rounded-full bg-secondary-400"></span>
             <span className="text-sm font-medium text-primary-100 tracking-wide">Empowering Urban Development</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
            Modernizing Civic <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-500">Infrastructure</span>
          </h1>
          <p className="mt-4 max-w-3xl text-lg sm:text-xl text-primary-200 mx-auto mb-10 leading-relaxed font-light">
            A centralized platform for citizens and authorities to report, track, and resolve urban issues efficiently.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/report" className="px-8 py-3.5 bg-secondary-500 text-white rounded-lg font-semibold text-base hover:bg-secondary-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              Report an Issue
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/map" className="px-8 py-3.5 bg-primary-800 text-white rounded-lg font-semibold text-base hover:bg-primary-700 border border-primary-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 text-primary-300" />
              View Map
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="relative z-20 -mt-16 sm:-mt-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Target className="w-6 h-6 text-secondary-600" />, title: "Precision Tracking", desc: "Geolocated issue reporting ensures pinpoint accuracy for authorities." },
            { icon: <Zap className="w-6 h-6 text-accent-gold" />, title: "Real-time Status", desc: "Monitor the resolution status of reported issues in real-time." },
            { icon: <Shield className="w-6 h-6 text-primary-600" />, title: "Secure & Verified", desc: "Enterprise-grade security protecting citizen data and reports." }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-200 flex flex-col items-start">
              <div className="bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center mb-6 border border-gray-100">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Issues Overview */}
      <section className="py-16 flex-grow relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 border-b border-gray-200 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-900 tracking-tight">Recent Reports</h2>
              <p className="text-gray-500 mt-2 text-base">Latest submissions from the community.</p>
            </div>
            <Link to="/map" className="hidden sm:flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors group mt-4 sm:mt-0 text-sm">
              View all reports <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : recentIssues.length === 0 ? (
            <div className="bg-white rounded-xl p-16 text-center border border-gray-100">
              <div className="bg-secondary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary-900 mb-2">No Active Issues</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">The system is currently reporting zero active municipal issues.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIssues.map(issue => (
                <Link to={`/issue/${issue._id}`} key={issue._id} className="block group h-full">
                  <div className="bg-white h-full flex flex-col p-6 rounded-xl border border-gray-200 hover:border-secondary-500 hover:shadow-md transition-all duration-200 relative">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex flex-wrap gap-2">
                        {getSeverityBadge(issue.severity)}
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md border border-primary-100">{issue.category}</span>
                      </div>
                      <div className="text-gray-400">
                        {getStatusIcon(issue.status)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-primary-900 mb-2 line-clamp-1 group-hover:text-secondary-600 transition-colors">{issue.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">{issue.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-secondary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View details
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/map" className="inline-flex items-center text-primary-700 font-medium bg-primary-50 px-6 py-2.5 rounded-lg border border-primary-100">
              View all reports <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
