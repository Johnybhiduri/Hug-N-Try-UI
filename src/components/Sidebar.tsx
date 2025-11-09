import React, { useState } from 'react';
import { 
  HiKey, 
  HiCheckCircle, 
  HiXCircle,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isApiVerified, setIsApiVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedTask, setSelectedTask] = useState('text-generation');
  const [selectedModel, setSelectedModel] = useState('gpt2');
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const taskTypes = [
    { id: 'text-generation', name: 'Text Generation' },
    { id: 'image-generation', name: 'Image Generation' },
    { id: 'video-generation', name: 'Video Generation' },
    { id: 'text-to-speech', name: 'Text to Speech' },
    { id: 'speech-to-text', name: 'Speech to Text' },
  ];

  const modelOptions = {
    'text-generation': [
      { id: 'gpt2', name: 'GPT-2' },
      { id: 'bloom', name: 'BLOOM' },
      { id: 'llama', name: 'LLaMA' },
      { id: 'mistral', name: 'Mistral' },
    ],
    'image-generation': [
      { id: 'stable-diffusion', name: 'Stable Diffusion' },
      { id: 'dalle', name: 'DALL-E' },
      { id: 'midjourney', name: 'Midjourney' },
    ],
    'video-generation': [
      { id: 'modelscope', name: 'ModelScope' },
      { id: 'runway', name: 'Runway ML' },
    ],
    'text-to-speech': [
      { id: 'coqui', name: 'Coqui TTS' },
      { id: 'tacotron', name: 'Tacotron 2' },
    ],
    'speech-to-text': [
      { id: 'whisper', name: 'Whisper' },
      { id: 'wav2vec', name: 'Wav2Vec 2.0' },
    ],
  };

  const verifyApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      // In real implementation, you would make an actual API call to verify the key
      const isValid = apiKey.length >= 10; // Simple validation for demo
      setIsApiVerified(isValid);
      setIsVerifying(false);
    }, 1500);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    // Reset verification status if API key changes
    if (isApiVerified) {
      setIsApiVerified(false);
    }
  };

  const getCurrentModels = () => {
    return modelOptions[selectedTask as keyof typeof modelOptions] || [];
  };

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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* API Key Section */}
        <div className="space-y-3">
          {isOpen && (
            <label className="block text-sm font-medium text-gray-300">
              Hugging Face API Key
            </label>
          )}
          
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder={isOpen ? "Enter your API key" : "API Key"}
                className={`flex-1 px-3 py-2 bg-gray-800 border rounded-lg text-sm text-white placeholder-gray-400 ${
                  isApiVerified 
                    ? 'border-green-500' 
                    : apiKey 
                    ? 'border-yellow-500' 
                    : 'border-gray-600'
                } ${!isOpen ? 'text-center' : ''}`}
              />
              {isOpen && (
                <button
                  onClick={verifyApiKey}
                  disabled={!apiKey.trim() || isVerifying}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !apiKey.trim() || isVerifying
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isVerifying ? '...' : 'Verify'}
                </button>
              )}
            </div>
            
            {/* Verification Status */}
            {isOpen && (
              <div className="flex items-center space-x-2 text-sm">
                {isVerifying ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-400">Verifying...</span>
                  </>
                ) : isApiVerified ? (
                  <>
                    <HiCheckCircle className="text-green-500 text-lg" />
                    <span className="text-green-400">API Key Verified</span>
                  </>
                ) : apiKey ? (
                  <>
                    <HiXCircle className="text-yellow-500 text-lg" />
                    <span className="text-yellow-400">Not Verified</span>
                  </>
                ) : (
                  <>
                    <HiKey className="text-gray-500 text-lg" />
                    <span className="text-gray-400">API Key Required</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Task Type Dropdown */}
        <div className="space-y-3">
          {isOpen && (
            <label className="block text-sm font-medium text-gray-300">
              Task Type
            </label>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowTaskDropdown(!showTaskDropdown)}
              disabled={!isApiVerified}
              className={`w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white transition-colors ${
                !isApiVerified 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-700'
              } ${!isOpen ? 'justify-center' : ''}`}
            >
              {isOpen ? (
                <>
                  <span>
                    {taskTypes.find(task => task.id === selectedTask)?.name || 'Select Task'}
                  </span>
                  <HiChevronDown className={`text-gray-400 transition-transform ${
                    showTaskDropdown ? 'rotate-180' : ''
                  }`} />
                </>
              ) : (
                <RiRobot2Line className="text-gray-300" />
              )}
            </button>

            {showTaskDropdown && isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                {taskTypes.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task.id);
                      setSelectedModel(modelOptions[task.id as keyof typeof modelOptions]?.[0]?.id || '');
                      setShowTaskDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedTask === task.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                  >
                    {task.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Model Selection Dropdown */}
        <div className="space-y-3">
          {isOpen && (
            <label className="block text-sm font-medium text-gray-300">
              Model
            </label>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              disabled={!isApiVerified}
              className={`w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white transition-colors ${
                !isApiVerified 
                  ? 'cursor-not-allowed opacity-50' 
                  : 'hover:bg-gray-700'
              } ${!isOpen ? 'justify-center' : ''}`}
            >
              {isOpen ? (
                <>
                  <span>
                    {getCurrentModels().find(model => model.id === selectedModel)?.name || 'Select Model'}
                  </span>
                  <HiChevronDown className={`text-gray-400 transition-transform ${
                    showModelDropdown ? 'rotate-180' : ''}`} 
                  />
                </>
              ) : (
                <HiKey className="text-gray-300" />
              )}
            </button>

            {showModelDropdown && isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getCurrentModels().map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedModel === model.id ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {isOpen && (
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 text-center">
              {isApiVerified 
                ? 'Ready to generate! Select your task and model.' 
                : 'Please verify your API key to enable model selection.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {isOpen ? (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              {isApiVerified ? '✅ API Verified' : '🔒 API Required'}
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            {isApiVerified ? (
              <HiCheckCircle className="text-green-500 text-lg" />
            ) : (
              <HiKey className="text-gray-500 text-lg" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;