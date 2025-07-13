// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaMedal,
//   FaKey,
//   FaCalendarAlt,
//   FaUser,
//   FaBoxOpen,
// } from 'react-icons/fa';

// const AllCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const token = localStorage.getItem('token');

//   const fetchCertificates = async () => {
//     try {
//       const res = await axios.get('/api/certifications/certificates', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCertificates(res.data);
//     } catch (err) {
//       console.error('Error fetching certificates:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const getStatusIcon = (status) => {
//     const lower = status.toLowerCase();
//     if (lower.includes('bronze')) {
//       return (
//         <span className="flex items-center gap-1 text-orange-600 font-semibold">
//           <FaMedal /> Bronze
//         </span>
//       );
//     } else if (lower === 'not certified') {
//       return (
//         <span className="flex items-center gap-1 text-gray-600 font-semibold">
//           <FaHourglassHalf /> Not Certified
//         </span>
//       );
//     } else if (lower.includes('nc')) {
//       return (
//         <span className="flex items-center gap-1 text-yellow-500 font-semibold">
//           <FaExclamationTriangle /> NC Raised
//         </span>
//       );
//     } else if (lower === 'reject') {
//       return (
//         <span className="flex items-center gap-1 text-red-600 font-semibold">
//           <FaTimesCircle /> Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="flex items-center gap-1 text-green-600 font-semibold">
//           <FaCheckCircle /> {status}
//         </span>
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow p-4 sm:p-6">
//       <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700 mb-4 sm:mb-6">
//         All User Certificates
//       </h2>

//       {certificates.length === 0 ? (
//         <p className="text-gray-500">No certificates found.</p>
//       ) : (
//         <div className="space-y-4 sm:space-y-0 sm:overflow-x-auto">
//           {/* Desktop Table */}
//           <table className="hidden sm:table w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
//             <thead className="bg-indigo-600 text-white">
//               <tr>
//                 <th className="px-4 py-3">Unit Name</th>
//                 <th className="px-4 py-3">ZED MSME</th>
//                 <th className="px-4 py-3">Password</th>
//                 <th className="px-4 py-3">Date</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Username</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {certificates.map((cert, index) => (
//                 <tr
//                   key={cert._id}
//                   className={`transition hover:bg-gray-100 ${
//                     index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                   }`}
//                 >
//                   <td className="px-4 py-3">{cert.unitName}</td>
//                   <td className="px-4 py-3">{cert.zedmsme}</td>
//                   <td className="px-4 py-3">{cert.password}</td>
//                   <td className="px-4 py-3">
//                     {cert.date ? new Date(cert.date).toLocaleDateString() : '-'}
//                   </td>
//                   <td className="px-4 py-3">{getStatusIcon(cert.status)}</td>
//                   <td className="px-4 py-3 font-medium">{cert.user?.username || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Compact Mobile Cards */}
//           <div className="sm:hidden flex flex-col gap-3">
//             {certificates.map((cert) => (
//               <div
//                 key={cert._id}
//                 className="rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm"
//               >
//                 <div className="flex justify-between items-center mb-2">
//                   <p className="font-semibold text-indigo-700 truncate max-w-[65%]">
//                     <FaBoxOpen className="inline mr-1" />
//                     {cert.unitName || '-'}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {cert.date ? new Date(cert.date).toLocaleDateString() : '-'}
//                     <FaCalendarAlt className="inline ml-1" />
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//                   <div className="flex items-center gap-1 truncate">
//                     <FaKey className="text-gray-500" />
//                     <span className="truncate">{cert.password || '-'}</span>
//                   </div>
//                   <div className="flex items-center gap-1 truncate">
//                     <FaUser className="text-gray-500" />
//                     <span className="truncate font-medium">{cert.user?.username || '-'}</span>
//                   </div>
//                   <div className="flex items-center gap-1 col-span-2">
//                     {getStatusIcon(cert.status)}
//                   </div>
//                   <div className="flex items-center gap-1 col-span-2 truncate">
//                     <span className="font-semibold text-gray-600">ZED MSME:</span>
//                     <span className="truncate">{cert.zedmsme || '-'}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllCertificates;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaMedal,
//   FaKey,
//   FaCalendarAlt,
//   FaUser,
//   FaBoxOpen,
//   FaFileExport,
//   FaFilePdf,
// } from 'react-icons/fa';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable'; // ✅ Correct way

