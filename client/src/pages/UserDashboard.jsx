// code working fine 
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   // Theme on load
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   // Optimized fetchProfile
//   useEffect(() => {
//     let called = false;
//     const controller = new AbortController();

//     const fetchProfile = async () => {
//       try {
//         if (!called && storedUser?.id && token) {
//           called = true;
//           const res = await axios.get(`/api/profile/${storedUser.id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//             signal: controller.signal,
//           });

//           const profile = res.data;
//           setUserData({
//             username: profile.username || '',
//             email: profile.email || '',
//             zedId: profile.zedId || '',
//             mobile: profile.mobile || '',
//             profilePic: profile.profilePic || '',
//           });

//           if (profile.profilePic) {
//             setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//           }
//         }
//       } catch (err) {
//         if (err.name !== 'CanceledError') {
//           toast.error('Failed to load profile');
//         }
//       }
//     };

//     fetchProfile();

//     return () => controller.abort();
//   }, []); // ✅ Only once on mount

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);

//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });

//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }

//       toast.success('Profile updated!');
//     } catch (err) {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch (err) {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div
//       className={`relative min-h-screen transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       }`}
//     >
//       <ToastContainer position="top-right" autoClose={3000} />

//       {!showProfile && (
//         <div className="fixed top-5 left-5 z-50">
//           <button
//             onClick={() => setShowProfile(true)}
//             className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-105 transition"
//             aria-label="Open profile panel"
//           >
//             <FiUser className="text-xl" />
//           </button>
//         </div>
//       )}

//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             initial={{ x: '-100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '-100%' }}
//             transition={{ type: 'spring', stiffness: 200, damping: 30 }}
//             className="fixed top-0 left-0 h-screen w-[360px] bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl z-40 p-5 rounded-r-2xl flex flex-col justify-between"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)} aria-label="Close profile panel">
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4 overflow-hidden">
//               <div className="text-center">
//                 <label htmlFor="profilePic" className="cursor-pointer block">
//                   <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                     {preview ? (
//                       <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                     ) : (
//                       <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                     )}
//                   </div>
//                   <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 </label>
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </div>

//               <input
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 value={userData.username}
//                 disabled
//               />
//               <input
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 value={userData.email}
//                 disabled
//               />
//               <input
//                 name="zedId"
//                 value={userData.zedId}
//                 onChange={handleChange}
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 placeholder="ZED ID"
//               />
//               <input
//                 name="mobile"
//                 value={userData.mobile}
//                 onChange={handleChange}
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 placeholder="Mobile No"
//               />

//               <button
//                 onClick={handleUpdateProfile}
//                 disabled={saving}
//                 className={`w-full mt-2 ${
//                   saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
//                 } text-white py-2 rounded transition`}
//               >
//                 {saving ? 'Saving...' : 'Save Profile'}
//               </button>

//               <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-between px-1">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//                 title="Logout"
//                 role="button"
//                 tabIndex={0}
//                 aria-label="Logout"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

//working fine with beauty - 1 
// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   const profileRef = useRef(null); // ✅ Used for outside click detection

//   // Apply dark theme on load
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   // Fetch profile on mount
//   useEffect(() => {
//     let isMounted = true;
//     if (storedUser && token) {
//       axios
//         .get(`/api/profile/${storedUser.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           if (isMounted) {
//             const profile = res.data;
//             const loadedData = {
//               username: profile.username || '',
//               email: profile.email || '',
//               zedId: profile.zedId || '',
//               mobile: profile.mobile || '',
//               profilePic: profile.profilePic || '',
//             };
//             setUserData(loadedData);
//             setOriginalData(loadedData);
//             if (profile.profilePic) {
//               setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//             }
//           }
//         })
//         .catch(() => {
//           toast.error('Failed to load profile');
//         });
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Detect unsaved changes
//   useEffect(() => {
//     const isNowDirty =
//       userData.zedId !== originalData.zedId ||
//       userData.mobile !== originalData.mobile ||
//       (userData.profilePic instanceof File);
//     setIsDirty(isNowDirty);
//   }, [userData.zedId, userData.mobile, userData.profilePic, originalData]);

//   // Detect click outside profile panel to close it
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);
//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData((prev) => ({
//         ...prev,
//         profilePic: updated.profilePic,
//       }));
//       setOriginalData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });
//       setIsDirty(false);

//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }

