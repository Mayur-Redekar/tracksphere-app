import React, { useState, useEffect } from 'react';
import { FaUserCheck } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import CountUp from 'react-countup';
import 'react-toastify/dist/ReactToastify.css';

const getTodayDate = () => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split('T')[0];
};

export default function CertificationForm() {
  const [formData, setFormData] = useState({
    unitName: '',
    zedmsme: 'ZEDMSME',
    password: '',
    date: getTodayDate(),
  });

  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Capitalize each word in unit name
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Check if date string is today
  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle form changes
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'unitName') {
      value = capitalizeWords(value);
    }
    setFormData({ ...formData, [name]: value });
  };

  // Validate form fields
  const validateForm = () => {
    const { unitName, zedmsme, password, date } = formData;

    if (!unitName.trim()) {
      toast.error('❌ Unit Name is required.');
      return false;
    }

    if (!/^ZEDMSME\d{4,7}$/.test(zedmsme)) {
      toast.error('❌ ZEDMSME must be followed by 4 to 7 digits (e.g., ZEDMSME12345).');
      return false;
    }

    if (password.length !== 4) {
      toast.error('❌ Password must be exactly 4 characters.');
      return false;
    }

    if (!date) {
      toast.error('❌ Date is required.');
      return false;
    }

    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit certification');

      toast.success('✅ Certification submitted successfully!');

      // Reset form fields after submit
      setFormData({
        unitName: '',
        zedmsme: 'ZEDMSME',
        password: '',
        date: getTodayDate(),
      });

      fetchAllCertifications(); // Refresh the list and recalc count
    } catch (error) {
      console.error(error);
      toast.error('❌ Failed to submit certification.');
    }

    setLoading(false);
  };

  // Fetch all certifications and calculate today's count
  const fetchAllCertifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/certifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch certifications');

      const data = await res.json();

      // Calculate today's certification count locally
      const countToday = data.filter((cert) => isToday(cert.date)).length;
      setTodayCount(countToday);
    } catch (err) {
      console.error('Error fetching certifications:', err);
      toast.error('❌ Failed to fetch certifications.');
    }
  };

  // On mount, fetch all certifications to get initial today's count
  useEffect(() => {
    fetchAllCertifications();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold text-[#344767] mb-6">Add Unit Data</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Box: Form */}
        <div className="flex-1 bg-[#f9fafb] p-6 rounded-lg shadow border border-gray-200">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col text-gray-700 font-medium">
              Unit Name
              <input
                type="text"
                name="unitName"
                value={formData.unitName}
                onChange={handleChange}
                placeholder="Enter Unit Name"
                className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              ZEDMSME
              <input
                type="text"
                name="zedmsme"
                value={formData.zedmsme}
                onChange={handleChange}
                placeholder="ZEDMSME12345"
                className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter 4 character password"
                className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                maxLength={4}
                required
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>

        {/* Right Box: Today's Certification Count */}
        <div className="w-full md:w-64 bg-indigo-50 p-6 rounded-lg shadow border border-indigo-200 flex flex-col items-center justify-center gap-3">
          <FaUserCheck className="text-indigo-600 text-5xl" />
          <p className="text-indigo-700 font-semibold text-lg">Today's Certifications</p>
          <p className="text-indigo-900 text-4xl font-bold">
            <CountUp end={todayCount} duration={1.5} />
          </p>
        </div>
      </div>
    </div>
  );
}
