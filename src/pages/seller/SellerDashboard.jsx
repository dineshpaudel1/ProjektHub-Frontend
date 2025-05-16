import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import {
    FaFolderOpen,
    FaUser,
    FaMedal,
    FaArrowUp,
    FaArrowDown,
    FaCalendarAlt,
    FaCheckCircle
} from 'react-icons/fa';
import { Clock, ChevronRight } from 'lucide-react';

const StatCard = ({ title, value, icon, iconBg, change, changeType, navigateTo }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(navigateTo)} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 cursor-pointer border border-gray-100 relative overflow-hidden group">
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
                <div className={`${iconBg} text-white p-3 rounded-lg`}>{icon}</div>
            </div>
        </div>
    );
};

const ActivityItem = ({ title, time, description, icon, iconBg }) => (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
        <div className={`${iconBg} text-white p-2 rounded-lg flex-shrink-0`}>{icon}</div>
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

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [totalProjects, setTotalProjects] = useState(0);
    const [pendingQuestions, setPendingQuestions] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem("token");

            try {
                const projectRes = await axios.get("/seller/project/my-projects", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTotalProjects(projectRes.data?.data?.length || 0);

                const questionRes = await axios.get("/seller/interactions/pending-questions", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPendingQuestions(questionRes.data?.data || []);
            } catch (error) {
                console.error("❌ Failed to fetch dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1 flex items-center">
                    <FaCalendarAlt className="mr-2" size={14} />
                    {formattedDate} • {formattedTime}
                </p>
            </div>

            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Seller!</h2>
                <p className="opacity-90">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Projects"
                        value={totalProjects}
                        icon={<FaFolderOpen size={20} />}
                        iconBg="bg-blue-500"
                        change="12%"
                        changeType="increase"
                        navigateTo="/admin/adminproject"
                    />
                    <StatCard
                        title="Pending Questions"
                        value={pendingQuestions.length}
                        icon={<FaUser size={20} />}
                        iconBg="bg-green-600"
                        change="3%"
                        changeType="increase"
                        navigateTo="/admin/sellers"
                    />
                    <StatCard
                        title="Sold Projects"
                        value="12"
                        icon={<FaMedal size={20} />}
                        iconBg="bg-amber-500"
                        change="5%"
                        changeType="decrease"
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
                    {pendingQuestions.length > 0 ? pendingQuestions.map((q) => (
                        <ActivityItem
                            key={q.questionId}
                            title={`Question on "${q.projectName}"`}
                            time={new Date(q.createdAt).toLocaleString()}
                            description={`Asked by @${q.askedByUsername}: ${q.questionText}`}
                            icon={<FaUser size={16} />}
                            iconBg="bg-green-600"
                        />
                    )) : (
                        <div className="p-4 text-center text-sm text-gray-500">No recent questions.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
