"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type WebSocketMessage = {
  type: string;
  message: any;
};

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export const useWebSocket = ({ 
  url, 
  onMessage, 
  reconnectAttempts = 5, 
  reconnectInterval = 3000 
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log(`WebSocket connected to ${url}`);
        setIsConnected(true);
        setError(null);
        reconnectCount.current = 0; // Reset reconnect count on success
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) {
            onMessage(data);
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.current.onerror = (event) => {
        // Silencing console.error to avoid Next.js overlay during development
        console.warn("WebSocket connection issue:", event);
        setError(event);
      };

      ws.current.onclose = () => {
        console.log(`WebSocket disconnected from ${url}`);
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectCount.current < reconnectAttempts) {
          reconnectCount.current += 1;
          console.log(`Attempting to reconnect (${reconnectCount.current}/${reconnectAttempts}) in ${reconnectInterval}ms...`);
          setTimeout(connect, reconnectInterval);
        }
      };
    } catch (e) {
      console.warn("Failed to establish WebSocket connection:", e);
    }
  }, [url, onMessage, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  }, []);

  return { isConnected, error, sendMessage };
};
