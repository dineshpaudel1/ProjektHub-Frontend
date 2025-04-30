import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFolderOpen,
  FaUser,
  FaMedal,
  FaEllipsisH,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { Clock, ChevronRight } from 'lucide-react';

// Enhanced Card Component
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
            <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
              {changeType === 'increase' ?
                <FaArrowUp className="mr-1" size={12} /> :
                <FaArrowDown className="mr-1" size={12} />
              }
              <span>{change} from last month</span>
            </div>
          )}
        </div>

        <div className={`${iconBg} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
        <div className={`h-full ${iconBg.replace('bg-', 'bg-').replace('-500', '-400').replace('-600', '-500')
          }`} style={{ width: '60%' }}></div>
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ title, time, description, icon, iconBg }) => {
  return (
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
};

// Chart Component (Placeholder)
const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-gray-200 rounded-md px-2 py-1 bg-white">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="text-gray-500 hover:text-gray-700">
            <FaEllipsisH />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon, label, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 gap-2 hover:border-${color}-200`}
    >
      <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

// Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(currentTime);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
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

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="white" d="M39.9,-51.2C54.3,-39.9,70.2,-31.4,73.8,-19.2C77.4,-7,68.7,8.9,60.4,23.1C52.1,37.3,44.1,49.7,32.5,57.2C20.9,64.7,5.7,67.3,-8.1,64.8C-21.9,62.3,-34.4,54.7,-45.7,44.7C-57,34.7,-67.2,22.3,-70.8,7.7C-74.4,-6.9,-71.4,-23.8,-62.3,-36.1C-53.2,-48.4,-38,-56.2,-23.6,-67.5C-9.2,-78.8,5.4,-93.6,17.1,-89.9C28.8,-86.2,37.6,-64.1,39.9,-51.2Z" transform="translate(100 100)" />
          </svg>
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
          <StatCard
            title="Total Projects"
            value="24"
            icon={<FaFolderOpen size={20} />}
            iconBg="bg-blue-500"
            change="12% ↑"
            changeType="increase"
            navigateTo="/admin/adminproject"
          />
          <StatCard
            title="Total Sellers"
            value="18"
            icon={<FaUser size={20} />}
            iconBg="bg-green-600"
            change="8% ↑"
            changeType="increase"
            navigateTo="/admin/sellers"
          />
          <StatCard
            title="Sold Projects"
            value="12"
            icon={<FaMedal size={20} />}
            iconBg="bg-amber-500"
            change="5% ↓"
            changeType="decrease"
            navigateTo="/admin/sold-projects"
          />
          <StatCard
            title="Total Users"
            value="500"
            icon={<FaUser size={20} />}
            iconBg="bg-green-500"
            change="8% ↑"
            changeType="increase"
            navigateTo="/admin/sold-projects"
          />
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
          <ActivityItem
            title="New Project Added"
            time="2 hours ago"
            description="A new project 'E-commerce Dashboard' was added by John Doe."
            icon={<FaFolderOpen size={16} />}
            iconBg="bg-blue-500"
          />
          <ActivityItem
            title="New Seller Registered"
            time="5 hours ago"
            description="Sarah Johnson registered as a new seller."
            icon={<FaUser size={16} />}
            iconBg="bg-green-600"
          />
          <ActivityItem
            title="Project Sold"
            time="Yesterday"
            description="The 'Portfolio Website' project was sold for $1,200."
            icon={<FaMedal size={16} />}
            iconBg="bg-amber-500"
          />
          <ActivityItem
            title="System Update"
            time="2 days ago"
            description="The system was updated to version 2.4.0."
            icon={<FaCheckCircle size={16} />}
            iconBg="bg-purple-500"
          />
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