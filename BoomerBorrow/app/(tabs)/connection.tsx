import React, { useEffect, useState } from "react";

// === Original WebSocket logic (unchanged) ===
let webSocket: WebSocket | null = null;

export const getWebSocket = () => {
  if (!webSocket || webSocket.readyState === WebSocket.CLOSED) {
    webSocket = new WebSocket("ws://localhost:3000");

    webSocket.onopen = () => console.log("WebSocket connected");
    webSocket.onmessage = (e) => console.log("Message received:", e.data);
    webSocket.onerror = (e) => console.log("WebSocket error:", e);
    webSocket.onclose = (e) =>
      console.log("WebSocket closed:", e.code, e.reason);
  }
  return webSocket;
};

// === Updated ConnectionScreen with clean toggle display ===
const ConnectionScreen = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionInfo, setConnectionInfo] = useState<any>({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const nav = navigator as any;
    const conn =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    const updateConnectionInfo = () => {
      if (conn) {
        setConnectionInfo({
          effectiveType: conn.effectiveType,
          downlink: conn.downlink,
          rtt: conn.rtt,
          saveData: conn.saveData,
        });
      }
    };

    updateConnectionInfo();
    if (conn && conn.addEventListener) {
      conn.addEventListener("change", updateConnectionInfo);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener("change", updateConnectionInfo);
      }
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Connection Screen</h2>

      <div style={{ marginBottom: 10 }}>
        <strong>Internet Status:</strong> {isOnline ? "Online 🌐" : "Offline ❌"}
      </div>

      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Connection Details" : "Show Connection Details"}
      </button>

      {showDetails && (
        <ul style={{ marginTop: 10 }}>
          <li><strong>Effective type:</strong> {connectionInfo.effectiveType || "N/A"}</li>
          <li><strong>Downlink:</strong> {connectionInfo.downlink ?? "N/A"} Mbps</li>
          <li><strong>RTT:</strong> {connectionInfo.rtt ?? "N/A"} ms</li>
          <li><strong>Data saver mode:</strong> {connectionInfo.saveData ? "Enabled" : "Disabled"}</li>
        </ul>
      )}
    </div>
  );
};

export default ConnectionScreen;