// const AllCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [filters, setFilters] = useState({ username: '', month: '', date: '', status: '' });
//   const token = localStorage.getItem('token');

//   const fetchCertificates = async () => {
//     try {
//       const res = await axios.get('/api/certifications/certificates', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCertificates(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error('Error fetching certificates:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const getStatusIcon = (status) => {
//     const lower = status.toLowerCase();
//     if (lower.includes('bronze')) {
//       return (
//         <span className="flex items-center gap-1 text-orange-600 font-semibold">
//           <FaMedal /> Bronze
//         </span>
//       );
//     } else if (lower === 'not certified') {
//       return (
//         <span className="flex items-center gap-1 text-gray-600 font-semibold">
//           <FaHourglassHalf /> Not Certified
//         </span>
//       );
//     } else if (lower.includes('nc')) {
//       return (
//         <span className="flex items-center gap-1 text-yellow-500 font-semibold">
//           <FaExclamationTriangle /> NC Raised
//         </span>
//       );
//     } else if (lower === 'reject') {
//       return (
//         <span className="flex items-center gap-1 text-red-600 font-semibold">
//           <FaTimesCircle /> Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="flex items-center gap-1 text-green-600 font-semibold">
//           <FaCheckCircle /> {status}
//         </span>
//       );
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     const updatedFilters = { ...filters, [name]: value };
//     setFilters(updatedFilters);

//     let temp = certificates;
//     if (updatedFilters.username) temp = temp.filter(c => c.user?.username === updatedFilters.username);
//     if (updatedFilters.status) temp = temp.filter(c => c.status === updatedFilters.status);
//     if (updatedFilters.date) temp = temp.filter(c => c.date && new Date(c.date).toISOString().split('T')[0] === updatedFilters.date);
//     if (updatedFilters.month) {
//       temp = temp.filter(c => {
//         const certMonth = new Date(c.date).getMonth() + 1;
//         return certMonth === parseInt(updatedFilters.month);
//       });
//     }

