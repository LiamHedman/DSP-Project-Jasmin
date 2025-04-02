

let webSocket: WebSocket | null = null;

export const getWebSocket = () => {
  if (!webSocket || webSocket.readyState === WebSocket.CLOSED) {
    webSocket = new WebSocket('ws://localhost:3000');
    
    webSocket.onopen = () => console.log('WebSocket connected');
    webSocket.onmessage = (e) => console.log('Message received:', e.data);
    webSocket.onerror = (e) => console.log('WebSocket error:', e);
    webSocket.onclose = (e) => console.log('WebSocket closed:', e.code, e.reason);
  }
  return webSocket;
};