//       toast.success('Profile updated!');
//     } catch (err) {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch (err) {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div
//       className={`relative min-h-screen transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       }`}
//     >
//       {!showProfile && (
//         <div className="fixed top-5 left-5 z-50">
//           <button
//             onClick={() => setShowProfile(true)}
//             className="w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-105 transition"
//             aria-label="Open profile panel"
//           >
//             <FiUser className="text-xl" />
//           </button>
//         </div>
//       )}

//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             ref={profileRef}
//             initial={{ x: '-100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '-100%' }}
//             transition={{ type: 'spring', stiffness: 200, damping: 30 }}
//             className="fixed top-0 left-0 h-screen w-[360px] bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl z-40 p-5 rounded-r-2xl flex flex-col justify-between"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)} aria-label="Close profile panel">
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4 overflow-hidden">
//               <div className="text-center">
//                 <label htmlFor="profilePic" className="cursor-pointer block">
//                   <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                     {preview ? (
//                       <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                     ) : (
//                       <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                     )}
//                   </div>
//                   <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 </label>
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </div>

//               <input
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 value={userData.username}
//                 disabled
//               />
//               <input
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 value={userData.email}
//                 disabled
//               />
//               <input
//                 name="zedId"
//                 value={userData.zedId}
//                 onChange={handleChange}
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 placeholder="ZED ID"
//               />
//               <input
//                 name="mobile"
//                 value={userData.mobile}
//                 onChange={handleChange}
//                 className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 placeholder="Mobile No"
//               />

//               <button
//                 onClick={handleUpdateProfile}
//                 disabled={saving || !isDirty}
//                 className={`w-full mt-2 transition text-white py-2 rounded ${
//                   saving
//                     ? 'bg-indigo-400 cursor-not-allowed'
//                     : isDirty
//                     ? 'bg-yellow-500 hover:bg-yellow-600'
//                     : 'bg-indigo-600 hover:bg-indigo-700'
//                 }`}
//               >
//                 {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
//               </button>

//               <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-between px-1">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//                 title="Logout"
//                 role="button"
//                 tabIndex={0}
//                 aria-label="Logout"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


//added profile animation and user icon animation
// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   const panelRef = useRef();

//   // Load theme
//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   // Fetch user profile
//   useEffect(() => {
//     let isMounted = true;
//     if (storedUser && token) {
//       axios
//         .get(`/api/profile/${storedUser.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           if (isMounted) {
//             const profile = res.data;
//             const loadedData = {
//               username: profile.username || '',
//               email: profile.email || '',
//               zedId: profile.zedId || '',
//               mobile: profile.mobile || '',
//               profilePic: profile.profilePic || '',
//             };
//             setUserData(loadedData);
//             setOriginalData(loadedData);
//             if (profile.profilePic) {
//               setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//             }
//           }
//         })
//         .catch(() => toast.error('Failed to load profile'));
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Detect unsaved changes
//   useEffect(() => {
//     const isNowDirty =
//       userData.zedId !== originalData.zedId ||
//       userData.mobile !== originalData.mobile ||
//       userData.profilePic !== originalData.profilePic;
//     setIsDirty(isNowDirty);
//   }, [userData.zedId, userData.mobile, userData.profilePic, originalData]);

//   // Handle outside click to close
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && panelRef.current && !panelRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       document.body.style.overflow = 'hidden'; // Lock scroll
//       window.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto'; // Restore scroll
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//       setIsDirty(true);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);
//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData((prev) => ({
//         ...prev,
//         profilePic: updated.profilePic,
//       }));
//       setOriginalData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });
//       setIsDirty(false);
//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }
//       toast.success('Profile updated!');
//     } catch (err) {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch (err) {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div className={`relative min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//       {!showProfile && (
//         <motion.button
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: 'spring', stiffness: 200 }}
//           onClick={() => setShowProfile(true)}
//           className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//         >
//           <FiUser className="text-xl" />
//         </motion.button>
//       )}

//       {showProfile && (
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm"></div>
//       )}

//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             ref={panelRef}
//             initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
//             animate={{ opacity: 1, scale: 1, rotate: 0 }}
//             exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
//             transition={{ type: 'spring', stiffness: 180, damping: 20 }}
//             className="fixed top-0 left-0 h-screen w-[360px] bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl z-50 p-5 rounded-r-2xl flex flex-col justify-between"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)} aria-label="Close profile panel">
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4 overflow-hidden">
//               <motion.label htmlFor="profilePic" className="cursor-pointer block text-center" whileHover={{ scale: 1.05 }}>
//                 <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                   {preview ? (
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                   )}
//                 </div>
//                 <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </motion.label>

//               {['username', 'email'].map((field) => (
//                 <motion.input
//                   key={field}
//                   disabled
//                   value={userData[field]}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               ))}

