import React, { useState, useEffect } from "react";
import { emergenciesAPI } from "../services/api";
import { mockEmergencies } from "../lib/mockData";

const EmergencyDashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadEmergencies();
    
    const interval = setInterval(loadEmergencies, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadEmergencies = async () => {
    try {
      const response = await emergenciesAPI.getActiveEmergencies();
      setEmergencies(response.data.emergencies);
      setUseMockData(false);
    } catch (error) {
      console.error("Error loading emergencies, using mock data:", error);
      setEmergencies(mockEmergencies.filter(e => e.status !== "resolved"));
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const activeEmergencies = emergencies.filter(emergency => 
    emergency.status !== "resolved" && emergency.status !== "cancelled"
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reported": return "bg-orange-100 text-orange-800";
      case "dispatched": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-purple-100 text-purple-800";
      case "resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading emergencies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {useMockData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2"></span>
            <p className="text-yellow-800">
              Using demonstration data. Backend connection unavailable.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Emergencies</p>
              <p className="text-2xl font-bold text-red-600">{activeEmergencies.length}</p>
            </div>
            <div className="text-2xl"></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Responders Online</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="text-2xl"></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-blue-600">8 min</p>
            </div>
            <div className="text-2xl"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resources Available</p>
              <p className="text-2xl font-bold text-purple-600">24</p>
            </div>
            <div className="text-2xl"></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Active Emergencies</h2>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {activeEmergencies.length} Active
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {activeEmergencies.map((emergency) => (
            <div key={emergency._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(emergency.severity)}`}>
                    {emergency.severity.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{emergency.description}</h3>
                    <p className="text-sm text-gray-600">
                       {emergency.location?.address}  
                       {emergency.numberOfPeople} person(s)
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(emergency.status)}`}>
                        {emergency.status.replace("-", " ").toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">
                        Reported {new Date(emergency.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Reporter: {emergency.reporter?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Type: {emergency.type}
                  </p>
                </div>
              </div>
              
              {emergency.responders && emergency.responders.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Responders:</p>
                  <div className="flex flex-wrap gap-2">
                    {emergency.responders.map((responder, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {responder.name} ({responder.role})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {activeEmergencies.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2"></div>
              <p className="text-lg">No active emergencies</p>
              <p className="text-sm">All clear at the moment</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.hash = "report"}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center space-x-3 text-lg"
          >
            <span></span>
            <span>Report Emergency</span>
          </button>
          
          <button 
            onClick={() => window.location.hash = "assistant"}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-center space-x-3 text-lg"
          >
            <span></span>
            <span>AI Health Assistant</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
