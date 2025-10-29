'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface WebSocketContextType {
    socket: WebSocket | null;
    isConnected: boolean;
    sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    isConnected: false,
    sendMessage: () => {},
});

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

// Custom event names
export const WS_EVENTS = {
    RPS_START_BET: 'RPS_StartBet',
    RPS_END_BET: 'RPS_EndBet',
    RPS_GAME_RESULT: 'RPS_GameResult',
    TX_START_BET: 'TX_StartBet',
    TX_END_BET: 'TX_EndBet',
    TX_GAME_RESULT: 'TX_GameResult'
} as const;

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000; // 3 seconds

    const connectWebSocket = () => {
        try {
            const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || '';
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                setIsConnected(true);
                reconnectAttemptsRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    // Emit custom events based on message type
                    switch (message.type) {
                        case 'RPS_StartBet':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.RPS_START_BET, {
                                detail: {
                                    draw_no: message.draw_no,
                                    end_time: message.end_time,
                                    status: message.status
                                }
                            }));
                            break;

                        case 'RPS_EndBet':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.RPS_END_BET, {
                                detail: {
                                    draw_no: message.draw_no,
                                    end_time: message.end_time,
                                    dealer: message.dealer,
                                    player: message.player,
                                    winner: message.winner
                                }
                            }));
                            break;

                        case 'RPS_GameResult':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.RPS_GAME_RESULT, {
                                detail: message.data
                            }));
                            break;

                        case 'TX_StartBet':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.TX_START_BET, {
                                detail: {
                                    draw_no: message.draw_no,
                                    end_time: message.end_time,
                                    status: message.status
                                }
                            }));
                            break;

                        case 'TX_EndBet':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.TX_END_BET, {
                                detail: {
                                    draw_no: message.draw_no,
                                    end_time: message.end_time,
                                    result: message.result
                                }
                            }));
                            break;

                        case 'TX_GameResult':
                            window.dispatchEvent(new CustomEvent(WS_EVENTS.TX_GAME_RESULT, {
                                detail: message.data
                            }));
                            break;
                        default:
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            ws.onerror = (error) => {
                console.error(error);
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                setSocket(null);

                if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket();
                    }, reconnectDelay);
                } 
            };

            setSocket(ws);
        } catch (error) {
            console.error('❌ Failed to create WebSocket connection:', error);
        }
    };

    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.warn('⚠️ WebSocket is not connected. Cannot send message:', message);
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                socket.close(1000, 'Component unmounting');
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
} 