//               {['zedId', 'mobile'].map((field) => (
//                 <motion.input
//                   key={field}
//                   name={field}
//                   value={userData[field]}
//                   onChange={handleChange}
//                   placeholder={field === 'zedId' ? 'ZED ID' : 'Mobile No'}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                 />
//               ))}

//               <motion.button
//                 onClick={handleUpdateProfile}
//                 disabled={saving || !isDirty}
//                 className={`w-full mt-2 text-white py-2 rounded transition ${
//                   saving
//                     ? 'bg-indigo-400 cursor-not-allowed'
//                     : isDirty
//                     ? 'bg-yellow-500 hover:bg-yellow-600'
//                     : 'bg-indigo-600 hover:bg-indigo-700'
//                 }`}
//                 whileHover={{ scale: isDirty && !saving ? 1.03 : 1 }}
//               >
//                 {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
//               </motion.button>

//               <motion.div
//                 className="pt-2 border-t border-gray-300 dark:border-gray-700"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </motion.div>
//             </div>

//             <div className="mt-6 flex items-center justify-between px-1">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//                 title="Logout"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   const panelRef = useRef();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   useEffect(() => {
//     let isMounted = true;
//     if (storedUser && token) {
//       axios
//         .get(`/api/profile/${storedUser.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           if (isMounted) {
//             const profile = res.data;
//             const loadedData = {
//               username: profile.username || '',
//               email: profile.email || '',
//               zedId: profile.zedId || '',
//               mobile: profile.mobile || '',
//               profilePic: profile.profilePic || '',
//             };
//             setUserData(loadedData);
//             setOriginalData(loadedData);
//             if (profile.profilePic) {
//               setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//             }
//           }
//         })
//         .catch(() => toast.error('Failed to load profile'));
//     }
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   useEffect(() => {
//     const isNowDirty =
//       userData.zedId !== originalData.zedId ||
//       userData.mobile !== originalData.mobile ||
//       userData.profilePic !== originalData.profilePic;
//     setIsDirty(isNowDirty);
//   }, [userData.zedId, userData.mobile, userData.profilePic, originalData]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && panelRef.current && !panelRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//       setIsDirty(true);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);
//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData((prev) => ({
//         ...prev,
//         profilePic: updated.profilePic,
//       }));
//       setOriginalData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });
//       setIsDirty(false);
//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }
//       toast.success('Profile updated!');
//     } catch (err) {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch (err) {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div className={`relative min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
//       {!showProfile && (
//         <motion.button
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: 'spring', stiffness: 200 }}
//           onClick={() => setShowProfile(true)}
//           className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//         >
//           <FiUser className="text-xl" />
//         </motion.button>
//       )}

//       {showProfile && (
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm"></div>
//       )}

//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             ref={panelRef}
//             initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
//             animate={{ opacity: 1, scale: 1, rotate: 0 }}
//             exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
//             transition={{ type: 'spring', stiffness: 180, damping: 20 }}
//             className="fixed top-0 left-0 h-screen w-full sm:w-[360px] bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-xl z-50 p-5 rounded-none sm:rounded-r-2xl flex flex-col justify-between overflow-y-auto sm:overflow-hidden"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)} aria-label="Close profile panel">
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4 overflow-visible">
//               <motion.label htmlFor="profilePic" className="cursor-pointer block text-center" whileHover={{ scale: 1.05 }}>
//                 <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                   {preview ? (
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                   )}
//                 </div>
//                 <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </motion.label>

//               {['username', 'email'].map((field) => (
//                 <motion.input
//                   key={field}
//                   disabled
//                   value={userData[field]}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               ))}

//               {['zedId', 'mobile'].map((field) => (
//                 <motion.input
//                   key={field}
//                   name={field}
//                   value={userData[field]}
//                   onChange={handleChange}
//                   placeholder={field === 'zedId' ? 'ZED ID' : 'Mobile No'}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                 />
//               ))}

//               <motion.button
//                 onClick={handleUpdateProfile}
//                 disabled={saving || !isDirty}
//                 className={`w-full mt-2 text-white py-2 rounded transition ${
//                   saving
//                     ? 'bg-indigo-400 cursor-not-allowed'
//                     : isDirty
//                     ? 'bg-yellow-500 hover:bg-yellow-600'
//                     : 'bg-indigo-600 hover:bg-indigo-700'
//                 }`}
//                 whileHover={{ scale: isDirty && !saving ? 1.03 : 1 }}
//               >
//                 {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
//               </motion.button>

