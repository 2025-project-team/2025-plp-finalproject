import React, { useState, useEffect } from "react";
import { emergenciesAPI } from "../services/api";
import { mockHealthResources, mockEmergencies } from "../lib/mockData";

const CommunityHealthMap = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const [healthResources, setHealthResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const filters = [
    { id: "all", label: "All", icon: "", color: "bg-blue-500" },
    { id: "hospitals", label: "Hospitals", icon: "", color: "bg-green-500" },
    { id: "clinics", label: "Clinics", icon: "", color: "bg-purple-500" },
    { id: "pharmacies", label: "Pharmacies", icon: "", color: "bg-orange-500" },
    { id: "emergencies", label: "Emergencies", icon: "", color: "bg-red-500" },
  ];

  useEffect(() => {
    loadData();
    
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [emergenciesResponse] = await Promise.all([
        emergenciesAPI.getActiveEmergencies(),
      ]);
      
      setEmergencies(emergenciesResponse.data.emergencies);
      setHealthResources(mockHealthResources);
      setUseMockData(false);
    } catch (error) {
      console.error("Error loading map data, using mock data:", error);
      setEmergencies(mockEmergencies.filter(e => e.status !== "resolved"));
      setHealthResources(mockHealthResources);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLocations = () => {
    const allLocations = [
      ...healthResources.map(resource => ({ ...resource, type: "resource" })),
      ...emergencies.map(emergency => ({ ...emergency, type: "emergency" }))
    ];

    if (selectedFilter === "all") return allLocations;
    if (selectedFilter === "emergencies") return allLocations.filter(item => item.type === "emergency");
    
    return allLocations.filter(item => 
      item.type === "resource" && item.type === selectedFilter.slice(0, -1)
    );
  };

  const getIcon = (item) => {
    if (item.type === "emergency") {
      return item.severity === "high" ? "" : "";
    }
    
    switch (item.type) {
      case "hospital": return "";
      case "clinic": return "";
      case "pharmacy": return "";
      default: return "";
    }
  };

  const getMarkerColor = (item) => {
    if (item.type === "emergency") {
      return item.severity === "high" ? "bg-red-500" : 
             item.severity === "medium" ? "bg-yellow-500" : "bg-green-500";
    }
    
    switch (item.type) {
      case "hospital": return "bg-green-500";
      case "clinic": return "bg-purple-500";
      case "pharmacy": return "bg-orange-500";
      default: return "bg-blue-500";
    }
  };

  const getDistance = (index) => {
    const distances = ["0.3 miles", "0.5 miles", "0.8 miles", "1.2 miles", "1.5 miles", "2.0 miles"];
    return distances[index % distances.length];
  };

  // Function to open directions
  const openDirections = (location) => {
    if (!location || !location.location || !location.location.address) {
      alert("No address available for directions");
      return;
    }

    const address = encodeURIComponent(location.location.address);
    
    // Try to get user's current location for better directions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Use Google Maps with user's current location as start
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${address}&travelmode=driving`;
          window.open(mapsUrl, "_blank");
        },
        () => {
          // Fallback: just use the destination address
          const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving`;
          window.open(mapsUrl, "_blank");
        }
      );
    } else {
      // Fallback for browsers without geolocation
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${address}&travelmode=driving`;
      window.open(mapsUrl, "_blank");
    }
  };

  // Function to handle phone calls
  const handleCall = (phoneNumber, name) => {
    if (!phoneNumber) {
      alert(`No phone number available for ${name}`);
      return;
    }

    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    
    if (navigator.userAgent.includes("Mobi")) {
      // Mobile device
      window.location.href = `tel:${cleanNumber}`;
    } else {
      // Desktop - show confirmation
      if (confirm(`Call ${name} at ${phoneNumber}?`)) {
        // On desktop, we can't initiate calls, so show a message
        alert(`To call ${name}, dial: ${phoneNumber}\n\nOn a mobile device, this would automatically dial the number.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-600">Loading map data...</div>
      </div>
    );
  }

  const filteredLocations = getFilteredLocations();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Community Health Map</h2>
            <p className="text-gray-600">Real-time emergency locations and health resources</p>
          </div>
          <div className="flex items-center space-x-2">
            {useMockData && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Data
              </span>
            )}
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Live Tracking
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? `${filter.color} text-white shadow-md`
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{filter.icon}</span>
              <span className="font-medium">{filter.label}</span>
              <span className="bg-black bg-opacity-20 px-2 py-1 rounded text-xs">
                {filter.id === "all" ? filteredLocations.length : 
                 filter.id === "emergencies" ? emergencies.length : 
                 healthResources.filter(r => r.type === filter.id.slice(0, -1)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-100 rounded-lg h-96 relative overflow-hidden mb-6 border-2 border-gray-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-300 transform -translate-y-1/2"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-300 transform -translate-x-1/2"></div>
            
            <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gray-400 rounded transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/4 right-1/4 w-20 h-12 bg-gray-500 rounded transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-1/4 left-1/3 w-12 h-20 bg-gray-400 rounded transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-gray-500 rounded transform translate-x-1/2 translate-y-1/2"></div>

            {filteredLocations.map((location, index) => {
              const left = 20 + (index * 18) % 70;
              const top = 20 + (index * 22) % 70;
              
              return (
                <div
                  key={location._id || location.id}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2 shadow-lg hover:scale-110 transition-transform ${
                    getMarkerColor(location)
                  } ${selectedLocation?._id === location._id ? "ring-4 ring-opacity-50 ring-blue-400 scale-125 z-10" : ""}`}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  onClick={() => setSelectedLocation(location)}
                >
                  <span className="text-lg">{getIcon(location)}</span>
                </div>
              );
            })}

            <div className="absolute w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ring-4 ring-blue-200 z-20 shadow-lg">
              
            </div>
          </div>

          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-300 max-w-xs">
            <h4 className="font-semibold text-gray-900 mb-3">Map Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"></div>
                <span className="text-gray-700">High Priority Emergency</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs"></div>
                <span className="text-gray-700">Medium Priority Emergency</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"></div>
                <span className="text-gray-700">Hospital</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"></div>
                <span className="text-gray-700">Your Location</span>
              </div>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
            <button 
              onClick={() => alert("Zoom in feature - would integrate with real maps API")}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              
            </button>
            <button 
              onClick={() => alert("Zoom out feature - would integrate with real maps API")}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              
            </button>
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => alert("Location found! Centering map..."),
                    () => alert("Unable to get your location")
                  );
                } else {
                  alert("Geolocation is not supported by this browser");
                }
              }}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              
            </button>
          </div>
        </div>

        {selectedLocation && (
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getIcon(selectedLocation)}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedLocation.name || selectedLocation.description}
                  </h3>
                  <p className="text-gray-600 capitalize">
                    {selectedLocation.type === "emergency" ? "Emergency" : selectedLocation.type}
                    {selectedLocation.severity && `  ${selectedLocation.severity.toUpperCase()} Priority`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {selectedLocation.location?.address && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{selectedLocation.location.address}</p>
                </div>
              )}
              
              {selectedLocation.distance && (
                <div>
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="font-medium text-gray-900">{selectedLocation.distance}</p>
                </div>
              )}
              
              {selectedLocation.contact?.phone && (
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  <p className="font-medium text-gray-900">{selectedLocation.contact.phone}</p>
                </div>
              )}
              
              {selectedLocation.reporter?.name && (
                <div>
                  <p className="text-sm text-gray-600">Reported By</p>
                  <p className="font-medium text-gray-900">{selectedLocation.reporter.name}</p>
                </div>
              )}
              
              {selectedLocation.status && (
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${
                    selectedLocation.status === "reported" ? "text-orange-600" :
                    selectedLocation.status === "dispatched" ? "text-blue-600" :
                    selectedLocation.status === "in-progress" ? "text-purple-600" :
                    "text-green-600"
                  }`}>
                    {selectedLocation.status.replace("-", " ").toUpperCase()}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => openDirections(selectedLocation)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                <span></span>
                <span>Get Directions</span>
              </button>
              {selectedLocation.contact?.phone && (
                <button 
                  onClick={() => handleCall(selectedLocation.contact.phone, selectedLocation.name || selectedLocation.description)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span></span>
                  <span>Call Now</span>
                </button>
              )}
              {selectedLocation.type === "emergency" && (
                <button 
                  onClick={() => alert("Emergency response feature - would notify responders in real app")}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span></span>
                  <span>Respond</span>
                </button>
              )}
            </div>
          </div>
        )}

        {!selectedLocation && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {filteredLocations.length} Locations Found
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {filteredLocations.map((location, index) => (
                <div
                  key={location._id || location.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getIcon(location)}</span>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 truncate">
                        {location.name || location.description}
                      </h5>
                      <p className="text-sm text-gray-600 truncate">
                        {location.location?.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded ${
                      location.type === "emergency" 
                        ? location.severity === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {location.type === "emergency" ? "Emergency" : location.type}
                    </span>
                    <span className="text-gray-500">
                      {getDistance(index)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHealthMap;
