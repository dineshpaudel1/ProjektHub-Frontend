import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFolderOpen,
  FaUser,
  FaMedal,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
} from 'react-icons/fa';
import { Clock, ChevronRight } from 'lucide-react';
import { useProjectContext } from '../../context/ProjectContext';

const StatCard = ({ title, value, icon, iconBg, change, changeType, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(navigateTo)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-gray-100 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'increase' ? <FaArrowUp className="mr-1" size={12} /> : <FaArrowDown className="mr-1" size={12} />}
              <span>{change} from last month</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
        <div className={`h-full ${iconBg.replace('bg-', 'bg-').replace('-500', '-400').replace('-600', '-500')}`} style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, time, description, icon, iconBg }) => (
  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className={`${iconBg} text-white p-2 rounded-lg flex-shrink-0`}>
      {icon}
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-xs text-gray-500 flex items-center">
          <Clock size={12} className="mr-1" />
          {time}
        </span>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const { projects } = useProjectContext();
  const [sellerCount, setSellerCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [soldCount, setSoldCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    fetch("http://localhost:8080/api/seller/profile", { headers })
      .then(res => res.json())
      .then(data => setSellerCount(data.length || 0))
      .catch(console.error);

    fetch("http://localhost:8080/api/user/profile", { headers })
      .then(res => res.json())
      .then(data => setUserCount(data.length || 0))
      .catch(console.error);

    fetch("http://localhost:8080/api/sold/project", { headers })
      .then(res => res.json())
      .then(data => setSoldCount(data.length || 0))
      .catch(console.error);

    fetch("http://localhost:8080/api/admin/unapproved-sellers", { headers })
      .then(res => res.json())
      .then(data => setRecentActivities(data))
      .catch(console.error);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: 'numeric', hour12: true
  }).format(currentTime);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1 flex items-center">
              <FaCalendarAlt className="mr-2" size={14} />
              {formattedDate} • {formattedTime}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200"><path fill="white" d="M39.9,-51.2C54.3,-39.9..." transform="translate(100 100)" /></svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Admin!</h2>
          <p className="opacity-90 mb-4">Here's what's happening with your projects today.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Projects" value={projects?.length || 0} icon={<FaFolderOpen size={20} />} iconBg="bg-blue-500" change="12%" changeType="increase" navigateTo="/admin/adminproject" />
          <StatCard title="Total Sellers" value={sellerCount} icon={<FaUser size={20} />} iconBg="bg-green-600" change="8%" changeType="increase" navigateTo="/admin/sellers" />
          <StatCard title="Sold Projects" value={soldCount} icon={<FaMedal size={20} />} iconBg="bg-amber-500" change="5%" changeType="decrease" navigateTo="/admin/sold-projects" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Activity</h3>
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
            <ActivityItem
              key={index}
              title={`New Seller Request - ${activity.name}`}
              time={new Date(activity.createdAt).toLocaleString()}
              description={`Email: ${activity.email}`}
              icon={<FaUser size={16} />}
              iconBg="bg-green-600"
            />
          )) : (
            <p className="p-4 text-sm text-gray-500">No recent activities.</p>
          )}
        </div>

        <div className="p-4 text-center border-t border-gray-100">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