//               <motion.div
//                 className="pt-2 border-t border-gray-300 dark:border-gray-700"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//               >
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </motion.div>
//             </div>

//             <div className="mt-6 flex items-center justify-between px-1">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//                 title="Logout"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


//working code 
// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   const panelRef = useRef();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   useEffect(() => {
//     if (storedUser && token) {
//       axios
//         .get(`/api/profile/${storedUser.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const profile = res.data;
//           const loadedData = {
//             username: profile.username || '',
//             email: profile.email || '',
//             zedId: profile.zedId || '',
//             mobile: profile.mobile || '',
//             profilePic: profile.profilePic || '',
//           };
//           setUserData(loadedData);
//           setOriginalData(loadedData);
//           if (profile.profilePic) {
//             setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//           }
//         })
//         .catch(() => toast.error('Failed to load profile'));
//     }
//   }, []);

//   useEffect(() => {
//     const isNowDirty =
//       userData.zedId !== originalData.zedId ||
//       userData.mobile !== originalData.mobile ||
//       userData.profilePic !== originalData.profilePic;
//     setIsDirty(isNowDirty);
//   }, [userData, originalData]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && panelRef.current && !panelRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//       setIsDirty(true);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);
//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData((prev) => ({
//         ...prev,
//         profilePic: updated.profilePic,
//       }));
//       setOriginalData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });
//       setIsDirty(false);
//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }
//       toast.success('Profile updated!');
//     } catch {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div
//       className={`relative min-h-screen transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       }`}
//     >
//       {!showProfile && (
//         <motion.button
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ type: 'spring', stiffness: 200 }}
//           onClick={() => setShowProfile(true)}
//           className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//         >
//           <FiUser className="text-xl" />
//         </motion.button>
//       )}

//       {showProfile && (
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm"></div>
//       )}

//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             ref={panelRef}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//             className="fixed top-0 left-0 w-full h-screen sm:w-[360px] z-50 bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-lg p-5 sm:rounded-r-2xl flex flex-col overflow-y-auto scrollbar-hidden"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)}>
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4">
//               <label htmlFor="profilePic" className="cursor-pointer block text-center">
//                 <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                   {preview ? (
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                   )}
//                 </div>
//                 <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </label>

//               {['username', 'email'].map((field) => (
//                 <input
//                   key={field}
//                   disabled
//                   value={userData[field]}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//               ))}

//               {['zedId', 'mobile'].map((field) => (
//                 <input
//                   key={field}
//                   name={field}
//                   value={userData[field]}
//                   onChange={handleChange}
//                   placeholder={field === 'zedId' ? 'ZED ID' : 'Mobile No'}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//               ))}

//               <button
//                 onClick={handleUpdateProfile}
//                 disabled={saving || !isDirty}
//                 className={`w-full mt-2 text-white py-2 rounded transition ${
//                   saving
//                     ? 'bg-indigo-400 cursor-not-allowed'
//                     : isDirty
//                     ? 'bg-yellow-500 hover:bg-yellow-600'
//                     : 'bg-indigo-600 hover:bg-indigo-700'
//                 }`}
//               >
//                 {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
//               </button>

//               <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { FiUser, FiLogOut } from 'react-icons/fi';
// import { IoClose } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [isDirty, setIsDirty] = useState(false);
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     zedId: '',
//     mobile: '',
//     profilePic: '',
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [preview, setPreview] = useState(null);
//   const [passwords, setPasswords] = useState({ current: '', new: '' });

//   const panelRef = useRef();

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setDarkMode(true);
//       document.documentElement.classList.add('dark');
//     }
//   }, []);

//   useEffect(() => {
//     if (storedUser && token) {
//       axios
//         .get(`/api/profile/${storedUser.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const profile = res.data;
//           const loadedData = {
//             username: profile.username || '',
//             email: profile.email || '',
//             zedId: profile.zedId || '',
//             mobile: profile.mobile || '',
//             profilePic: profile.profilePic || '',
//           };
//           setUserData(loadedData);
//           setOriginalData(loadedData);
//           if (profile.profilePic) {
//             setPreview(`${import.meta.env.VITE_BACKEND_URL}${profile.profilePic}`);
//           }
//         })
//         .catch(() => toast.error('Failed to load profile'));
//     }
//   }, []);

