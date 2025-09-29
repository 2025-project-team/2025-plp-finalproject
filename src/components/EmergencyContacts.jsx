import React, { useState } from "react";
import { mockEmergencyContacts } from "../lib/mockData";

const EmergencyContacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Contacts", icon: "" },
    { id: "emergency", label: "Emergency", icon: "" },
    { id: "medical", label: "Medical", icon: "" },
    { id: "support", label: "Support", icon: "" },
  ];

  const filteredContacts = mockEmergencyContacts.filter(contact =>
    (selectedCategory === "all" || contact.type === selectedCategory) &&
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.number.includes(searchTerm))
  );

  const getContactTypeColor = (type) => {
    switch (type) {
      case "emergency": return "bg-red-100 text-red-800 border-red-200";
      case "medical": return "bg-blue-100 text-blue-800 border-blue-200";
      case "support": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getContactIcon = (type) => {
    switch (type) {
      case "emergency": return "";
      case "medical": return "";
      case "support": return "";
      default: return "";
    }
  };

  const handleCall = (number, name) => {
    if (!number) {
      alert(`No phone number available for ${name}`);
      return;
    }

    const cleanNumber = number.replace(/[^\d+]/g, "");
    
    if (navigator.userAgent.includes("Mobi")) {
      window.location.href = `tel:${cleanNumber}`;
    } else {
      if (confirm(`Call ${name} at ${number}?`)) {
        alert(`To call ${name}, dial: ${number}\n\nOn a mobile device, this would automatically dial the number.`);
      }
    }
  };

  const handleSMS = (number, name) => {
    if (!number) {
      alert(`No phone number available for ${name}`);
      return;
    }

    const cleanNumber = number.replace(/[^\d+]/g, "");
    
    if (navigator.userAgent.includes("Mobi")) {
      window.location.href = `sms:${cleanNumber}`;
    } else {
      alert(`Preparing SMS to ${name}: ${number}`);
    }
  };

  const openDirections = (contactName) => {
    // For emergency contacts, we'll open a general search for the service
    const searchQuery = encodeURIComponent(`${contactName} near me`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contacts</h1>
        <p className="text-gray-600">Quick access to emergency services and support lines</p>
      </div>

      <div className="bg-red-500 text-white p-4 rounded-lg text-center">
        <p className="font-semibold text-lg">
           IN CASE OF LIFE-THREATENING EMERGENCY, CALL 911 IMMEDIATELY
        </p>
        <p className="text-sm mt-1">
          Do not hesitate to call for immediate medical assistance
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts by name, number, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                
              </div>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Emergency Dial</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCall("911", "Emergency Services")}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-4 rounded-lg transition-all hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2"></div>
            <div className="text-xl font-semibold">911</div>
            <div className="text-sm opacity-90">Emergency Services</div>
          </button>
          
          <button
            onClick={() => handleCall("988", "Crisis Hotline")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-6 px-4 rounded-lg transition-all hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2"></div>
            <div className="text-xl font-semibold">988</div>
            <div className="text-sm opacity-90">Crisis & Suicide Hotline</div>
          </button>
          
          <button
            onClick={() => handleCall("1-800-222-1222", "Poison Control")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 px-4 rounded-lg transition-all hover:scale-105 text-center"
          >
            <div className="text-3xl mb-2"></div>
            <div className="text-lg font-semibold">1-800-222-1222</div>
            <div className="text-sm opacity-90">Poison Control</div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredContacts.length} Contacts
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <div key={contact._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                    {getContactIcon(contact.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-gray-600">{contact.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getContactTypeColor(contact.type)}`}>
                        {contact.type.toUpperCase()}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{contact.number}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleCall(contact.number, contact.name)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2 min-w-[120px] justify-center"
                  >
                    <span></span>
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleSMS(contact.number, contact.name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2 min-w-[120px] justify-center"
                  >
                    <span></span>
                    <span>Message</span>
                  </button>
                  <button
                    onClick={() => openDirections(contact.name)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2 min-w-[120px] justify-center"
                  >
                    <span></span>
                    <span>Find</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredContacts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2"></div>
              <p className="text-lg">No contacts found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Emergency Preparedness Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">Save Important Numbers</p>
                <p className="text-blue-700 text-sm">Save emergency contacts in your phone for quick access</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">Know Your Location</p>
                <p className="text-blue-700 text-sm">Always be ready to provide your exact location to emergency services</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">Emergency Plan</p>
                <p className="text-blue-700 text-sm">Have a family emergency plan and meeting points</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">First Aid Kit</p>
                <p className="text-blue-700 text-sm">Keep a well-stocked first aid kit at home and in your car</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">Medical Information</p>
                <p className="text-blue-700 text-sm">Keep a list of medications and medical conditions handy</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg"></span>
              <div>
                <p className="font-medium text-blue-900">Stay Calm</p>
                <p className="text-blue-700 text-sm">Remain calm and speak clearly when calling for help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;
