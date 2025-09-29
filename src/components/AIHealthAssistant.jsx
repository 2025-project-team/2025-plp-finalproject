import React, { useState, useRef, useEffect } from "react";
import { aiAPI } from "../services/api";
import { mockAIMessages } from "../lib/mockData";

const AIHealthAssistant = () => {
  const [messages, setMessages] = useState(mockAIMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await aiAPI.chat(inputMessage);
      
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.response,
        timestamp: new Date(),
        isMock: response.data.isMock
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setUseMockData(response.data.isMock);
    } catch (error) {
      console.error("AI Chat error:", error);
      const fallbackResponse = getMockAIResponse(inputMessage);
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: fallbackResponse,
        timestamp: new Date(),
        isMock: true,
        isError: true
      };
      setMessages(prev => [...prev, aiResponse]);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getMockAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("911")) {
      return "I understand this is an emergency. Please remain calm. Call 911 immediately and provide your exact location. While waiting for help, can you tell me more about the situation so I can provide guidance?";
    } else if (lowerMessage.includes("pain") || lowerMessage.includes("hurt")) {
      return "I am sorry you are experiencing pain. Can you describe the location and intensity of the pain? Is it sharp, dull, or throbbing? For severe or sudden pain, please seek immediate medical attention.";
    } else if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
      return "For fever management: rest, drink plenty of fluids, and consider taking acetaminophen if appropriate. If fever is above 103F (39.4C) or lasts more than 3 days, or if you have other severe symptoms, seek medical attention.";
    } else if (lowerMessage.includes("allergy") || lowerMessage.includes("reaction")) {
      return "If you are experiencing severe allergic reaction symptoms like difficulty breathing, swelling of face/throat, or dizziness, this is a medical emergency. Use an epinephrine auto-injector if available and call 911 immediately.";
    } else if (lowerMessage.includes("heart") || lowerMessage.includes("chest")) {
      return "Chest pain or heart-related symptoms should always be taken seriously. Please call 911 immediately. While waiting, sit down and try to remain calm. Do not drive yourself to the hospital.";
    } else if (lowerMessage.includes("breath") || lowerMessage.includes("choking")) {
      return "Difficulty breathing is a medical emergency. Call 911 immediately. If someone is choking and cannot breathe, perform the Heimlich maneuver if you are trained.";
    } else {
      return "Thank you for sharing this information. I am here to help with health guidance. For personalized medical advice, please consult with a healthcare professional. Would you like me to help you find nearby medical resources or provide first aid information?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "What should I do in a cardiac emergency?",
    "How to perform CPR?",
    "Symptoms of stroke?",
    "First aid for burns?",
    "Allergic reaction response?"
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              AI
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">AI Health Assistant</h2>
              <p className="text-sm text-gray-600">24/7 Emergency Support & Guidance</p>
            </div>
          </div>
          {useMockData && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
              Demo Mode
            </span>
          )}
        </div>
      </div>

      <div className="bg-red-50 border-b border-red-200 p-3">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-red-500 text-lg"></span>
          <p className="text-red-800 text-sm font-medium">
            For life-threatening emergencies, call 911 immediately
          </p>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className={`flex items-center justify-between mt-2 text-xs ${
                message.type === "user" ? "text-blue-100" : "text-gray-500"
              }`}>
                <span>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </span>
                {message.isMock && (
                  <span className="ml-2"> Demo Response</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none p-4 max-w-[85%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-600 mb-3">Quick questions you can ask:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms or ask for emergency guidance..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors font-semibold self-end"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI responses are for guidance only. Always consult healthcare professionals for medical advice.
        </p>
      </div>
    </div>
  );
};

export default AIHealthAssistant;
