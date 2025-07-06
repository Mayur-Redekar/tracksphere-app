import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { FaSyncAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = '/api/certifications';

export default function CertificationList() {
  const [certifications, setCertifications] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [updating, setUpdating] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchCertificates();
    const interval = setInterval(fetchCertificates, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();

      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return b._id.localeCompare(a._id);
      });

      setCertifications(sorted);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to fetch certifications');
    }
  };

  const handleStatusChange = (id, newStatus) =>
    setStatusUpdates((prev) => ({ ...prev, [id]: newStatus }));

  const handleUpdate = async (id) => {
    const updatedStatus = statusUpdates[id];
    if (!updatedStatus) return toast.error('❌ Please select a status before updating.');

    setUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setCertifications((prev) =>
        prev.map((cert) => (cert._id === id ? { ...cert, status: updatedStatus } : cert))
      );
      toast.success('✅ Status updated successfully!');
      setStatusUpdates((prev) => {
        const updates = { ...prev };
        delete updates[id];
        return updates;
      });
    } catch (err) {
      console.error(err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const filteredCertifications = certifications.filter((cert) => {
    const certDate = new Date(cert.date).toISOString().split('T')[0];
    const certMonth = String(new Date(cert.date).getMonth() + 1).padStart(2, '0');
    return (
      (cert.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.zedmsme.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedMonth || certMonth === selectedMonth) &&
      (!selectedDate || certDate === selectedDate) &&
      (!selectedStatus || cert.status === selectedStatus)
    );
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Unit Name & ZEDMSME"
          className="border px-3 py-2 rounded w-full sm:w-64 font-semibold"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="relative w-full sm:w-40">
          <select
            className="border px-3 py-2 rounded w-full pr-8 appearance-none font-semibold"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-3 text-gray-600 pointer-events-none">
            <FaCalendarAlt size={14} />
          </div>
        </div>

        <input
          type="date"
          className="border px-3 py-2 rounded w-full sm:w-44 font-semibold"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <div className="relative w-full sm:w-48">
          <select
            className="border px-3 py-2 rounded w-full pr-8 appearance-none font-semibold"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Bronze Certified">Bronze Certified</option>
            <option value="NC Raised">NC Raised</option>
            <option value="Reject">Reject</option>
          </select>
          <div className="absolute right-3 top-3 text-gray-600 pointer-events-none">
            <FaFilter size={14} />
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        {filteredCertifications.length === 0 ? (
          <p className="text-gray-500 font-semibold text-center">No certifications found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">Unit Name</th>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">ZEDMSME</th>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">Password</th>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">Date</th>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">Status</th>
                <th className="px-4 py-3 text-left text-indigo-700 font-bold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCertifications.map((cert) => (
                <tr
                  key={cert._id}
                  className={`hover:bg-indigo-50 transition ${
                    cert.status === 'Bronze Certified'
                      ? 'bg-yellow-50'
                      : cert.status === 'NC Raised'
                      ? 'bg-red-50'
                      : cert.status === 'Reject'
                      ? 'bg-gray-200'
                      : 'bg-white'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{cert.unitName}</td>
                  <td className="px-4 py-3 text-gray-700">{cert.zedmsme}</td>
                  <td className="px-4 py-3 text-gray-700">{cert.password}</td>
                  <td className="px-4 py-3 text-gray-700">{new Date(cert.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border rounded px-2 py-1 bg-white"
                      value={statusUpdates[cert._id] ?? cert.status ?? ''}
                      onChange={(e) => handleStatusChange(cert._id, e.target.value)}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="Bronze Certified">Bronze Certified</option>
                      <option value="NC Raised">NC Raised</option>
                      <option value="Reject">Reject</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUpdate(cert._id)}
                      className={`${
                        updating[cert._id]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } text-white p-2 rounded-full shadow transition`}
                      disabled={updating[cert._id]}
                    >
                      {updating[cert._id] ? '...' : <FaSyncAlt />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-4">
        {filteredCertifications.length === 0 ? (
          <p className="text-gray-500 font-semibold text-center">No certifications found.</p>
        ) : (
          filteredCertifications.map((cert) => (
            <div
              key={cert._id}
              className={`shadow-md rounded-lg p-4 space-y-2 ${
                cert.status === 'Bronze Certified'
                  ? 'bg-yellow-50'
                  : cert.status === 'NC Raised'
                  ? 'bg-red-50'
                  : cert.status === 'Reject'
                  ? 'bg-gray-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-md font-bold text-gray-900 truncate">{cert.unitName}</h3>
                <span className="text-sm font-bold text-gray-700">
                  {new Date(cert.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-gray-700 text-sm font-semibold truncate">
                {cert.zedmsme} <span className="mx-2">|</span> {cert.password}
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1 bg-white flex-grow"
                  value={statusUpdates[cert._id] ?? cert.status ?? ''}
                  onChange={(e) => handleStatusChange(cert._id, e.target.value)}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Bronze Certified">Bronze Certified</option>
                  <option value="NC Raised">NC Raised</option>
                  <option value="Reject">Reject</option>
                </select>
                <button
                  onClick={() => handleUpdate(cert._id)}
                  className={`${
                    updating[cert._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white p-2 rounded-full shadow`}
                  disabled={updating[cert._id]}
                >
                  {updating[cert._id] ? '...' : <FaSyncAlt />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}






