//   useEffect(() => {
//     const isNowDirty =
//       userData.zedId !== originalData.zedId ||
//       userData.mobile !== originalData.mobile ||
//       userData.profilePic !== originalData.profilePic;
//     setIsDirty(isNowDirty);
//   }, [userData, originalData]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && panelRef.current && !panelRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       document.body.style.overflow = 'hidden';
//       window.addEventListener('mousedown', handleClickOutside);
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFile = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setUserData((prev) => ({ ...prev, profilePic: file }));
//       setPreview(URL.createObjectURL(file));
//       setIsDirty(true);
//     }
//   };

//   const handleUpdateProfile = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();
//       formData.append('username', userData.username);
//       formData.append('email', userData.email);
//       formData.append('zedId', userData.zedId);
//       formData.append('mobile', userData.mobile);
//       if (userData.profilePic instanceof File) {
//         formData.append('profilePic', userData.profilePic);
//       }

//       const res = await axios.put(`/api/profile/${storedUser.id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const updated = res.data.user;
//       setUserData((prev) => ({
//         ...prev,
//         profilePic: updated.profilePic,
//       }));
//       setOriginalData({
//         ...userData,
//         profilePic: updated.profilePic,
//       });
//       setIsDirty(false);
//       if (updated.profilePic) {
//         setPreview(`${import.meta.env.VITE_BACKEND_URL}${updated.profilePic}`);
//       }
//       toast.success('Profile updated!');
//     } catch {
//       toast.error('Profile update failed.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdatePassword = async () => {
//     try {
//       await axios.put(
//         `/api/profile/${storedUser.id}/password`,
//         {
//           oldPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success('Password updated');
//       setPasswords({ current: '', new: '' });
//     } catch {
//       toast.error('Password update failed');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   return (
//     <div
//       className={`relative min-h-screen transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       }`}
//     >
//       {/* Main content wrapper with blur when profile is open */}
//       <div
//         className={`transition-all duration-300 ${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {/* Profile Icon Button */}
//         {!showProfile && (
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 200 }}
//             onClick={() => setShowProfile(true)}
//             className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//           >
//             <FiUser className="text-xl" />
//           </motion.button>
//         )}

//         {/* Sample background content so blur is visible */}
//         <main className="p-10 max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold mb-6">Welcome, {userData.username || 'User'}!</h1>
//           <p className="text-lg">
//             This is your dashboard. Click the user icon to open your profile panel.
//           </p>
//           {/* Add more content here to see blur effect clearly */}
//           <div className="mt-10 p-5 bg-gray-100 rounded-lg shadow-md dark:bg-gray-800">
//             <p className="text-gray-700 dark:text-gray-300">
//               Some sample content behind the profile panel to demonstrate the blur effect.
//             </p>
//           </div>
//         </main>
//       </div>

//       {/* Profile Side Panel */}
//       <AnimatePresence>
//         {showProfile && (
//           <motion.div
//             ref={panelRef}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ type: 'spring', stiffness: 200, damping: 20 }}
//             className="fixed top-0 left-0 w-full h-screen sm:w-[360px] z-50 bg-gradient-to-br from-white to-indigo-100 dark:from-gray-800 dark:to-gray-900 shadow-lg p-5 sm:rounded-r-2xl flex flex-col overflow-y-auto scrollbar-hidden"
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-indigo-700 dark:text-white">My Profile</h2>
//               <button onClick={() => setShowProfile(false)}>
//                 <IoClose className="text-2xl text-gray-700 dark:text-white hover:text-red-500" />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4">
//               <label htmlFor="profilePic" className="cursor-pointer block text-center">
//                 <div className="w-20 h-20 mx-auto bg-white rounded-full overflow-hidden border-2 border-indigo-400 dark:border-gray-600 shadow-lg">
//                   {preview ? (
//                     <img src={preview} alt="Preview" className="w-full h-full object-cover" />
//                   ) : (
//                     <FiUser className="text-4xl text-gray-500 dark:text-white mt-5" />
//                   )}
//                 </div>
//                 <input type="file" id="profilePic" onChange={handleFile} className="hidden" />
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Tap to update photo</p>
//               </label>

//               {['username', 'email'].map((field) => (
//                 <input
//                   key={field}
//                   disabled
//                   value={userData[field]}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//               ))}

//               {['zedId', 'mobile'].map((field) => (
//                 <input
//                   key={field}
//                   name={field}
//                   value={userData[field]}
//                   onChange={handleChange}
//                   placeholder={field === 'zedId' ? 'ZED ID' : 'Mobile No'}
//                   className="rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//               ))}

