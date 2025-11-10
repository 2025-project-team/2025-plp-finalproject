const API_BASE_URL = "https://community-health-emergency.onrender.com/api";

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Call error:", error);
    throw new Error(error.message || "Network error occurred");
  }
};

export const emergenciesAPI = {
  reportEmergency: (emergencyData) =>
    apiCall("/emergencies", {
      method: "POST",
      body: emergencyData,
    }),

  getEmergencies: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiCall(`/emergencies?${queryParams}`);
  },

  getActiveEmergencies: () => apiCall("/emergencies/active"),

  getEmergency: (id) => apiCall(`/emergencies/${id}`),

  updateEmergencyStatus: (id, status) =>
    apiCall(`/emergencies/${id}/status`, {
      method: "PUT",
      body: { status },
    }),
};

export const aiAPI = {
  chat: (message) =>
    apiCall("/ai/chat", {
      method: "POST",
      body: { message },
    }),
};

export const usersAPI = {
  getProfile: (userId) => apiCall(`/users/profile?userId=${userId}`),

  updateProfile: (userId, updateData) =>
    apiCall("/users/profile", {
      method: "PUT",
      body: { userId, ...updateData },
    }),
};
