import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FaBars, FaTachometerAlt, FaWpforms, FaClipboardList } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UserProfilePanel from '../components/UserProfilePanel';
import Sidebar from '../components/Sidebar';
import CertificationForm from '../components/CertificationForm';
import CertificationList from '../components/CertificationList';
import Dashboard from '../components/Dashboard';

export default function UserDashboard() {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

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
    <div className={`relative min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'}`}>
      
      {/* Header */}
      <div className={`${showProfile ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="hidden md:flex items-center bg-[#fefefe] shadow px-3 py-2">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 w-60">
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

          <div className="bg-white shadow-md rounded-md px-6 py-4 flex-grow ml-2">
            <h1 className="text-2xl font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
          </div>
        </div>

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
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-3 text-indigo-600"
            >
              <FaBars size={20} />
            </button>
            <h1 className="text-lg font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-gray-300 mx-3"></div>

      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          menuItems={userMenuItems}
        />

        <div className={`flex-1 bg-[#fafafa] ${showProfile ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <main className="p-4">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'form' && <CertificationForm />}
            {activeTab === 'list' && <CertificationList />}
          </main>
        </div>
      </div>

      {/* Profile Panel */}
      <AnimatePresence>
        {showProfile && (
          <div ref={contentRef}>
            <UserProfilePanel
              user={storedUser}
              token={token}
              onClose={() => setShowProfile(false)}
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}








































