//               <button
//                 onClick={handleUpdateProfile}
//                 disabled={saving || !isDirty}
//                 className={`w-full mt-2 text-white py-2 rounded transition ${
//                   saving
//                     ? 'bg-indigo-400 cursor-not-allowed'
//                     : isDirty
//                     ? 'bg-yellow-500 hover:bg-yellow-600'
//                     : 'bg-indigo-600 hover:bg-indigo-700'
//                 }`}
//               >
//                 {saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Save Profile'}
//               </button>

//               <div className="pt-2 border-t border-gray-300 dark:border-gray-700">
//                 <input
//                   type="password"
//                   placeholder="Current Password"
//                   value={passwords.current}
//                   onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
//                   className="w-full mb-2 rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <input
//                   type="password"
//                   placeholder="New Password"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
//                   className="w-full rounded px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300"
//                 />
//                 <button
//                   onClick={handleUpdatePassword}
//                   className="w-full mt-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </div>

//             <div className="mt-6 flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm text-gray-800 dark:text-white">Dark Mode</span>
//                 <label className="inline-flex relative items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={darkMode}
//                     onChange={toggleTheme}
//                   />
//                   <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-all relative">
//                     <div
//                       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
//                         darkMode ? 'translate-x-5' : ''
//                       }`}
//                     />
//                   </div>
//                 </label>
//               </div>

//               <FiLogOut
//                 onClick={handleLogout}
//                 className="text-xl text-red-600 dark:text-red-400 cursor-pointer hover:scale-110 transition"
//               />
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   // ✅ Close profile on clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         showProfile &&
//         contentRef.current &&
//         !contentRef.current.contains(e.target)
//       ) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
//       }`}
//     >
//       <div
//         className={`transition-all duration-300 ${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {!showProfile && (
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 200 }}
//             onClick={() => setShowProfile(true)}
//             className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//             aria-label="Open Profile Panel"
//           >
//             <FiUser className="text-xl" />
//           </motion.button>
//         )}

//         <main className="p-10 max-w-4xl mx-auto">
//           <h1 className="text-4xl font-bold mb-6">
//             Welcome, {storedUser?.username || 'User'}!
//           </h1>
//           <p className="text-lg">
//             This is your dashboard. Click the user icon to open your profile panel.
//           </p>
//         </main>
//       </div>

//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';
// import Sidebar from '../components/Sidebar';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen flex transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
//       }`}
//     >
//       <Sidebar />

//       <div
//         className={`flex-1 transition-all duration-300 ${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {!showProfile && (
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 200 }}
//             onClick={() => setShowProfile(true)}
//             className="fixed top-5 left-5 z-50 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:scale-110 transition"
//             aria-label="Open Profile Panel"
//           >
//             <FiUser className="text-xl" />
//           </motion.button>
//         )}

//         <main className="p-10">
//           <h1 className="text-4xl font-bold mb-6 text-[#344767]">
//             Welcome, {storedUser?.username || 'User'}!
//           </h1>
//           <p className="text-lg text-[#4b4f68]">
//             This is your dashboard. Click the user icon to open your profile panel.
//           </p>
//         </main>
//       </div>

//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';
// import Sidebar from '../components/Sidebar';
// import CertificationForm from '../components/CertificationForm';
// import CertificationList from '../components/CertificationList';
// import Dashboard from '../components/Dashboard';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
//       }`}
//     >
//       {/* Header */}
   
//    <div
//     className={`flex items-center bg-[#fefefe] shadow px-3 py-2 transition-all duration-300 ${
//     showProfile ? 'blur-sm pointer-events-none select-none' : ''
//     }`}
//   >
//   {/* Left: User (make bigger in width) */}
//   <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 flex-shrink-0 w-64">
//     <motion.button
//       initial={{ scale: 0 }}
//       animate={{ scale: 1 }}
//       transition={{ type: 'spring', stiffness: 200 }}
//       onClick={() => setShowProfile(true)}
//       className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
//       aria-label="Open Profile Panel"
//     >
//       <FiUser className="text-lg" />
//     </motion.button>
//     <span className="text-base text-[#4b4f68] font-medium">
//       Welcome {storedUser?.username || 'Mayur'}
//     </span>
//   </div>

//   {/* Center: Dashboard title */}
//   <div className="bg-white shadow-md rounded-md px-6 py-4 flex-grow ml-2">
//     <h1 className="text-2xl font-bold text-[#344767]">Dashboard</h1>
//   </div>

//   {/* Right: Empty */}
//   <div></div>
//   </div>





//       {/* Content */}
//       <div className="flex flex-1">
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//         <div
//           className={`flex-1 transition-all duration-300 ${
//             showProfile ? 'blur-sm pointer-events-none select-none' : ''
//           }`}
//         >
//           <main className="p-6">
//             {activeTab === 'dashboard' && <Dashboard />}
//             {activeTab === 'form' && <CertificationForm />}
//             {activeTab === 'list' && <CertificationList />}
//           </main>
//         </div>
//       </div>

