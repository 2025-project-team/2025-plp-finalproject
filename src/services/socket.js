import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    try {
      this.socket = io("https://community-health-emergency.onrender.com/", {
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log(" Connected to server");
        this.isConnected = true;
      });

      this.socket.on("disconnect", () => {
        console.log(" Disconnected from server");
        this.isConnected = false;
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error("Failed to connect to socket:", error);
      return null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  joinEmergency(emergencyId) {
    this.emit("join-emergency", emergencyId);
  }
}

export default new SocketService();
