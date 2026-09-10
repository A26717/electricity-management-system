import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const SOCKET_URL = 'http://localhost:8000';
    console.log('🔌 Initializing Socket.io connection to:', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
      autoConnect: true,
      withCredentials: false,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.log('⚠️ Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
    });

    // Server status
    newSocket.on('server-status', (data) => {
      console.log('📊 Server status:', data);
    });

    // Notifications
    newSocket.on('notification', (data) => {
      console.log('📢 New notification received:', data);

      const notification = {
        id: data.id || Date.now(),
        type: data.type || 'info',
        title: data.title || 'New Notification',
        message: data.message || '',
        timestamp: data.timestamp || new Date().toISOString(),
        read: false,
        data: data.data || {},
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/vite.svg',
          });
        } catch (e) {
          console.log('Browser notification failed:', e);
        }
      }
    });

    newSocket.on('joined-room', (data) => {
      console.log('👥 Joined room:', data.room);
    });

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up socket connection');
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.close();
      }
    };
  }, []);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // Clear all
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Add local notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message || '',
      timestamp: new Date().toISOString(),
      read: false,
      data: notification.data || {},
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  // Send notification via socket
  const sendNotification = useCallback((data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_notification', data);
      console.log('📤 Notification sent:', data);
    }
  }, [isConnected]);

  // Join room
  const joinRoom = useCallback((room) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_room', room);
    }
  }, [isConnected]);

  // Leave room
  const leaveRoom = useCallback((room) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_room', room);
    }
  }, [isConnected]);

  const value = {
    socket,
    isConnected,
    connectionError,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification,
    sendNotification,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;