//       {/* Profile Panel */}
//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';
// import Sidebar from '../components/Sidebar';
// import CertificationForm from '../components/CertificationForm';
// import CertificationList from '../components/CertificationList';
// import Dashboard from '../components/Dashboard';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`flex items-center bg-[#fefefe] shadow px-3 py-2 transition-all duration-300 ${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {/* Left: User */}
//         <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 flex-shrink-0 w-64">
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 200 }}
//             onClick={() => setShowProfile(true)}
//             className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
//             aria-label="Open Profile Panel"
//           >
//             <FiUser className="text-lg" />
//           </motion.button>
//           <span className="text-base text-[#4b4f68] font-medium">
//             Welcome {storedUser?.username || 'Mayur'}
//           </span>
//         </div>

//         {/* Center: Dashboard title */}
//         <div className="bg-white shadow-md rounded-md px-6 py-4 flex-grow ml-2">
//           <h1 className="text-2xl font-bold text-[#344767]">Dashboard</h1>
//         </div>

//         {/* Right: Empty */}
//         <div></div>
//       </div>

//       {/* Divider */}
//       <div className="w-full h-[1px] bg-gray-200"></div>

//       {/* Content */}
//       <div className="flex flex-1 bg-[#f7f9fc]">
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//         <div
//           className={`flex-1 transition-all duration-300 ${
//             showProfile ? 'blur-sm pointer-events-none select-none' : ''
//           }`}
//         >
//           <main className="p-4"> {/* Reduced padding */}
//             {activeTab === 'dashboard' && <Dashboard />}
//             {activeTab === 'form' && <CertificationForm />}
//             {activeTab === 'list' && <CertificationList />}
//           </main>
//         </div>
//       </div>

//       {/* Profile Panel */}
//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


//full working code with all functinalities
// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';
// import Sidebar from '../components/Sidebar';
// import CertificationForm from '../components/CertificationForm';
// import CertificationList from '../components/CertificationList';
// import Dashboard from '../components/Dashboard';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const tabTitles = {
//     dashboard: 'Dashboard',
//     form: 'Certification Form',
//     list: 'Certification List',
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`flex items-center bg-[#fefefe] shadow px-3 py-2 transition-all duration-300 ${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {/* Left: User */}
//         <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 flex-shrink-0 w-64">
//           <motion.button
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 200 }}
//             onClick={() => setShowProfile(true)}
//             className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
//             aria-label="Open Profile Panel"
//           >
//             <FiUser className="text-lg" />
//           </motion.button>
//           <span className="text-base text-[#4b4f68] font-medium">
//             Welcome {storedUser?.username || 'Mayur'}
//           </span>
//         </div>

//         {/* Center: Dynamic Dashboard title */}
//         <div className="bg-white shadow-md rounded-md px-6 py-4 flex-grow ml-2">
//           <h1 className="text-2xl font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
//         </div>

//         <div></div>
//       </div>

//       <div className="h-[1px] bg-gray-300 mx-3"></div> {/* small line below header */}

//       {/* Content */}
//       <div className="flex flex-1">
//         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

//         <div
//           className={`flex-1 bg-[#fafafa] transition-all duration-300 ${
//             showProfile ? 'blur-sm pointer-events-none select-none' : ''
//           }`}
//         >
//           <main className="p-4">
//             {activeTab === 'dashboard' && <Dashboard />}
//             {activeTab === 'form' && <CertificationForm />}
//             {activeTab === 'list' && <CertificationList />}
//           </main>
//         </div>
//       </div>

//       {/* Profile Panel */}
//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// //mobile responsive
// import React, { useState, useEffect, useRef } from 'react';
// import { FiUser } from 'react-icons/fi';
// import { FaBars } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import UserProfilePanel from '../components/UserProfilePanel';
// import Sidebar from '../components/Sidebar';
// import CertificationForm from '../components/CertificationForm';
// import CertificationList from '../components/CertificationList';
// import Dashboard from '../components/Dashboard';

// export default function UserDashboard() {
//   const token = localStorage.getItem('token');
//   const storedUser = JSON.parse(localStorage.getItem('user'));

//   const [showProfile, setShowProfile] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const contentRef = useRef();

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/login';
//   };

//   const tabTitles = {
//     dashboard: 'Dashboard',
//     form: 'Certification Form',
//     list: 'Certification List',
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (showProfile && contentRef.current && !contentRef.current.contains(e.target)) {
//         setShowProfile(false);
//       }
//     };

//     if (showProfile) {
//       window.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showProfile]);

//   return (
//     <div
//       className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
//         darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
//       }`}
//     >
//       {/* Header */}
//       <div
//         className={`${
//           showProfile ? 'blur-sm pointer-events-none select-none' : ''
//         }`}
//       >
//         {/* Desktop & Tablet Header */}
//         <div className="hidden md:flex items-center bg-[#fefefe] shadow px-3 py-2 transition-all duration-300">
//           {/* Left: User */}
//           <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 flex-shrink-0 w-60">
//             <motion.button
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: 'spring', stiffness: 200 }}
//               onClick={() => setShowProfile(true)}
//               className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
//               aria-label="Open Profile Panel"
//             >
//               <FiUser className="text-lg" />
//             </motion.button>
//             <span className="text-base text-[#4b4f68] font-medium">
//               Welcome {storedUser?.username || 'Mayur'}
//             </span>
//           </div>