//     setFiltered(temp);
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filtered.map(c => ({
//       Username: c.user?.username || '',
//       "Unit Name": c.unitName,
//       "ZED MSME": c.zedmsme,
//       Password: c.password,
//       Date: new Date(c.date).toLocaleDateString(),
//       Status: c.status
//     })));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
//     XLSX.writeFile(workbook, 'Certificates_Report.xlsx');
//   };

//   const exportToPDF = () => {
//   const doc = new jsPDF();
//   const currentDate = new Date();
//   const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//   const title = `${monthYear} Certifications Report`;

//   doc.setFontSize(14);
//   doc.text(title, 14, 16); // Title with current month and year

//   const tableData = filtered.map(c => [
//     c.user?.username || '',
//     c.unitName,
//     c.zedmsme,
//     c.password,
//     new Date(c.date).toLocaleDateString(),
//     c.status
//   ]);

//   autoTable(doc, {
//     startY: 22,
//     head: [['Username', 'Unit Name', 'ZED MSME', 'Password', 'Date', 'Status']],
//     body: tableData,
//     styles: { fontSize: 10 },
//   });

//   doc.save(`${monthYear.replace(' ', '_')}_Certificates_Report.pdf`);
//  };


//   const usernames = [...new Set(certificates.map(c => c.user?.username).filter(Boolean))];
//   const statuses = [...new Set(certificates.map(c => c.status).filter(Boolean))];

//   return (
//     <div className="bg-white rounded-xl shadow p-4 sm:p-6">
//       {/* Filter Bar */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
//         <div className="flex flex-wrap gap-2 items-center w-full text-sm font-semibold text-gray-700">
//           <select name="username" value={filters.username} onChange={handleFilterChange} className="border border-gray-300 rounded px-2 py-1">
//             <option value="">All Users</option>
//             {usernames.map((name, idx) => (
//               <option key={idx} value={name}>{name}</option>
//             ))}
//           </select>
//           <select name="month" value={filters.month} onChange={handleFilterChange} className="border border-gray-300 rounded px-2 py-1">
//             <option value="">All Months</option>
//             {[...Array(12)].map((_, i) => (
//               <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
//             ))}
//           </select>
//           <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="border border-gray-300 rounded px-2 py-1" />
//           <select name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded px-2 py-1">
//             <option value="">All Status</option>
//             {statuses.map((s, i) => (
//               <option key={i} value={s}>{s}</option>
//             ))}
//           </select>
//         </div>
//         <div className="flex flex-wrap gap-2 justify-end">
//           <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"><FaFilePdf /> PDF</button>
//           <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"><FaFileExport /> Excel</button>
//         </div>
//       </div>

//       <div className="text-sm text-gray-700 mb-3">Showing <span className="text-indigo-600 font-semibold">{filtered.length}</span> certificate{filtered.length !== 1 ? 's' : ''}</div>

//       {/* Desktop Table */}
//       <table className="hidden sm:table w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
//         <thead className="bg-indigo-600 text-white">
//           <tr>
//             <th className="px-4 py-3">Unit Name</th>
//             <th className="px-4 py-3">ZED MSME</th>
//             <th className="px-4 py-3">Password</th>
//             <th className="px-4 py-3">Date</th>
//             <th className="px-4 py-3">Status</th>
//             <th className="px-4 py-3">Username</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-700">
//           {filtered.map((cert, index) => (
//             <tr
//               key={cert._id}
//               className={`transition hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
//             >
//               <td className="px-4 py-3">{cert.unitName}</td>
//               <td className="px-4 py-3">{cert.zedmsme}</td>
//               <td className="px-4 py-3">{cert.password}</td>
//               <td className="px-4 py-3">{cert.date ? new Date(cert.date).toLocaleDateString() : '-'}</td>
//               <td className="px-4 py-3">{getStatusIcon(cert.status)}</td>
//               <td className="px-4 py-3 font-medium">{cert.user?.username || '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Mobile Cards */}
//       <div className="sm:hidden flex flex-col gap-3">
//         {filtered.map((cert) => (
//           <div key={cert._id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm">
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-semibold text-indigo-700 truncate max-w-[65%]">
//                 <FaBoxOpen className="inline mr-1" />
//                 {cert.unitName || '-'}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {cert.date ? new Date(cert.date).toLocaleDateString() : '-'}
//                 <FaCalendarAlt className="inline ml-1" />
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//               <div className="flex items-center gap-1 truncate">
//                 <FaKey className="text-gray-500" />
//                 <span className="truncate">{cert.password || '-'}</span>
//               </div>
//               <div className="flex items-center gap-1 truncate">
//                 <FaUser className="text-gray-500" />
//                 <span className="truncate font-medium">{cert.user?.username || '-'}</span>
//               </div>
//               <div className="flex items-center gap-1 col-span-2">
//                 {getStatusIcon(cert.status)}
//               </div>
//               <div className="flex items-center gap-1 col-span-2 truncate">
//                 <span className="font-semibold text-gray-600">ZED MSME:</span>
//                 <span className="truncate">{cert.zedmsme || '-'}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllCertificates;


// full working code
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaMedal,
//   FaKey,
//   FaCalendarAlt,
//   FaUser,
//   FaBoxOpen,
//   FaFileExport,
//   FaFilePdf,
// } from 'react-icons/fa';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// const AllCertificates = () => {
//   const [certificates, setCertificates] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [filters, setFilters] = useState({ username: '', month: '', date: '', status: '' });
//   const token = localStorage.getItem('token');

//   const fetchCertificates = async () => {
//     try {
//       const res = await axios.get('/api/certifications/certificates', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCertificates(res.data);
//       setFiltered(res.data);
//     } catch (err) {
//       console.error('Error fetching certificates:', err);
//     }
//   };

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   const getStatusIcon = (status) => {
//     const lower = status.toLowerCase();
//     if (lower.includes('bronze')) {
//       return (
//         <span className="flex items-center gap-1 text-orange-600 font-semibold">
//           <FaMedal /> Bronze Certified
//         </span>
//       );
//     } else if (lower === 'not certified') {
//       return (
//         <span className="flex items-center gap-1 text-gray-600 font-semibold">
//           <FaHourglassHalf /> Not Certified
//         </span>
//       );
//     } else if (lower.includes('nc')) {
//       return (
//         <span className="flex items-center gap-1 text-yellow-500 font-semibold">
//           <FaExclamationTriangle /> NC Raised
//         </span>
//       );
//     } else if (lower === 'reject' || lower === 'rejected') {
//       return (
//         <span className="flex items-center gap-1 text-red-600 font-semibold">
//           <FaTimesCircle /> Rejected
//         </span>
//       );
//     } else {
//       return (
//         <span className="flex items-center gap-1 text-green-600 font-semibold">
//           <FaCheckCircle /> {status}
//         </span>
//       );
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     const updatedFilters = { ...filters, [name]: value };
//     setFilters(updatedFilters);

//     let temp = certificates;
//     if (updatedFilters.username) temp = temp.filter(c => c.user?.username === updatedFilters.username);
//     if (updatedFilters.status) temp = temp.filter(c => c.status === updatedFilters.status);
//     if (updatedFilters.date) temp = temp.filter(c => c.date && new Date(c.date).toISOString().split('T')[0] === updatedFilters.date);
//     if (updatedFilters.month) {
//       temp = temp.filter(c => {
//         const certMonth = new Date(c.date).getMonth() + 1;
//         return certMonth === parseInt(updatedFilters.month);
//       });
//     }

//     setFiltered(temp);
//   };

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(filtered.map(c => ({
//       Username: c.user?.username || '',
//       "Unit Name": c.unitName,
//       "ZED MSME": c.zedmsme,
//       Password: c.password,
//       Date: new Date(c.date).toLocaleDateString(),
//       Status: c.status
//     })));
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
//     XLSX.writeFile(workbook, 'Certificates_Report.xlsx');
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     const currentDate = new Date();
//     const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//     const title = `${monthYear} Certifications Report`;

//     doc.setFontSize(14);
//     doc.text(title, 14, 16);

//     const tableData = filtered.map(c => [
//       c.user?.username || '',
//       c.unitName,
//       c.zedmsme,
//       c.password,
//       new Date(c.date).toLocaleDateString(),
//       c.status
//     ]);

//     autoTable(doc, {
//       startY: 22,
//       head: [['Username', 'Unit Name', 'ZED MSME', 'Password', 'Date', 'Status']],
//       body: tableData,
//       styles: { fontSize: 10 },
//     });

//     doc.save(`${monthYear.replace(' ', '_')}_Certificates_Report.pdf`);
//   };

//   const usernames = [...new Set(certificates.map(c => c.user?.username).filter(Boolean))];
//   const statuses = [...new Set(certificates.map(c => c.status).filter(Boolean))];

//   return (
//     <div className="bg-white rounded-xl shadow p-4 sm:p-6">
//       {/* Filters */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
//           <div>
//             <label className="text-sm font-semibold">User</label>
//             <select name="username" value={filters.username} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
//               <option value="">All</option>
//               {usernames.map((name, idx) => (
//                 <option key={idx} value={name}>{name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-semibold">Month</label>
//             <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
//               <option value="">All</option>
//               {[...Array(12)].map((_, i) => (
//                 <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="text-sm font-semibold">Date</label>
//             <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1" />
//           </div>
//           <div>
//             <label className="text-sm font-semibold">Status</label>
//             <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
//               <option value="">All</option>
//               {statuses.map((s, i) => (
//                 <option key={i} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="flex gap-2 justify-end md:mt-5">
//           <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
//             <FaFilePdf /> PDF
//           </button>
//           <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
//             <FaFileExport /> Excel
//           </button>
//         </div>
//       </div>

//       {/* Count Summary */}
//       <div className="text-sm text-gray-700 mb-3">
//         Showing <span className="text-indigo-600 font-semibold">{filtered.length}</span> certificate{filtered.length !== 1 ? 's' : ''}
//       </div>

//       {/* Desktop Table */}
//       <table className="hidden sm:table w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
//         <thead className="bg-indigo-600 text-white">
//           <tr>
//             <th className="px-4 py-3">Unit Name</th>
//             <th className="px-4 py-3">ZED MSME</th>
//             <th className="px-4 py-3">Password</th>
//             <th className="px-4 py-3">Date</th>
//             <th className="px-4 py-3">Status</th>
//             <th className="px-4 py-3">Username</th>
//           </tr>
//         </thead>
//         <tbody className="text-gray-700">
//           {filtered.map((cert, index) => (
//             <tr key={cert._id} className={`transition hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//               <td className="px-4 py-3">{cert.unitName}</td>
//               <td className="px-4 py-3">{cert.zedmsme}</td>
//               <td className="px-4 py-3">{cert.password}</td>
//               <td className="px-4 py-3">{cert.date ? new Date(cert.date).toLocaleDateString() : '-'}</td>
//               <td className="px-4 py-3">{getStatusIcon(cert.status)}</td>
//               <td className="px-4 py-3 font-medium">{cert.user?.username || '-'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Mobile Cards */}
//       <div className="sm:hidden flex flex-col gap-3">
//         {filtered.map(cert => (
//           <div key={cert._id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm">
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-semibold text-indigo-700 truncate max-w-[65%]">
//                 <FaBoxOpen className="inline mr-1" />
//                 {cert.unitName || '-'}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {cert.date ? new Date(cert.date).toLocaleDateString() : '-'}
//                 <FaCalendarAlt className="inline ml-1" />
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
//               <div className="flex items-center gap-1 truncate">
//                 <FaKey className="text-gray-500" />
//                 <span>{cert.password || '-'}</span>
//               </div>
//               <div className="flex items-center gap-1 truncate">
//                 <FaUser className="text-gray-500" />
//                 <span className="font-medium">{cert.user?.username || '-'}</span>
//               </div>
//               <div className="col-span-2">{getStatusIcon(cert.status)}</div>
//               <div className="flex items-center gap-1 col-span-2 truncate">
//                 <span className="font-semibold text-gray-600">ZED MSME:</span>
//                 <span className="truncate">{cert.zedmsme || '-'}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllCertificates;



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMedal,
  FaKey,
  FaCalendarAlt,
  FaUser,
  FaBoxOpen,
  FaFileExport,
  FaFilePdf,
} from 'react-icons/fa';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ username: '', month: '', date: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50; // ✅ Set to 50

  const token = localStorage.getItem('token');

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('/api/certifications/certificates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificates(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Error fetching certificates:', err);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const getStatusIcon = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes('bronze')) {
      return (
        <span className="flex items-center gap-1 text-orange-600 font-semibold">
          <FaMedal /> Bronze Certified
        </span>
      );
    } else if (lower === 'not certified') {
      return (
        <span className="flex items-center gap-1 text-gray-600 font-semibold">
          <FaHourglassHalf /> Not Certified
        </span>
      );
    } else if (lower.includes('nc')) {
      return (
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          <FaExclamationTriangle /> NC Raised
        </span>
      );
    } else if (lower === 'reject' || lower === 'rejected') {
      return (
        <span className="flex items-center gap-1 text-red-600 font-semibold">
          <FaTimesCircle /> Rejected
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold">
          <FaCheckCircle /> {status}
        </span>
      );
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    let temp = certificates;
    if (updatedFilters.username) temp = temp.filter(c => c.user?.username === updatedFilters.username);
    if (updatedFilters.status) temp = temp.filter(c => c.status === updatedFilters.status);
    if (updatedFilters.date) temp = temp.filter(c => c.date && new Date(c.date).toISOString().split('T')[0] === updatedFilters.date);
    if (updatedFilters.month) {
      temp = temp.filter(c => {
        const certMonth = new Date(c.date).getMonth() + 1;
        return certMonth === parseInt(updatedFilters.month);
      });
    }

    setFiltered(temp);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filtered.map(c => ({
      Username: c.user?.username || '',
      "Unit Name": c.unitName,
      "ZED MSME": c.zedmsme,
      Password: c.password,
      Date: new Date(c.date).toLocaleDateString(),
      Status: c.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Certificates');
    XLSX.writeFile(workbook, 'Certificates_Report.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const currentDate = new Date();
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const title = `${monthYear} Certifications Report`;

    doc.setFontSize(14);
    doc.text(title, 14, 16);

    const tableData = filtered.map(c => [
      c.user?.username || '',
      c.unitName,
      c.zedmsme,
      c.password,
      new Date(c.date).toLocaleDateString(),
      c.status
    ]);

    autoTable(doc, {
      startY: 22,
      head: [['Username', 'Unit Name', 'ZED MSME', 'Password', 'Date', 'Status']],
      body: tableData,
      styles: { fontSize: 10 },
    });

    doc.save(`${monthYear.replace(' ', '_')}_Certificates_Report.pdf`);
  };

  const usernames = [...new Set(certificates.map(c => c.user?.username).filter(Boolean))];
  const statuses = [...new Set(certificates.map(c => c.status).filter(Boolean))];

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <div>
            <label className="text-sm font-semibold">User</label>
            <select name="username" value={filters.username} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
              <option value="">All</option>
              {usernames.map((name, idx) => (
                <option key={idx} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Month</label>
            <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
              <option value="">All</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Date</label>
            <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full border border-gray-300 rounded px-2 py-1">
              <option value="">All</option>
              {statuses.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 justify-end md:mt-5">
          <button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
            <FaFilePdf /> PDF
          </button>
          <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
            <FaFileExport /> Excel
          </button>
        </div>
      </div>

      {/* Count Summary */}
      <div className="text-sm text-gray-700 mb-3">
        Showing <span className="text-indigo-600 font-semibold">{filtered.length}</span> certificate{filtered.length !== 1 ? 's' : ''}
      </div>

      {/* Desktop Table */}
      <table className="hidden sm:table w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-3">Unit Name</th>
            <th className="px-4 py-3">ZED MSME</th>
            <th className="px-4 py-3">Password</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Username</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {currentItems.map((cert, index) => (
            <tr key={cert._id} className={`transition hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <td className="px-4 py-3">{cert.unitName}</td>
              <td className="px-4 py-3">{cert.zedmsme}</td>
              <td className="px-4 py-3">{cert.password}</td>
              <td className="px-4 py-3">{cert.date ? new Date(cert.date).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-3">{getStatusIcon(cert.status)}</td>
              <td className="px-4 py-3 font-medium">{cert.user?.username || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {currentItems.map(cert => (
          <div key={cert._id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-indigo-700 truncate max-w-[65%]">
                <FaBoxOpen className="inline mr-1" />
                {cert.unitName || '-'}
              </p>
              <p className="text-xs text-gray-500">
                {cert.date ? new Date(cert.date).toLocaleDateString() : '-'}
                <FaCalendarAlt className="inline ml-1" />
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div className="flex items-center gap-1 truncate">
                <FaKey className="text-gray-500" />
                <span>{cert.password || '-'}</span>
              </div>
              <div className="flex items-center gap-1 truncate">
                <FaUser className="text-gray-500" />
                <span className="font-medium">{cert.user?.username || '-'}</span>
              </div>
              <div className="col-span-2">{getStatusIcon(cert.status)}</div>
              <div className="flex items-center gap-1 col-span-2 truncate">
                <span className="font-semibold text-gray-600">ZED MSME:</span>
                <span className="truncate">{cert.zedmsme || '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* Pagination - placed at bottom */}
    {totalPages > 1 && (
      <div className="mt-4 flex justify-center gap-1 text-sm">
        {Array.from({ length: totalPages }, (_, i) => (
        <button
         key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 border rounded ${
          currentPage === i + 1
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
  )}

 </div>
  );
};

export default AllCertificates;
