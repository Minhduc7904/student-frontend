import { io } from 'socket.io-client';

export class SocketService {
    constructor(socketFactory = io) {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.authFailed = false;
        this.socketFactory = socketFactory;
    }

    connect(token) {
        if (this.socket) return;

        this.authFailed = false;
        const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
        const serverUrl = apiBaseUrl.replace('/api', '');

        this.socket = this.socketFactory(serverUrl, {
            auth: { token },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        this.setupDefaultHandlers();
        this.attachRegisteredListeners();
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

    attachRegisteredListeners() {
        if (!this.socket) return;

        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach((callback) => {
                this.socket.on(event, callback);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.listeners.forEach((callbacks, event) => {
                callbacks.forEach((callback) => {
                    this.socket.off(event, callback);
                });
            });
            this.socket.disconnect();
            this.socket = null;
        }

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
        if (!event || typeof callback !== 'function') return () => {};

        let callbacks = this.listeners.get(event);
        if (!callbacks) {
            callbacks = new Set();
            this.listeners.set(event, callbacks);
        }

        if (!callbacks.has(callback)) {
            callbacks.add(callback);
            this.socket?.on(event, callback);
        }

        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!event || typeof callback !== 'function') return;

        const callbacks = this.listeners.get(event);
        if (!callbacks?.has(callback)) return;

        this.socket?.off(event, callback);
        callbacks.delete(callback);
        if (callbacks.size === 0) this.listeners.delete(event);
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
