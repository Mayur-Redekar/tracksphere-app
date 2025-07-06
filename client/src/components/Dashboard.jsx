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
} from 'recharts';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

// Mock data for the line chart
const initialData = [
  { month: 'Jan', certifications: 30 },
  { month: 'Feb', certifications: 50 },
  { month: 'Mar', certifications: 40 },
  { month: 'Apr', certifications: 60 },
  { month: 'May', certifications: 35 },
  { month: 'Jun', certifications: 55 },
  { month: 'Jul', certifications: 70 },
];

const updatedData = [
  { month: 'Jan', certifications: 45 },
  { month: 'Feb', certifications: 60 },
  { month: 'Mar', certifications: 50 },
  { month: 'Apr', certifications: 80 },
  { month: 'May', certifications: 45 },
  { month: 'Jun', certifications: 65 },
  { month: 'Jul', certifications: 90 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Dashboard() {
  const [data, setData] = useState(initialData);
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
    const timer = setTimeout(() => {
      setCardCounts({
        todayCertifications: 12,
        totalCertifications: 340,
        pendingCertifications: 25,
        completedCertifications: 303,
        ncRaised: 5,
        rejectedCertificates: 3,
        currentMonth: 60,
        previousMonth: 45,
      });
      setData(updatedData);
    }, 1500);

    return () => clearTimeout(timer);
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

      {/* Line Chart */}
     <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
  <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-[#344767] text-center sm:text-left">
    Monthly Certifications Overview
  </h2>
  
  {/* Added margin-left on mobile */}
  <div className="w-full overflow-x-auto">
    <div className="ml-[-35px] sm:ml-0"> {/* Move chart slightly left on mobile */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" tick={{ fill: '#666' }} />
          <YAxis tick={{ fill: '#666' }} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="certifications"
            stroke="#4a90e2"
            strokeWidth={3}
            dot={{ r: 5, fill: '#4a90e2', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#4a90e2', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
     </div>



    </div>
  );
}
