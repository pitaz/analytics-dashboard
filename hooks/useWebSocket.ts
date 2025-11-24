import { useEffect, useState, useRef } from "react";

interface WebSocketData {
  type: string;
  timestamp: string;
  data: any;
}

export function useWebSocket(url: string) {
  const [data, setData] = useState<WebSocketData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    function connect() {
      try {
        const ws = new WebSocket(url);

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);
            if (isMounted) {
              setData(message);
            }
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
          }
        };

        ws.onerror = (err: Event) => {
          console.error("WebSocket error:", err);
          if (isMounted) {
            setError(new Error("WebSocket connection error"));
            setIsConnected(false);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected");
          setIsConnected(false);

          // Attempt to reconnect after 3 seconds
          if (isMounted) {
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 3000);
          }
        };

        wsRef.current = ws;
      } catch (err) {
        console.error("Error creating WebSocket:", err);
        if (isMounted) {
          setError(err as Error);
        }
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { data, error, isConnected, sendMessage };
}
