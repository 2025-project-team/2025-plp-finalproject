import React, { useState } from "react";
import { emergenciesAPI } from "../services/api";
import SocketService from "../services/socket";

const EmergencyReportForm = () => {
  const [formData, setFormData] = useState({
    emergencyType: "",
    severity: "",
    location: "",
    description: "",
    contactNumber: "",
    numberOfPeople: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const emergencyTypes = [
    { value: "cardiac", label: "Cardiac Emergency", icon: "" },
    { value: "respiratory", label: "Respiratory Distress", icon: "" },
    { value: "trauma", label: "Trauma/Injury", icon: "" },
    { value: "allergy", label: "Allergic Reaction", icon: "" },
    { value: "stroke", label: "Stroke Symptoms", icon: "" },
    { value: "seizure", label: "Seizure", icon: "" },
    { value: "unconscious", label: "Unconsciousness", icon: "" },
    { value: "bleeding", label: "Severe Bleeding", icon: "" },
    { value: "other", label: "Other Medical Emergency", icon: "" }
  ];

  const severityLevels = [
    { value: "low", label: "Low", color: "bg-green-500", description: "Non-urgent" },
    { value: "medium", label: "Medium", color: "bg-yellow-500", description: "Urgent" },
    { value: "high", label: "High", color: "bg-red-500", description: "Emergency" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const coordinates = await getApproximateLocation();
      
      const emergencyData = {
        type: formData.emergencyType,
        severity: formData.severity,
        location: {
          address: formData.location,
          coordinates: coordinates
        },
        description: formData.description,
        reporter: {
          name: "Anonymous User",
          phone: formData.contactNumber
        },
        numberOfPeople: parseInt(formData.numberOfPeople)
      };

      const response = await emergenciesAPI.reportEmergency(emergencyData);
      
      SocketService.emit("emergency-reported", response.data.emergency);
      
      setSubmissionResult({
        type: "success",
        message: " Emergency reported successfully! Help is on the way.",
        emergencyId: response.data.emergency._id
      });
      
      setFormData({
        emergencyType: "",
        severity: "",
        location: "",
        description: "",
        contactNumber: "",
        numberOfPeople: 1
      });

    } catch (error) {
      console.error("Error reporting emergency:", error);
      setSubmissionResult({
        type: "error",
        message: `Failed to report emergency: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getApproximateLocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => {
            resolve({ lat: 40.7128, lng: -74.0060 });
          }
        );
      } else {
        resolve({ lat: 40.7128, lng: -74.0060 });
      }
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSeverityChange = (severity) => {
    setFormData({
      ...formData,
      severity
    });
  };

  const handleEmergencyTypeChange = (type) => {
    setFormData({
      ...formData,
      emergencyType: type
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-red-50 rounded-t-lg">
          <div className="flex items-center space-x-4">
            <div className="text-3xl"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Report Emergency</h2>
              <p className="text-red-700">Help is available 24/7. Please provide accurate information.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-500 text-white p-4 text-center">
          <p className="font-semibold text-lg">
             FOR LIFE-THREATENING EMERGENCIES, CALL 911 IMMEDIATELY
          </p>
        </div>

        {submissionResult && (
          <div className={`p-4 text-center ${
            submissionResult.type === "success" 
              ? "bg-green-50 border-b border-green-200 text-green-800" 
              : "bg-red-50 border-b border-red-200 text-red-800"
          }`}>
            <p className="font-semibold">{submissionResult.message}</p>
            {submissionResult.emergencyId && (
              <p className="text-sm mt-1">Emergency ID: {submissionResult.emergencyId}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Type of Emergency *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleEmergencyTypeChange(type.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.emergencyType === type.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Severity Level *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleSeverityChange(level.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.severity === level.value
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${level.color}`}></div>
                    <div>
                      <div className="font-semibold text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your current location, address, or landmark"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Be as specific as possible to help responders find you quickly
            </p>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Number of People Affected
            </label>
            <select
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? "person" : "people"}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Your Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Optional, but helps responders contact you for updates
            </p>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Emergency Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Please describe the emergency situation in detail:
 What happened?
 What are the symptoms?
 Is the person conscious?
 Any known medical conditions?
 Any medications being taken?"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            ></textarea>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !formData.emergencyType || !formData.severity || !formData.location || !formData.description}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all text-xl flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Reporting Emergency...</span>
                </>
              ) : (
                <>
                  <span></span>
                  <span>Report Emergency & Request Help</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-3">
              By submitting, emergency services and nearby responders will be notified immediately
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">While Waiting for Help:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-2">
            <li> Stay calm and keep the person calm</li>
            <li> Do not move the person unless necessary</li>
            <li> Check for breathing and consciousness</li>
            <li> Loosen any tight clothing</li>
          </ul>
          <ul className="space-y-2">
            <li> Keep the person warm with a blanket</li>
            <li> Do not give food or drink</li>
            <li> Have medical information ready</li>
            <li> Clear a path for emergency responders</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyReportForm;
