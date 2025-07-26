import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FaBars, FaTachometerAlt, FaWpforms, FaClipboardList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = lazy(() => import('../components/Sidebar'));
const UserProfilePanel = lazy(() => import('../components/UserProfilePanel'));
const CertificationForm = lazy(() => import('../components/CertificationForm'));
const CertificationList = lazy(() => import('../components/CertificationList'));
const Dashboard = lazy(() => import('../components/Dashboard'));

export default function UserDashboard() {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const contentRef = useRef();

  const userMenuItems = [
    { label: 'Dashboard', key: 'dashboard', icon: FaTachometerAlt },
    { label: 'Certification Form', key: 'form', icon: FaWpforms },
    { label: 'Certification List', key: 'list', icon: FaClipboardList },
  ];

  useEffect(() => {
    if (!storedUser || storedUser.role !== 'user' || !token) {
      navigate('/login');
    }
  }, [navigate, storedUser, token]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const tabTitles = {
    dashboard: 'Dashboard',
    form: 'Certification Form',
    list: 'Certification List',
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    if (showProfile) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  return (
    <div className="relative min-h-screen transition-colors duration-500">
      {/* Header */}
      <div className={`${showProfile ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Desktop Header */}
        <div className="hidden md:flex items-center bg-[#fefefe] shadow px-3 py-2 ml-64">
          <div className="bg-white shadow-md rounded-md px-6 py-4 w-full flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#344767]">{tabTitles[activeTab]}</h1>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowProfile(true)}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110"
              >
                <FiUser className="text-lg" />
              </motion.div>
              <span className="text-base text-[#4b4f68] font-medium">
                Welcome {storedUser?.username || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden bg-[#fefefe] shadow px-3 py-2">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 w-full mb-2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110"
            >
              <FiUser className="text-lg" />
            </motion.button>
            <span className="text-base text-[#4b4f68] font-medium">
              Welcome {storedUser?.username || 'User'}
            </span>
          </div>

          <div className="flex items-center bg-white shadow-md rounded-md px-4 py-3 w-full">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-3 text-indigo-600">
              <FaBars size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-300 mx-3"></div>

      {/* Main Content */}
      <div className="flex">
        <Suspense fallback={<div className="p-4">Loading Sidebar...</div>}>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            menuItems={userMenuItems}
          />
        </Suspense>

        <div
          className={`flex-1 bg-[#fafafa] overflow-auto transition-all duration-300 ${
            showProfile ? 'blur-sm pointer-events-none select-none' : ''
          } md:ml-64`}
        >
          <main className="p-4">
            {activeTab === 'dashboard' && (
              <Suspense fallback={<div className="text-center p-4">Loading Dashboard...</div>}>
                <Dashboard />
              </Suspense>
            )}
            {activeTab === 'form' && (
              <Suspense fallback={<div className="text-center p-4">Loading Form...</div>}>
                <CertificationForm />
              </Suspense>
            )}
            {activeTab === 'list' && (
              <Suspense fallback={<div className="text-center p-4">Loading List...</div>}>
                <CertificationList />
              </Suspense>
            )}
          </main>
        </div>
      </div>

      {/* Profile Panel */}
      <AnimatePresence>
        {showProfile && (
          <Suspense fallback={<div className="absolute top-20 right-6 z-50">Loading Profile...</div>}>
            <div ref={contentRef} className="absolute top-20 right-6 z-50">
              <UserProfilePanel
                user={storedUser}
                token={token}
                onClose={() => setShowProfile(false)}
                handleLogout={handleLogout}
              />
            </div>
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}














































































