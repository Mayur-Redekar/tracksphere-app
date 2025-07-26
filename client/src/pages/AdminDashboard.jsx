import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import axios from 'axios';
import { FaTachometerAlt, FaUsers, FaBars, FaCertificate } from 'react-icons/fa';

const Sidebar = lazy(() => import('../components/Sidebar'));
const AdminStats = lazy(() => import('../components/AdminStats'));
const AllCertificates = lazy(() => import('../components/AllCertificates'));

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeUserTab, setActiveUserTab] = useState('unverified');
  const [newUserCount, setNewUserCount] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const audioRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers = res.data.filter((u) => u.role !== 'admin');
      setUsers(allUsers);
      setNewUserCount(allUsers.filter((u) => !u.isVerified).length);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const es = new EventSource('/api/users/events');
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_user_registered') {
        fetchUsers();
        setAnimateBadge(true);
        audioRef.current?.play().catch(() => {});
        setTimeout(() => setAnimateBadge(false), 2000);
      }
    };
    es.onerror = () => es.close();
    return () => es.close();
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

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await axios.delete(`/api/auth/delete-user/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteUserId(null);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteUserId(null);
    setShowDeleteModal(false);
  };

  const unverifiedUsers = users.filter((u) => !u.isVerified);
  const verifiedUsers = users.filter((u) => u.isVerified);
  const filteredUsers = activeUserTab === 'verified' ? verifiedUsers : unverifiedUsers;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <audio ref={audioRef} src="/sounds/bell.wav" preload="auto" />
      <div className="sm:hidden bg-indigo-600 text-white flex items-center justify-between px-4 py-3">
        <div className="font-bold text-lg">
          {activeTab === 'dashboard'
            ? 'Admin Dashboard'
            : activeTab === 'users'
            ? 'User Management'
            : 'All Certificates'}
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Suspense fallback={<div className="text-center p-4">Loading Sidebar...</div>}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setIsSidebarOpen(false);
            }}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            menuItems={[
              { key: 'dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
              {
                key: 'users',
                icon: FaUsers,
                label: (
                  <div className="relative flex items-center">
                    Users
                    {newUserCount > 0 && (
                      <span
                        className={`ml-2 inline-block bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full ${
                          animateBadge ? 'animate-ping' : ''
                        }`}
                        title={`${newUserCount} new unverified user(s)`}
                      >
                        {newUserCount}
                      </span>
                    )}
                  </div>
                ),
              },
              { key: 'certificates', icon: FaCertificate, label: 'All Certificates' },
            ]}
            footer={
              <div className="mt-auto text-center text-white text-sm space-y-2">
                <p className="break-all px-2">{currentUser?.email}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            }
          />
        </Suspense>

        <div className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto md:ml-64">
          <div className="hidden sm:block bg-white shadow-md rounded-md px-6 py-4 mb-4">
            <h1 className="text-2xl font-bold text-indigo-600">
              {activeTab === 'dashboard'
                ? 'Admin Dashboard'
                : activeTab === 'users'
                ? 'User Management'
                : 'All Certificates'}
            </h1>
          </div>

          {activeTab === 'dashboard' && (
            <Suspense fallback={<div className="text-center p-4">Loading Admin Stats...</div>}>
              <AdminStats />
            </Suspense>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
              <div className="flex gap-3">
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

              <div className="overflow-x-auto">
                {filteredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm">No users found.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="bg-gray-50 rounded-lg shadow hover:shadow-md transition p-4 space-y-2"
                      >
                        <div className="font-semibold text-lg text-indigo-600">
                          {user.username}
                        </div>
                        <div className="text-sm text-gray-600 break-words">{user.email}</div>
                        <div className="text-sm">
                          ZED ID: <span className="font-medium">{user.zedId || '-'}</span>
                        </div>
                        <div className="text-sm">
                          Mobile: <span className="font-medium">{user.mobile || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="inline-flex relative items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={user.isVerified}
                              onChange={() => handleToggleVerify(user._id, user.isVerified)}
                            />
                            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 relative transition">
                              <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                  user.isVerified ? 'translate-x-5' : ''
                                }`}
                              />
                            </div>
                          </label>
                          <button
                            onClick={() => {
                              setDeleteUserId(user._id);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <Suspense fallback={<div className="text-center p-4">Loading Certificates...</div>}>
              <AllCertificates />
            </Suspense>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}






















































