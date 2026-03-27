import React, { useState, useEffect } from 'react';
import { getIssues, updateIssueStatus } from '../services/api';
import {  LayoutDashboard, Search, Filter, RefreshCcw, Eye, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await getIssues(null, statusFilter !== 'All' ? statusFilter : null);
      setIssues(res.data);
    } catch (err) {
      console.error('Failed to fetch issues');
    }
    setLoading(false);
  };

  useEffect(() => {
    // Protection check
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchIssues();
  }, [statusFilter, navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      // Update local state to reflect change without refetching immediately
      setIssues(issues.map(issue => issue._id === id ? { ...issue, status: newStatus } : issue));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Stats calculation
  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length
  };

  return (
    <div className="bg-gray-50 flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <LayoutDashboard className="w-8 h-8 mr-3 text-primary-600" />
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-500">Manage, track, and resolve civic issues efficiently.</p>
          </div>
          <button 
            onClick={fetchIssues}
            className="mt-4 md:mt-0 flex items-center text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 hover:text-primary-600 transition-colors"
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-gray-500 mb-1">Total Issues</span>
            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-red-600 mb-1">Pending</span>
            <span className="text-3xl font-bold text-red-700">{stats.pending}</span>
          </div>
          <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-yellow-600 mb-1">In Progress</span>
            <span className="text-3xl font-bold text-yellow-700">{stats.inProgress}</span>
          </div>
          <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-green-600 mb-1">Resolved</span>
            <span className="text-3xl font-bold text-green-700">{stats.resolved}</span>
          </div>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Issue Registry</h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category & Severity</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status Action</th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500"><div className="inline-flex items-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-3"></div> Loading...</div></td></tr>
                ) : issues.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No issues found matching the criteria.</td></tr>
                ) : (
                  issues.map(issue => (
                    <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 line-clamp-1">{issue.title}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {issue._id.slice(-6)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded border bg-gray-100 text-gray-700 text-xs font-medium mr-2">{issue.category}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                           issue.severity === 'Critical' ? 'text-red-700 bg-red-100' :
                           issue.severity === 'High' ? 'text-orange-700 bg-orange-100' :
                           issue.severity === 'Medium' ? 'text-yellow-700 bg-yellow-100' : 'text-green-700 bg-green-100'
                        }`}>{issue.severity}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          <span className="truncate max-w-[120px]" title={`${issue.latitude}, ${issue.longitude}`}>
                            {issue.latitude?.toFixed(3)}, {issue.longitude?.toFixed(3)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          className={`text-sm rounded-lg border-0 font-semibold focus:ring-2 focus:ring-primary-500 p-2 cursor-pointer ${
                            issue.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link to={`/issue/${issue._id}`} className="inline-flex items-center text-primary-600 hover:text-primary-900 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
