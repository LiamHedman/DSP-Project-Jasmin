let socket: WebSocket | null = null;

type Message = {
  chatId: string;
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

type InitOptions = {
  chatId: string;
  onMessage: (message: Message) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
};

export const connectWebSocket = ({ chatId, onMessage, onOpen, onClose, onError }: InitOptions) => {
  socket = new WebSocket('ws://localhost:3000');

  socket.onopen = () => {
    console.log('Connected to WebSocket');
    socket?.send(JSON.stringify({ type: 'join', chatId }));
    onOpen?.();
  };

  socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          onMessage(data.message);
        }
    } catch (error) {
        console.log("ERROR");
        console.log(event.data);
        
    }
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
    onClose?.();
  };

  socket.onerror = (e) => {
    console.error('WebSocket error', e);
    onError?.(e);
  };
};

export const sendMessage = (message: Message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'message', message }));
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};