//           {/* Center: Dynamic Dashboard title */}
//           <div className="bg-white shadow-md rounded-md px-6 py-4 flex-grow ml-2">
//             <h1 className="text-2xl font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
//           </div>

//           <div></div>
//         </div>

//         {/* Mobile Header */}
//         <div className="md:hidden bg-[#fefefe] shadow px-3 py-2">
//           {/* Row 1: User full width */}
//           <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 w-full mb-2">
//             <motion.button
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ type: 'spring', stiffness: 200 }}
//               onClick={() => setShowProfile(true)}
//               className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
//               aria-label="Open Profile Panel"
//             >
//               <FiUser className="text-lg" />
//             </motion.button>
//             <span className="text-base text-[#4b4f68] font-medium">
//               Welcome {storedUser?.username || 'Mayur'}
//             </span>
//           </div>

//           {/* Row 2: Toggle sidebar + Title */}
//           <div className="flex items-center bg-white shadow-md rounded-md px-4 py-3 w-full">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="mr-3 text-indigo-600"
//               aria-label="Toggle Sidebar"
//             >
//               <FaBars size={20} />
//             </button>
//             <h1 className="text-lg font-bold text-[#344767]">{tabTitles[activeTab]}</h1>
//           </div>
//         </div>
//       </div>

//       <div className="h-[1px] bg-gray-300 mx-3"></div> {/* small line below header */}

//       {/* Content */}
//       <div className="flex flex-1">
//         <Sidebar
//           activeTab={activeTab}
//           setActiveTab={setActiveTab}
//           isOpen={isSidebarOpen}
//           setIsOpen={setIsSidebarOpen}
//         />

//         <div
//           className={`flex-1 bg-[#fafafa] transition-all duration-300 ${
//             showProfile ? 'blur-sm pointer-events-none select-none' : ''
//           }`}
//         >
//           <main className="p-4">
//             {activeTab === 'dashboard' && <Dashboard />}
//             {activeTab === 'form' && <CertificationForm />}
//             {activeTab === 'list' && <CertificationList />}
//           </main>
//         </div>
//       </div>

//       {/* Profile Panel */}
//       <AnimatePresence>
//         {showProfile && (
//           <div ref={contentRef}>
//             <UserProfilePanel
//               user={storedUser}
//               token={token}
//               onClose={() => setShowProfile(false)}
//               darkMode={darkMode}
//               toggleTheme={toggleTheme}
//               handleLogout={handleLogout}
//             />
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
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

  // ✅ Check if user is logged in and role is 'user'
  useEffect(() => {
    if (!storedUser || storedUser.role !== 'user' || !token) {
      navigate('/login'); // Redirect if not authorized
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

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8f9fd] text-gray-900'
      }`}
    >
      {/* Header */}
      <div className={`${showProfile ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Desktop & Tablet Header */}
        <div className="hidden md:flex items-center bg-[#fefefe] shadow px-3 py-2 transition-all duration-300">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 flex-shrink-0 w-60">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
              aria-label="Open Profile Panel"
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

        {/* Mobile Header */}
        <div className="md:hidden bg-[#fefefe] shadow px-3 py-2">
          <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-3 w-full mb-2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:scale-110 transition"
              aria-label="Open Profile Panel"
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
              aria-label="Toggle Sidebar"
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
        />

        <div
          className={`flex-1 bg-[#fafafa] transition-all duration-300 ${
            showProfile ? 'blur-sm pointer-events-none select-none' : ''
          }`}
        >
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







































































