import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.authFailed = false;
    }

    connect(token) {
        if (this.socket?.connected) return;

        this.authFailed = false;
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        const serverUrl = apiBaseUrl.replace('/api', '');

        this.socket = io(serverUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        this.setupDefaultHandlers();
    }

    setupDefaultHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
        });

        this.socket.on('connect_error', (error) => {
            this.isConnected = false;
            const message = (error.message || '').toLowerCase();
            const isAuthError = message.includes('jwt') ||
                message.includes('expired') ||
                message.includes('unauthorized') ||
                message.includes('authentication') ||
                message.includes('unauthenticated') ||
                message.includes('invalid') ||
                error.type === 'UnauthorizedException';

            if (isAuthError) this.authFailed = true;
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;
            if (reason === 'io server disconnect' && !this.authFailed) this.socket.connect();
        });

        this.socket.on('reconnect', () => {
            this.isConnected = true;
        });
    }

    disconnect() {
        if (!this.socket) return;

        this.listeners.forEach((_, event) => {
            this.socket.off(event);
        });
        this.listeners.clear();
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
    }

    joinRoom(roomId) {
        if (!this.socket) return;
        this.socket.emit('join-room', { roomId });
    }

    leaveRoom(roomId) {
        if (!this.socket) return;
        this.socket.emit('leave-room', { roomId });
    }

    emit(event, data = {}) {
        if (!this.socket) return;
        this.socket.emit(event, data);
    }

    on(event, callback) {
        if (!this.socket) return;

        if (this.listeners.has(event)) this.socket.off(event, this.listeners.get(event));
        this.socket.on(event, callback);
        this.listeners.set(event, callback);
    }

    off(event) {
        if (!this.socket) return;

        const callback = this.listeners.get(event);
        if (!callback) return;
        this.socket.off(event, callback);
        this.listeners.delete(event);
    }

    getConnectionStatus() {
        return this.isConnected && this.socket?.connected;
    }

    getAuthFailed() {
        return this.authFailed;
    }

    getSocketId() {
        return this.socket?.id || null;
    }

    reconnectWithToken(newToken) {
        if (this.socket) {
            this.socket.io.reconnection(false);
            this.socket.disconnect();
            this.socket = null;
        }
        this.authFailed = false;
        this.isConnected = false;
        this.connect(newToken);
    }
}

export const socketService = new SocketService();
