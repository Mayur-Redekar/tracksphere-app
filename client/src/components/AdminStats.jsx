import React from 'react';
import CountUp from 'react-countup';
import {
  FaUser,
  FaAward,
  FaMedal,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCalendarAlt,
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export default function AdminStats() {
  const cardData = [
    { title: 'Total Users', count: 120, icon: <FaUser className="text-blue-600" />, bg: 'bg-blue-200' },
    { title: 'Total Certifications', count: 85, icon: <FaAward className="text-green-600" />, bg: 'bg-green-200' },
    { title: 'Bronze Certified', count: 50, icon: <FaMedal className="text-yellow-500" />, bg: 'bg-yellow-200' },
    { title: 'NC Raised', count: 12, icon: <FaExclamationTriangle className="text-orange-600" />, bg: 'bg-orange-200' },
    { title: 'Rejected Certifications', count: 8, icon: <FaTimesCircle className="text-red-600" />, bg: 'bg-red-200' },
    { title: 'This Month', count: 28, icon: <FaCalendarAlt className="text-purple-600" />, bg: 'bg-purple-200' },
  ];

  const pieData = [
    { name: 'Completed', value: 400, color: '#34D399' },
    { name: 'Pending', value: 300, color: '#FBBF24' },
    { name: 'Rejected', value: 100, color: '#F87171' },
  ];

  const lineData = [
    { name: 'Jan', certifications: 30 },
    { name: 'Feb', certifications: 50 },
    { name: 'Mar', certifications: 80 },
    { name: 'Apr', certifications: 60 },
    { name: 'May', certifications: 70 },
    { name: 'Jun', certifications: 90 },
  ];

  const userCertifications = [
    { name: 'Alice Parkar', bc: 5, nc: 3, rc: 1 },
    { name: 'Bob', bc: 8, nc: 1, rc: 2 },
    { name: 'Charlie', bc: 6, nc: 4, rc: 3 },
    { name: 'David', bc: 4, nc: 2, rc: 5 },
    { name: 'Eva', bc: 60, nc: 0, rc: 1 },
    { name: 'John', bc: 10, nc: 2, rc: 3 },
    { name: 'Lisa', bc: 7, nc: 1, rc: 1 },
  ];

  const topUsers = [
    { name: 'Eva', certifications: 28, avatar: 'https://i.pravatar.cc/40?img=1' },
    { name: 'John', certifications: 22, avatar: 'https://i.pravatar.cc/40?img=2' },
    { name: 'Alice', certifications: 18, avatar: 'https://i.pravatar.cc/40?img=3' },
    { name: 'Charlie', certifications: 15, avatar: 'https://i.pravatar.cc/40?img=4' },
    { name: 'David', certifications: 12, avatar: 'https://i.pravatar.cc/40?img=5' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      {/* Cards */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-wrap justify-between gap-3">
          {cardData.map((card, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-3 rounded-lg ${card.bg} hover:scale-105 transition-transform h-24 w-[45%] sm:w-[45%] md:w-[30%] lg:w-[15%]`}
            >
              <div className="text-2xl">{card.icon}</div>
              <div>
                <p className="text-xs text-gray-700 mb-0.5">{card.title}</p>
                <p className="text-xl font-bold text-gray-900">{card.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Overview & Charts */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* User Certifications Overview */}
        <div className="bg-white rounded-xl shadow-md p-4 flex-1">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">User Certifications Overview</h2>

          <div className="flex gap-4 text-sm mb-3 flex-wrap">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400"></div> Bronze Certified</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-400"></div> NC Raised</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400"></div> Rejected Certifications</div>
          </div>

          <div
            className="space-y-2 overflow-y-auto pr-1"
            style={{
              maxHeight: '400px',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {userCertifications.map((user, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center text-sm bg-gray-50 p-2 rounded hover:scale-[1.02] transition-all duration-200"
              >
                <div className="font-medium text-gray-700 w-[60px] truncate mb-1 sm:mb-0">{user.name}</div>
                <div className="flex flex-col flex-1 ml-0 sm:ml-2 gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-[4px] bg-green-400 rounded" style={{ width: `${Math.min(user.bc * 10, 200)}px` }} />
                    <span className="text-xs">{user.bc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-[4px] bg-orange-400 rounded" style={{ width: `${Math.min(user.nc * 10, 200)}px` }} />
                    <span className="text-xs">{user.nc}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-[4px] bg-red-400 rounded" style={{ width: `${Math.min(user.rc * 10, 200)}px` }} />
                    <span className="text-xs">{user.rc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="bg-white rounded-xl shadow-md p-4 h-[250px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Certification Status</h2>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 h-[250px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Monthly Certifications Trend</h2>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="certifications"
                  stroke="#6366F1"
                  strokeWidth={3}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Active Users Leaderboard */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Top 5 Active Users (This Month)</h2>
        <div className="space-y-3">
          {topUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-600">{index + 1}</span>
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <span className="font-medium text-gray-800">{user.name}</span>
              </div>
              <div className="font-semibold text-indigo-600">
                <CountUp end={user.certifications} duration={1.5} /> certifications
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
