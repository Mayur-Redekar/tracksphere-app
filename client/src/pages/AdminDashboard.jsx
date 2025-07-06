import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [activeUserTab, setActiveUserTab] = useState('unverified');
  const [newUserCount, setNewUserCount] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null); // for modal

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const audioRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredUsers = res.data.filter((u) => u.role !== 'admin');
      setUsers(filteredUsers);
      const unverified = filteredUsers.filter(u => !u.isVerified).length;
      setNewUserCount(unverified);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();

    const eventSource = new EventSource('/api/users/events');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_user_registered') {
          fetchUsers();
          setAnimateBadge(true);
          if (audioRef.current) audioRef.current.play().catch(() => {});
          setTimeout(() => setAnimateBadge(false), 2000);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error, closing...');
      eventSource.close();
    };

    return () => eventSource.close();
  }, []);

  const handleToggleVerify = async (id, currentStatus) => {
    try {
      await axios.put(
        `/api/auth/verify-user/${id}`,
        { isVerified: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error verifying user:', err);
    }
  };

  const confirmDeleteUser = (id) => {
    setDeleteUserId(id);
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      await axios.delete(`/api/auth/delete-user/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setDeleteUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteUserId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteUserId(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const filteredUsers = users.filter(
    (u) => u.isVerified === (activeUserTab === 'verified')
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <audio ref={audioRef} src="/sounds/bell.wav" preload="auto" />

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">
            Admin Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <span className="text-xs sm:text-sm text-gray-600 break-all sm:inline hidden max-w-[200px]">
              {currentUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded hover:bg-red-600 text-xs sm:text-sm whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap space-x-0 sm:space-x-6 mb-4 border-b pb-2 gap-2 sm:gap-0">
          <button
            onClick={() => setActiveMainTab('dashboard')}
            className={`relative px-3 sm:px-4 py-2 font-medium transition rounded-t ${
              activeMainTab === 'dashboard'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveMainTab('users')}
            className={`relative px-3 sm:px-4 py-2 font-medium transition rounded-t flex items-center ${
              activeMainTab === 'users'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-500'
            }`}
          >
            Users
            {newUserCount > 0 && (
              <span
                className={`ml-2 inline-block bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full transition-transform ${
                  animateBadge ? 'animate-ping' : ''
                }`}
                title={`${newUserCount} new unverified user(s)`}
              >
                {newUserCount}
              </span>
            )}
          </button>
        </div>

        {/* User Sub Tabs */}
        {activeMainTab === 'users' && (
          <>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => setActiveUserTab('unverified')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow ${
                  activeUserTab === 'unverified'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unverified
              </button>
              <button
                onClick={() => setActiveUserTab('verified')}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow ${
                  activeUserTab === 'verified'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Verified
              </button>
            </div>

            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-left text-xs sm:text-sm">
                      <th className="px-3 sm:px-4 py-2 font-medium">Username</th>
                      <th className="px-3 sm:px-4 py-2 font-medium">Email</th>
                      <th className="px-3 sm:px-4 py-2 font-medium">ZED ID</th>
                      <th className="px-3 sm:px-4 py-2 font-medium">Mobile</th>
                      <th className="px-3 sm:px-4 py-2 font-medium text-center">Status</th>
                      <th className="px-3 sm:px-4 py-2 font-medium text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-3 sm:px-4 py-2">{user.username}</td>
                        <td className="px-3 sm:px-4 py-2 break-words max-w-[150px]">{user.email}</td>
                        <td className="px-3 sm:px-4 py-2">{user.zedId || '-'}</td>
                        <td className="px-3 sm:px-4 py-2">{user.mobile || '-'}</td>
                        <td className="text-center px-3 sm:px-4 py-2">
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={user.isVerified}
                              onChange={() => handleToggleVerify(user._id, user.isVerified)}
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-all relative">
                              <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                  user.isVerified ? 'translate-x-5' : ''
                                }`}
                              />
                            </div>
                          </label>
                        </td>
                        <td className="text-center px-3 sm:px-4 py-2">
                          <button
                            onClick={() => confirmDeleteUser(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Delete confirmation modal */}
        {deleteUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete this user?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



















