import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, menuItems = [], footer, email, onLogout }) {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <>
      <aside
        className={`fixed md:fixed top-0 left-0 bg-gradient-to-b from-[#5B5F97] to-[#706fd3] text-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:w-64 h-screen md:h-screen flex flex-col`}
      >
        {/* Top Section */}
        <div className="flex-grow flex flex-col">
          {/* Project Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-wider">
              Track<span className="text-yellow-300">Sphere</span>
            </h1>
          </div>

          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={() => setIsOpen(false)} className="text-white">✕</button>
          </div>

          {/* Dynamic Menu */}
          <nav className="flex flex-col gap-4 mt-4 flex-grow">
            {menuItems.length > 0 ? (
              menuItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ffffff33] transition ${
                    activeTab === key ? 'bg-[#ffffff33]' : ''
                  }`}
                  onClick={() => handleTabClick(key)}
                >
                  <Icon />
                  {label}
                </button>
              ))
            ) : (
              <p>No menu items</p>
            )}
          </nav>

          {/* Footer */}
          {footer && (
            <div className="mt-6">
              {footer}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        {(email && onLogout) && (
          <div className="mt-4 text-center text-white text-sm space-y-2">
            <p className="break-all">{email}</p>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}










