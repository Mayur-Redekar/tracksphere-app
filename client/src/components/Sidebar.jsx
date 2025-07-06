import React from 'react';
import { FaWpforms, FaClipboardList, FaTachometerAlt } from 'react-icons/fa';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false); // Close sidebar on mobile after selecting
  };

  return (
    <>
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-gradient-to-b from-[#5B5F97] to-[#706fd3] text-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:w-64 min-h-screen md:flex flex-col`}
      >
        {/* Close button (visible only on mobile sidebar) */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={() => setIsOpen(false)} className="text-white">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-4 mt-4">
          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ffffff33] transition ${
              activeTab === 'dashboard' ? 'bg-[#ffffff33]' : ''
            }`}
            onClick={() => handleTabClick('dashboard')}
          >
            <FaTachometerAlt />
            Dashboard
          </button>

          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ffffff33] transition ${
              activeTab === 'form' ? 'bg-[#ffffff33]' : ''
            }`}
            onClick={() => handleTabClick('form')}
          >
            <FaWpforms />
            Certification Form
          </button>

          <button
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ffffff33] transition ${
              activeTab === 'list' ? 'bg-[#ffffff33]' : ''
            }`}
            onClick={() => handleTabClick('list')}
          >
            <FaClipboardList />
            Certification List
          </button>
        </nav>
      </aside>

      {/* Dark overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}


