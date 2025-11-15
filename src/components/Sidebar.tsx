import React, { useState, useEffect } from "react";
import {
  HiKey,
  HiCheckCircle,
  HiXCircle,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { MdInput } from "react-icons/md";
import { FaRegSquareCheck } from "react-icons/fa6";
// import { HfInference } from "@huggingface/inference";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onVerify: () => void;
  onSelectModel: (modelId: string | null) => void;
  onSelectPipeline: (pipelineTag: string | null) => void;
  onSetApiKey: (apiKey: string) => void;
}

interface Model {
  id: string;
  name: string;
  pipeline_tag?: string;
}

interface PipelineModels {
  [pipelineTag: string]: Model[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onVerify, onSelectModel, onSelectPipeline, onSetApiKey}) => {
  const [apiKey, setApiKey] = useState("");
  const [isApiVerified, setIsApiVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedTask, setSelectedTask] = useState("text-generation");
  const [selectedModel, setSelectedModel] = useState("");
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [pipelineModels, setPipelineModels] = useState<PipelineModels>({});
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Task types that correspond to Hugging Face pipeline tags
  const taskTypes = [
    { id: "text-generation", name: "Text Generation" },
    { id: "text2text-generation", name: "Text to Text Generation" },
    { id: "text-classification", name: "Text Classification" },
    { id: "question-answering", name: "Question Answering" },
    { id: "summarization", name: "Summarization" },
    { id: "translation", name: "Translation" },
    { id: "conversational", name: "Conversational AI" },
    { id: "image-classification", name: "Image Classification" },
    { id: "image-to-text", name: "Image to Text" },
    { id: "text-to-image", name: "Text to Image" },
    { id: "audio-classification", name: "Audio Classification" },
    { id: "automatic-speech-recognition", name: "Speech Recognition" },
    { id: "text-to-speech", name: "Text to Speech" },
  ];

  // Fetch models from Hugging Face API
  const fetchHuggingFaceModels = async (token: string) => {
    setIsLoadingModels(true);
    try {
      const response = await fetch(
        "https://huggingface.co/api/models?inference=warm&limit=2000",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const models = await response.json();
      
      // Organize models by pipeline tag
      const organizedModels: PipelineModels = {};
      
      models.forEach((model: any) => {
        if (model.pipeline_tag) {
          const pipelineTag = model.pipeline_tag;
          if (!organizedModels[pipelineTag]) {
            organizedModels[pipelineTag] = [];
          }
          organizedModels[pipelineTag].push({
            id: model.id,
            name: model.modelId || model.id,
            pipeline_tag: model.pipeline_tag,
          });
        }
      });

      setPipelineModels(organizedModels);
      
      // Set default model for the selected task if available
      if (organizedModels[selectedTask] && organizedModels[selectedTask].length > 0) {
        setSelectedModel(organizedModels[selectedTask][0].id);
      }
      
      return true;
    } catch (error) {
      console.error("Error fetching Hugging Face models:", error);
      return false;
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Verify API key by making a simple request
  const verifyApiKeyWithRequest = async (token: string) => {
    try {
      // Try to fetch user info or a simple endpoint
      const response = await fetch("https://huggingface.co/api/whoami-v2", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userInfo = await response.json();
      console.log("API Key verified for user:", userInfo);
      onVerify();
      onSetApiKey(token);
      return true;
    } catch (error) {
      console.error("API verification failed:", error);
      return false;
    }
  };

  useEffect(() => {
    if (selectedModel) {
      onSelectModel(selectedModel);
    }
  }, [selectedModel, onSelectModel]);

  // Notify parent when pipeline/task changes
  useEffect(() => {
    if (selectedTask) {
      onSelectPipeline(selectedTask);
    }
  }, [selectedTask, onSelectPipeline]);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTask(taskId);
    if (availableModels[taskId] && availableModels[taskId].length > 0) {
      const newModel = availableModels[taskId][0].id;
      setSelectedModel(newModel);
    }
    setShowTaskDropdown(false);
  };

  // Update the model selection handler
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelDropdown(false);
  };

  // Alternative: Verify by testing with a simple model list request
  // const verifyApiKeyWithModelTest = async (token: string) => {
  //   try {
  //     const response = await fetch("https://huggingface.co/api/models?limit=1", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     await response.json();
  //     return true;
  //   } catch (error) {
  //     console.error("API verification failed:", error);
  //     return false;
  //   }
  // };

  const verifyApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsVerifying(true);

    try {
      // Verify API key using direct HTTP request
      const isVerified = await verifyApiKeyWithRequest(apiKey);
      
      if (isVerified) {
        // Now fetch the available models
        const modelsFetched = await fetchHuggingFaceModels(apiKey);
        
        if (modelsFetched) {
          setIsApiVerified(true);
        } else {
          setIsApiVerified(false);
          console.error("Failed to fetch models");
        }
      } else {
        setIsApiVerified(false);
      }
    } catch (error) {
      console.error("API verification failed:", error);
      setIsApiVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
    // Reset verification status if API key changes
    if (isApiVerified) {
      setIsApiVerified(false);
      setPipelineModels({});
    }
  };

  const getCurrentModels = () => {
    return pipelineModels[selectedTask] || [];
  };

  // Initialize with some default models if API is not verified
  const getDefaultModels = () => {
    const defaultModels: PipelineModels = {
      "text-generation": [
        { id: "gpt2", name: "GPT-2" },
        { id: "facebook/opt-350m", name: "OPT-350M" },
      ],
      "text-classification": [
        { id: "distilbert-base-uncased-finetuned-sst-2-english", name: "DistilBERT SST-2" },
      ],
      "question-answering": [
        { id: "distilbert-base-cased-distilled-squad", name: "DistilBERT SQuAD" },
      ],
    };
    return defaultModels;
  };

  const availableModels = isApiVerified ? pipelineModels : getDefaultModels();

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
                  <h1 className="text-lg font-bold text-white">First Search AI</h1>
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
            {isOpen ? (
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your Hugging Face API key"
                  className={`flex-1 px-3 py-2 bg-gray-800 border rounded-lg text-sm text-white placeholder-gray-400 ${
                    isApiVerified
                      ? "border-green-500"
                      : apiKey
                      ? "border-yellow-500"
                      : "border-gray-600"
                  }`}
                />
                <button
                  onClick={verifyApiKey}
                  disabled={!apiKey.trim() || isVerifying}
                  className={`p-2 rounded-lg transition-colors ${
                    !apiKey.trim() || isVerifying
                      ? "bg-gray-600 cursor-not-allowed text-gray-400"
                      : isApiVerified
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isVerifying ? (
                    <span className="animate-pulse">...</span>
                  ) : isApiVerified ? (
                    <FaRegSquareCheck className="w-4 h-4" />
                  ) : (
                    <FaRegSquareCheck className="w-4 h-4" />
                  )}
                </button>
              </div>
            ) : (
              // Show unclickable icon when sidebar is closed
              <div className="flex justify-center">
                <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg cursor-not-allowed">
                  <MdInput className="text-gray-500 text-xl" />
                </div>
              </div>
            )}

            {/* Verification Status */}
            {isOpen && (
              <div className="flex items-center space-x-2 text-sm">
                {isVerifying ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-400">
                      {isLoadingModels ? "Fetching models..." : "Verifying..."}
                    </span>
                  </>
                ) : isApiVerified ? (
                  <>
                    <HiCheckCircle className="text-green-500 text-lg" />
                    <span className="text-green-400">
                      API Verified
                    </span>
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
            {isOpen ? (
              <button
                onClick={() => setShowTaskDropdown(!showTaskDropdown)}
                disabled={!isApiVerified && Object.keys(availableModels).length === 0}
                className={`w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white transition-colors ${
                  !isApiVerified && Object.keys(availableModels).length === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-700"
                }`}
              >
                <span>
                  {taskTypes.find((task) => task.id === selectedTask)?.name ||
                    "Select Task"}
                </span>
                <HiChevronDown
                  className={`text-gray-400 transition-transform ${
                    showTaskDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              // Show unclickable icon when sidebar is closed
              <div className="flex justify-center">
                <div
                  className={`p-3 bg-gray-800 border border-gray-600 rounded-lg cursor-not-allowed ${
                    !isApiVerified ? "opacity-50" : ""
                  }`}
                >
                  <RiRobot2Line className="text-gray-300 text-xl" />
                </div>
              </div>
            )}

            {showTaskDropdown && isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {taskTypes
                  .filter(task => availableModels[task.id] && availableModels[task.id].length > 0)
                  .map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedTask === task.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{task.name}</span>
                      <span className="text-xs text-gray-400">
                        ({availableModels[task.id]?.length || 0})
                      </span>
                    </div>
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
            {isOpen ? (
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                disabled={!getCurrentModels() || getCurrentModels().length === 0}
                className={`w-full flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white transition-colors ${
                  !getCurrentModels() || getCurrentModels().length === 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="truncate">
                  {getCurrentModels().find(
                    (model) => model.id === selectedModel
                  )?.name || "Select Model"}
                </span>
                <HiChevronDown
                  className={`text-gray-400 transition-transform ${
                    showModelDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
            ) : (
              // Show unclickable icon when sidebar is closed
              <div className="flex justify-center">
                <div
                  className={`p-3 bg-gray-800 border border-gray-600 rounded-lg cursor-not-allowed ${
                    !isApiVerified ? "opacity-50" : ""
                  }`}
                >
                  <HiKey className="text-gray-300 text-xl" />
                </div>
              </div>
            )}

            {showModelDropdown && isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getCurrentModels().map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                      selectedModel === model.id
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }`}
                  >
                    <div className="truncate" title={model.name}>
                      {model.name}
                    </div>
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
                ? `Ready! ${getCurrentModels().length} models available for ${selectedTask}`
                : "Please verify your API key to enable model selection."}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {isOpen ? (
          <div className="text-center">
            <p className="text-xs text-gray-400">
              {isApiVerified ? 
                `✅ API Verified` : 
                "🔒 API Required"}
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