import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolderOpen, FaUser, FaMedal } from 'react-icons/fa';
import { HomeIcon } from 'lucide-react';

// Card Component
const Card = ({ title, value, icon, iconBg, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-300 shadow-sm hover:shadow-md transition px-6 pt-4 pb-3 w-full max-w-sm flex flex-col justify-between">
      {/* Top Content */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-800 font-semibold">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg} text-white text-xl`}>
          {icon}
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-300 w-full my-3" />

      {/* Bottom Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(navigateTo)}
          className="px-4 py-1.5 text-sm border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
        >
          View details
        </button>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">

      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total Projects"
          value="12+ More"
          icon={<FaFolderOpen />}
          iconBg="bg-orange-500"
          navigateTo="/admin/adminproject"
        />
        <Card
          title="Total Seller"
          value="12+ More"
          icon={<FaUser />}
          iconBg="bg-green-600"
          navigateTo="/sellers"
        />
        <Card
          title="Sold Projects"
          value="5 Units"
          icon={<FaMedal />}
          iconBg="bg-yellow-500"
          navigateTo="/sold-projects"
        />
      </div>
    </div>
  );
};

export default Dashboard;
