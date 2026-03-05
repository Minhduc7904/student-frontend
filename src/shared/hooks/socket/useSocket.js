// src/hooks/socket/useSocket.js
import { useEffect, useState, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { socketService } from '@/core/services'
import {
    selectAccessToken,
    selectIsAuthenticated,
    setCredentials,
    clearAuth,
} from '@/features/auth/store/authSlice'
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from '@/core/constants'

/**
 * useSocket Hook
 * 
 * React hook for managing Socket.IO connection lifecycle.
 * Automatically connects when user is authenticated and disconnects on logout.
 * Uses single root namespace only.
 * 
 * @param {object} options - Configuration options
 * @param {boolean} options.autoConnect - Auto connect when authenticated (default: true)
 * @returns {object} Socket utilities
 */
export const useSocket = (options = {}) => {
    const {
        autoConnect = true,
    } = options

    const dispatch = useDispatch()
    const accessToken = useSelector(selectAccessToken)
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [isConnected, setIsConnected] = useState(false)
    const [socketId, setSocketId] = useState(null)
    const [authFailed, setAuthFailed] = useState(false)

    // Guard: prevent multiple simultaneous refresh calls
    const isRefreshing = useRef(false)

    // Connect to socket
    const connect = useCallback(() => {
        if (!accessToken) {
            console.warn('⚠️ Cannot connect: No access token')
            return
        }

        socketService.connect(accessToken)
        setIsConnected(socketService.getConnectionStatus())
        setSocketId(socketService.getSocketId())
        setAuthFailed(false)
    }, [accessToken])

    // Disconnect from socket
    const disconnect = useCallback(() => {
        socketService.disconnect()
        setIsConnected(false)
        setSocketId(null)
    }, [])

    // Join a room
    const joinRoom = useCallback((roomId) => {
        socketService.joinRoom(roomId)
    }, [])

    // Leave a room
    const leaveRoom = useCallback((roomId) => {
        socketService.leaveRoom(roomId)
    }, [])

    // Emit event
    const emit = useCallback((event, data) => {
        socketService.emit(event, data)
    }, [])

    // Listen to event
    const on = useCallback((event, callback) => {
        socketService.on(event, callback)
    }, [])

    // Remove event listener
    const off = useCallback((event) => {
        socketService.off(event)
    }, [])

    // Auto connect/disconnect based on authentication
    useEffect(() => {
        if (isAuthenticated && accessToken && autoConnect) {
            console.log('🔌 Auto-connecting socket (user authenticated)...')
            connect()

            // Setup connection status listeners
            socketService.on('connect', () => {
                setIsConnected(true)
                setSocketId(socketService.getSocketId())
                setAuthFailed(false)
            })

            socketService.on('disconnect', () => {
                setIsConnected(false)
                setSocketId(null)
            })

            socketService.on('connect_error', async () => {
                if (!socketService.getAuthFailed()) return
                if (isRefreshing.current) return
                isRefreshing.current = true

                console.warn('🔒 Socket auth failed — attempting token refresh...')

                try {
                    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
                    if (!storedRefreshToken) throw new Error('No refresh token')

                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: storedRefreshToken,
                    })

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
                        response.data?.data ?? response.data

                    // Persist tokens
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken)
                    if (newRefreshToken) {
                        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)
                    }

                    // Sync to Redux
                    dispatch(setCredentials({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken || storedRefreshToken,
                    }))

                    console.log('✅ Token refreshed — reconnecting socket...')

                    // Reconnect socket with fresh token
                    socketService.reconnectWithToken(newAccessToken)
                    setAuthFailed(false)
                } catch (err) {
                    console.error('❌ Token refresh failed — logging out:', err)
                    dispatch(clearAuth())
                    setAuthFailed(true)
                    setIsConnected(false)
                    setSocketId(null)
                    const base = import.meta.env.BASE_URL || '/'
                    window.location.href = base.replace(/\/$/, '') + ROUTES.LOGIN
                } finally {
                    isRefreshing.current = false
                }
            })
        }

        // Cleanup: disconnect when user logs out or component unmounts
        return () => {
            if (!isAuthenticated || !accessToken) {
                console.log('🔌 Auto-disconnecting socket (user logged out)...')
                disconnect()
            }
        }
    }, [isAuthenticated, accessToken, autoConnect])

    return {
        isConnected,
        socketId,
        authFailed,
        connect,
        disconnect,
        joinRoom,
        leaveRoom,
        emit,
        on,
        off,
    }
}
