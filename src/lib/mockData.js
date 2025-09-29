export const mockEmergencies = [
  {
    _id: "1",
    type: "cardiac",
    severity: "high",
    location: {
      address: "Downtown Medical Center",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    description: "Cardiac emergency reported",
    reporter: {
      name: "John Doe",
      phone: "+1234567890"
    },
    status: "reported",
    numberOfPeople: 1,
    createdAt: new Date().toISOString(),
    responders: []
  },
  {
    _id: "2",
    type: "respiratory",
    severity: "medium",
    location: {
      address: "Community Park",
      coordinates: { lat: 40.7138, lng: -74.0070 }
    },
    description: "Asthma attack emergency",
    reporter: {
      name: "Jane Smith",
      phone: "+1234567891"
    },
    status: "dispatched",
    numberOfPeople: 1,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    responders: [
      {
        name: "Paramedic Team A",
        role: "paramedic",
        status: "dispatched"
      }
    ]
  }
];

export const mockHealthResources = [
  {
    _id: "1",
    name: "General Hospital",
    type: "hospital",
    location: {
      address: "123 Main Street",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    contact: {
      phone: "+1-555-0101",
      email: "info@generalhospital.com"
    },
    services: ["Emergency", "Surgery", "ICU"],
    waitTime: "15 min",
    distance: "0.5 miles",
    available: true,
    operatingHours: {
      open: "00:00",
      close: "23:59",
      timezone: "EST"
    }
  },
  {
    _id: "2",
    name: "Urgent Care Center",
    type: "clinic",
    location: {
      address: "456 Oak Avenue",
      coordinates: { lat: 40.7138, lng: -74.0070 }
    },
    contact: {
      phone: "+1-555-0102",
      email: "care@urgentcare.com"
    },
    services: ["Urgent Care", "X-Ray", "Lab Tests"],
    waitTime: "30 min",
    distance: "1.2 miles",
    available: true,
    operatingHours: {
      open: "08:00",
      close: "20:00",
      timezone: "EST"
    }
  }
];

export const mockEmergencyContacts = [
  {
    _id: "1",
    name: "Emergency Services",
    number: "911",
    type: "emergency",
    description: "Police, Fire, Ambulance"
  },
  {
    _id: "2",
    name: "Poison Control",
    number: "1-800-222-1222",
    type: "emergency",
    description: "24/7 Poison Help"
  },
  {
    _id: "3",
    name: "Crisis Hotline",
    number: "988",
    type: "support",
    description: "Mental Health Support"
  }
];

export const mockAIMessages = [
  {
    id: 1,
    type: "ai",
    content: "Hello! I'm your AI Health Assistant. I can help with emergency guidance, first aid instructions, and health information. What do you need help with?",
    timestamp: new Date()
  }
];
