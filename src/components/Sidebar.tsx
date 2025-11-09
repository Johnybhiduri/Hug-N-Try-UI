import React from 'react';
import { 
  HiHome, 
  HiChat, 
  HiCog, 
  HiUser, 
  HiPlus,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import { 
  RiRobot2Line,
  RiHistoryLine
} from 'react-icons/ri';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onClose }) => {
  const menuItems = [
    { icon: <HiHome className="text-xl" />, label: 'Home' },
    { icon: <RiHistoryLine className="text-xl" />, label: 'History' },
    { icon: <HiUser className="text-xl" />, label: 'Profile' },
    { icon: <HiCog className="text-xl" />, label: 'Settings' },
  ];

  const chatHistory = [
    { id: 1, title: 'Welcome Chat', icon: <RiRobot2Line /> },
    { id: 2, title: 'Project Discussion', icon: <HiChat /> },
    { id: 3, title: 'Technical Support', icon: <HiCog /> },
    { id: 4, title: 'General Inquiry', icon: <HiUser /> },
  ];

  return (
    <div className="h-full bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Sidebar Header with Logo and Toggle */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {isOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <RiRobot2Line className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">HUG-N-TRY</h1>
                  <p className="text-xs text-gray-400">AI Assistant</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Collapse sidebar"
              >
                <HiChevronLeft className="text-gray-400 text-xl" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <RiRobot2Line className="text-white text-xl" />
              </div>
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Expand sidebar"
              >
                <HiChevronRight className="text-gray-400 text-xl" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700">
        {isOpen ? (
          <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium border border-blue-500">
            <HiPlus className="text-lg" />
            <span>New Chat</span>
          </button>
        ) : (
          <button className="w-full flex items-center justify-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            <HiPlus className="text-lg" />
          </button>
        )}
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        {isOpen && (
          <div className="mb-4">
            {/* <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Recent Chats
            </h3> */}
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  <div className="text-gray-400 group-hover:text-gray-300">
                    {chat.icon}
                  </div>
                  <span className="text-sm text-gray-300 truncate flex-1">
                    {chat.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Items - Always show icons, show labels only when expanded */}
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <div className="text-gray-400 group-hover:text-gray-300">
                {item.icon}
              </div>
              {isOpen && (
                <span className="text-sm text-gray-300">{item.label}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-gray-400">Free Plan</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">U</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;