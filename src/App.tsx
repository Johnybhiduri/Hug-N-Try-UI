import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex-shrink-0`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={toggleSidebar}
          onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Only show on mobile when sidebar is closed */}
        <header className="bg-gray-800 border-b border-gray-700 p-4 lg:hidden">
          <div className="flex items-center">
            {/* <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-700 transition-colors mr-4"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button> */}
            <div>
              <h1 className="text-xl font-semibold text-white">HUG-N-TRY</h1>
            </div>
          </div>
        </header>

        {/* Chat Page */}
        <main className="flex-1 overflow-hidden">
          <ChatPage />
        </main>
      </div>
    </div>
  );
};

export default App;