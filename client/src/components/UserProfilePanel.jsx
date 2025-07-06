import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function UserProfilePanel({ user, token, onClose, darkMode, toggleTheme, handleLogout }) {
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    zedId: '',
    mobile: '',
    profilePic: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [preview, setPreview] = useState(null);
  const [passwords, setPasswords] = useState({ current: '', new: '' });

  const panelRef = useRef();

  // Fetch profile data on mount
  useEffect(() => {
    if (user && token) {
      axios
        .get(`/api/profile/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const profile = res.data;
          const loadedData = {
            username: profile.username || '',
            email: profile.email || '',
            zedId: profile.zedId || '',
            mobile: profile.mobile || '',
            profilePic: profile.profilePic || '',
          };
          setUserData(loadedData);
          setOriginalData(loadedData);
          if (profile.profilePic) {
            setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
          }
        })
        .catch(() => toast.error('Failed to load profile'));
    }
  }, [user, token]);

  useEffect(() => {
    const isNowDirty =
      userData.zedId !== originalData.zedId ||
      userData.mobile !== originalData.mobile ||
      userData.profilePic !== originalData.profilePic;
    setIsDirty(isNowDirty);
  }, [userData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData((prev) => ({ ...prev, profilePic: file }));
      setPreview(URL.createObjectURL(file));
      setIsDirty(true);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('zedId', userData.zedId);
      formData.append('mobile', userData.mobile);
      if (userData.profilePic instanceof File) {
        formData.append('profilePic', userData.profilePic);
      }

      const res = await axios.put(`/api/profile/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updated = res.data.user;
      setUserData((prev) => ({
        ...prev,
        profilePic: updated.profilePic,
      }));
      setOriginalData({
        ...userData,
        profilePic: updated.profilePic,
      });
      setIsDirty(false);
      if (updated.profilePic) {
        setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
      }
      toast.success('Profile updated!');
    } catch {
      toast.error('Profile update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await axios.put(
        `/api/profile/${user.id}/password`,
        {
          oldPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Password updated');
      setPasswords({ current: '', new: '' });
    } catch {
      toast.error('Password update failed');
    }
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="fixed top-0 left-0 w-full h-screen sm:w-[360px] z-50 bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-lg p-5 sm:rounded-r-2xl flex flex-col overflow-y-auto scrollbar-hidden"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
        <button onClick={onClose}>
          <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="profilePic" className="cursor-pointer block text-center">
          <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
            )}
          </div>
          <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
        </label>

        {['username', 'email'].map((field) => (
          <input
            key={field}
            disabled
            value={userData[field]}
            className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
          />
        ))}

        {['zedId', 'mobile'].map((field) => (
          <input
            key={field}
            name={field}
            value={userData[field]}
            onChange={handleChange}
            placeholder={field === 'zedId' ? 'ZED ID' : 'Mobile No'}
            className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
          />
        ))}

        <button
          onClick={handleUpdateProfile}
          disabled={saving || !isDirty}
          className={`w-full mt-2 text-white py-2 rounded transition ${
            saving
              ? 'bg-indigo-400 cursor-not-allowed'
              : isDirty
              ? 'bg-yellow-500 hover:bg-yellow-600'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
        </button>

        <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
          />
          <button
            onClick={handleUpdatePassword}
            className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={toggleTheme}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-all relative">
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </label>
        </div>

        <FiLogOut
          onClick={handleLogout}
          className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
        />
      </div>
    </motion.div>
  );
}
