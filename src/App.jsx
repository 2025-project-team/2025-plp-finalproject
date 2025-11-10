import React, { useState, useEffect } from "react";
import EmergencyDashboard from "./components/EmergencyDashboard";
import AIHealthAssistant from "./components/AIHealthAssistant";
import EmergencyReportForm from "./components/EmergencyReportForm";
import CommunityHealthMap from "./components/CommunityHealthMap";
import EmergencyContacts from "./components/EmergencyContacts";
import HealthResources from "./components/HealthResources";
import SocketService from "./services/socket";
import PaymentButton from "./components/PaymentButton";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newEmergencyAlert, setNewEmergencyAlert] = useState(null);
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    const socket = SocketService.connect();

    SocketService.on("new-emergency", (emergencyData) => {
      setNewEmergencyAlert(emergencyData);
      setTimeout(() => setNewEmergencyAlert(null), 10000);
    });

    checkBackendStatus();

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(
        "https://community-health-emergency.onrender.com/api/health",
      );
      if (response.ok) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("error");
      }
    } catch (error) {
      setBackendStatus("error");
    }
  };

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "",
      description: "Emergency Overview",
    },
    {
      id: "assistant",
      label: "AI Assistant",
      icon: "",
      description: "Health Guidance",
    },
    {
      id: "report",
      label: "Report",
      icon: "",
      description: "Emergency Report",
    },
    {
      id: "map",
      label: "Health Map",
      icon: "",
      description: "Locations & Resources",
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: "",
      description: "Emergency Numbers",
    },
    {
      id: "resources",
      label: "Resources",
      icon: "",
      description: "First Aid & Info",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EmergencyDashboard />;
      case "assistant":
        return <AIHealthAssistant />;
      case "report":
        return <EmergencyReportForm />;
      case "map":
        return <CommunityHealthMap />;
      case "contacts":
        return <EmergencyContacts />;
      case "resources":
        return <HealthResources />;
      default:
        return <EmergencyDashboard />;
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case "connected":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case "connected":
        return "Live";
      case "error":
        return "Offline";
      default:
        return "Connecting...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {newEmergencyAlert && (
        <div className="bg-red-500 text-white p-4 animate-pulse">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">NEW EMERGENCY ALERT</p>
                <p className="text-sm">
                  {newEmergencyAlert.description}
                  Location: {newEmergencyAlert.location?.address}
                  Severity: {newEmergencyAlert.severity?.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setNewEmergencyAlert(null)}
                className="text-white hover:text-gray-200 text-xl"
              ></button>
            </div>
          </div>
        </div>
      )}

      <header className="health-gradient text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl"></div>
              <div>
                <h1 className="text-2xl font-bold">
                  Community Health Emergency
                </h1>
                <p className="text-blue-100">
                  AI-Powered Emergency Response System
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getStatusColor()}`}
            >
              {getStatusText()}
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg min-w-[80px] transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "text-gray-600 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium text-sm whitespace-nowrap">
                  {tab.label}
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  {tab.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {/* Add the Upgrade button here */}
        <div className="mb-6 flex justify-end">
          <PaymentButton />
        </div>
        {renderContent()}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Community Health Emergency App For emergencies, call 911 immediately
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This is a demonstration application. Always seek professional
            medical help in emergencies.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
