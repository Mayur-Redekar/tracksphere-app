import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaClipboardCheck,
  FaHourglassHalf,
  FaCalendarDay,
  FaExclamationTriangle,
  FaTimesCircle,
  FaRegCalendarPlus,
  FaRegCalendarAlt,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [cardCounts, setCardCounts] = useState({
    todayCertifications: 0,
    totalCertifications: 0,
    pendingCertifications: 0,
    completedCertifications: 0,
    ncRaised: 0,
    rejectedCertificates: 0,
    currentMonth: 0,
    previousMonth: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/users/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const stats = await res.json();

        setCardCounts({
          todayCertifications: stats.todayCertifications,
          totalCertifications: stats.totalCertifications,
          pendingCertifications: stats.pendingCertifications,
          completedCertifications: stats.completedCertifications,
          ncRaised: stats.ncRaised,
          rejectedCertificates: stats.rejectedCertificates,
          currentMonth: stats.currentMonth,
          previousMonth: stats.previousMonth,
        });

        setData(stats.lineChartData || []);
        setBarData(stats.barChartData || []);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { icon: <FaCalendarDay />, label: "Today's Certifications", value: cardCounts.todayCertifications, bg: '#e3f2fd', color: '#1565c0' },
    { icon: <FaClipboardCheck />, label: 'Total Certifications', value: cardCounts.totalCertifications, bg: '#fce4ec', color: '#ad1457' },
    { icon: <FaHourglassHalf />, label: 'Pending Certifications', value: cardCounts.pendingCertifications, bg: '#fff3e0', color: '#ef6c00' },
    { icon: <FaCheckCircle />, label: 'Completed Certifications', value: cardCounts.completedCertifications, bg: '#e8f5e9', color: '#2e7d32' },
    { icon: <FaExclamationTriangle />, label: 'NC Raised', value: cardCounts.ncRaised, bg: '#fffde7', color: '#fbc02d' },
    { icon: <FaTimesCircle />, label: 'Rejected Certificates', value: cardCounts.rejectedCertificates, bg: '#ffebee', color: '#c62828' },
    { icon: <FaRegCalendarPlus />, label: 'Current Month Certifications', value: cardCounts.currentMonth, bg: '#e8f0fe', color: '#1e88e5' },
    { icon: <FaRegCalendarAlt />, label: 'Previous Month Certifications', value: cardCounts.previousMonth, bg: '#ede7f6', color: '#6a1b9a' },
  ];

  return (
    <div className="p-4 space-y-6 -mt-3">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="p-3 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-4"
            style={{ backgroundColor: item.bg, color: item.color }}
          >
            <div className="text-2xl sm:text-3xl">{item.icon}</div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-center sm:text-left">{item.label}</p>
              <p className="text-lg sm:text-xl font-bold text-center sm:text-left">
                <CountUp end={item.value} duration={1.5} />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Line Chart Box */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow w-full lg:w-1/2 focus:outline-none outline-none">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-[#344767]">
            Monthly Certifications Overview
          </h2>
          <ResponsiveContainer width="108%" height={300} className={"ml-[-40px]"}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="certifications"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Box */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow w-full lg:w-1/2 focus:outline-none outline-none">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-[#344767]">
            Monthly Certifications by Status
          </h2>
          <ResponsiveContainer width="105%" height={300} className={"ml-[-30px]"}>
            <BarChart data={barData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Bronze Certified" fill="#2e7d32" animationDuration={1500} />
              <Bar dataKey="Not Certified" fill="#ef6c00" animationDuration={1500} />
              <Bar dataKey="Reject" fill="#c62828" animationDuration={1500} />
              <Bar dataKey="NC Raised" fill="#fbc02d" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
