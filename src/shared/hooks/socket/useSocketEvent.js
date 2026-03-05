// src/hooks/socket/useSocketEvent.js
import { useEffect } from 'react'
import { socketService } from '@/core/services'

/**
 * useSocketEvent Hook
 * 
 * React hook for listening to Socket.IO events.
 * Automatically cleans up listeners on unmount.
 * 
 * @param {string} event - Event name to listen to
 * @param {Function} callback - Event handler function
 * @param {Array} dependencies - Dependencies array for useEffect
 * 
 * @example
 * useSocketEvent('new-notification', (data) => {
 *   console.log('New notification:', data)
 *   showNotification(data)
 * }, [])
 */
export const useSocketEvent = (event, callback, dependencies = []) => {
    useEffect(() => {
        if (!event || !callback) return

        // Add event listener
        socketService.on(event, callback)

        // Cleanup: remove listener on unmount or dependency change
        return () => {
            socketService.off(event)
        }
    }, [event, ...dependencies])
}
