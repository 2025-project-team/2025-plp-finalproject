import React, { useState } from "react";
import { mockHealthResources } from "../lib/mockData";

const HealthResources = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedResource, setExpandedResource] = useState(null);

  const categories = [
    { id: "all", label: "All Resources", icon: "", color: "bg-blue-500" },
    { id: "first-aid", label: "First Aid", icon: "", color: "bg-red-500" },
    { id: "emergency", label: "Emergency Procedures", icon: "", color: "bg-orange-500" },
    { id: "symptoms", label: "Symptom Checker", icon: "", color: "bg-purple-500" },
    { id: "prevention", label: "Prevention", icon: "", color: "bg-green-500" },
  ];

  const healthResources = [
    {
      id: 1,
      title: "CPR - Cardiopulmonary Resuscitation",
      category: "first-aid",
      description: "Learn how to perform CPR on adults, children, and infants",
      emergency: true,
      icon: "",
      steps: [
        "Check for responsiveness - tap and shout \"Are you OK?\"",
        "Call 911 or emergency services immediately",
        "Place heel of hand on center of chest, other hand on top",
        "Perform chest compressions: 2 inches deep, 100-120 per minute",
        "Give rescue breaths if trained: 30 compressions to 2 breaths",
        "Continue until help arrives or person shows signs of life"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 2,
      title: "Heimlich Maneuver for Choking",
      category: "first-aid",
      description: "First aid procedure for conscious choking victims",
      emergency: true,
      icon: "",
      steps: [
        "Ask \"Are you choking?\" - if they nod, proceed",
        "Stand behind person, wrap arms around their waist",
        "Make a fist, place thumb side above navel, below ribcage",
        "Grasp fist with other hand, give quick upward thrusts",
        "Continue until object is expelled or person becomes unconscious",
        "If unconscious, begin CPR starting with chest compressions"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 3,
      title: "Stroke Recognition - FAST Method",
      category: "symptoms",
      description: "Identify stroke symptoms quickly for immediate treatment",
      emergency: true,
      icon: "",
      steps: [
        "F - Face: Ask person to smile. Does one side droop?",
        "A - Arms: Ask person to raise both arms. Does one drift down?",
        "S - Speech: Ask person to repeat a simple phrase. Is speech slurred or strange?",
        "T - Time: If any of these signs are present, call 911 immediately",
        "Note time when symptoms first appeared",
        "Do not give food, drink, or medication"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 4,
      title: "Severe Allergic Reaction - Anaphylaxis",
      category: "emergency",
      description: "Emergency response for severe allergic reactions",
      emergency: true,
      icon: "",
      steps: [
        "Use epinephrine auto-injector immediately if available",
        "Call 911 or emergency services",
        "Help person sit in comfortable position, ease breathing",
        "Monitor breathing and consciousness closely",
        "If unconscious, place in recovery position",
        "Do not give oral medications or wait to see if symptoms improve"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 5,
      title: "Burn Treatment",
      category: "first-aid",
      description: "First aid for different types and degrees of burns",
      emergency: false,
      icon: "",
      steps: [
        "Cool the burn with cool running water for 10-15 minutes",
        "Remove jewelry and tight clothing before swelling occurs",
        "Cover with sterile, non-stick dressing (no cotton)",
        "Do not apply ice, butter, or ointments",
        "Take pain reliever if needed (ibuprofen or acetaminophen)",
        "Seek medical attention for severe burns or if infected"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 6,
      title: "Heart Attack Symptoms & Response",
      category: "symptoms",
      description: "Recognize heart attack warning signs and immediate actions",
      emergency: true,
      icon: "",
      steps: [
        "Chest pain or discomfort (pressure, squeezing, fullness)",
        "Pain in arms, back, neck, jaw, or stomach",
        "Shortness of breath, with or without chest discomfort",
        "Cold sweat, nausea, lightheadedness",
        "Call 911 immediately - do not drive yourself",
        "Chew and swallow aspirin if not allergic, while waiting for help"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 7,
      title: "Seizure First Aid",
      category: "emergency",
      description: "How to help someone having a seizure",
      emergency: true,
      icon: "",
      steps: [
        "Stay calm and time the seizure",
        "Clear area of hard or sharp objects",
        "Place something soft under head",
        "Turn person on their side to keep airway clear",
        "Do not put anything in mouth or restrain person",
        "Call 911 if seizure lasts more than 5 minutes or person is injured"
      ],
      videoLink: "#",
      printableGuide: "#"
    },
    {
      id: 8,
      title: "Heat Stroke Prevention & Treatment",
      category: "prevention",
      description: "Recognize and treat heat-related emergencies",
      emergency: true,
      icon: "",
      steps: [
        "Move to cool, shaded area immediately",
        "Remove excess clothing",
        "Cool with water, wet cloths, or ice packs",
        "Do not give alcohol or caffeine",
        "Seek medical attention if confused, vomiting, or unconscious",
        "Prevent with hydration and limited sun exposure"
      ],
      videoLink: "#",
      printableGuide: "#"
    }
  ];

  const filteredResources = healthResources.filter(resource =>
    (selectedCategory === "all" || resource.category === selectedCategory) &&
    (resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleExpand = (resourceId) => {
    setExpandedResource(expandedResource === resourceId ? null : resourceId);
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Health Resources & First Aid</h1>
        <p className="text-gray-600">Emergency procedures, first aid guides, and health information</p>
      </div>

      <div className="bg-red-500 text-white p-4 rounded-lg text-center">
        <p className="font-semibold text-lg">
           These resources are for informational purposes only. In emergencies, call 911 immediately.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search health resources, procedures, or symptoms..."
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
                    ? `${category.color} text-white shadow-md`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all ${
              resource.emergency ? "border-red-200" : "border-gray-200"
            } ${expandedResource === resource.id ? "ring-2 ring-blue-500" : ""}`}
          >
            <div className={`p-6 rounded-t-lg cursor-pointer ${
              resource.emergency ? "bg-red-50 border-b border-red-200" : "bg-blue-50 border-b border-blue-200"
            }`}
            onClick={() => toggleExpand(resource.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{resource.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{resource.title}</h3>
                      {resource.emergency && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{resource.description}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColor(resource.category)}`}>
                        {categories.find(c => c.id === resource.category)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {resource.steps.length} steps
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 text-xl">
                  {expandedResource === resource.id ? "" : "+"}
                </button>
              </div>
            </div>

            {expandedResource === resource.id && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Procedure Steps:</h4>
                  <ol className="space-y-3">
                    {resource.steps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full text-sm flex items-center justify-center font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-600 text-lg mt-0.5"></span>
                    <div>
                      <p className="font-semibold text-yellow-800">Important Notes</p>
                      <ul className="text-yellow-700 text-sm mt-2 space-y-1">
                        <li> Always call 911 for life-threatening emergencies</li>
                        <li> Get proper training from certified organizations</li>
                        <li> These instructions are for informational purposes only</li>
                        <li> Laws and procedures may vary by location</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2">
                    <span></span>
                    <span>Watch Video Guide</span>
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2">
                    <span></span>
                    <span>Printable Guide</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search terms or category filters</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nearby Health Facilities</h2>
          <p className="text-gray-600">Find medical resources in your area</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {mockHealthResources.map((facility) => (
            <div key={facility._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                    {facility.type === "hospital" ? "" : 
                     facility.type === "clinic" ? "" : ""}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
                    <p className="text-gray-600 capitalize">{facility.type}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <span></span>
                        <span>{facility.distance}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span></span>
                        <span>{facility.waitTime} wait</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span></span>
                        <span>{facility.contact.phone}</span>
                      </span>
                      {facility.services && (
                        <span className="flex items-center space-x-1">
                          <span></span>
                          <span>{facility.services.slice(0, 2).join(", ")}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2">
                    <span></span>
                    <span>Directions</span>
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2">
                    <span></span>
                    <span>Call</span>
                  </button>
                </div>
              </div>
              
              {facility.operatingHours && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Hours: </span>
                    {facility.operatingHours.open} - {facility.operatingHours.close} 
                    ({facility.operatingHours.timezone})
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4"> Be Prepared for Emergencies</h2>
          <p className="text-blue-100 text-lg mb-6">
            Create your emergency plan and build your first aid kit today
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl mb-2"></div>
              <h3 className="font-semibold mb-2">Emergency Plan</h3>
              <p className="text-blue-100 text-sm">Create family emergency contacts and meeting points</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl mb-2"></div>
              <h3 className="font-semibold mb-2">First Aid Kit</h3>
              <p className="text-blue-100 text-sm">Essential supplies for home and travel</p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-3xl mb-2"></div>
              <h3 className="font-semibold mb-2">Emergency Apps</h3>
              <p className="text-blue-100 text-sm">Download emergency alert and first aid apps</p>
            </div>
          </div>
          <button className="mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-lg transition-colors">
            Download Emergency Preparedness Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthResources;
