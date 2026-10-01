// src/hooks/socket/useSocketEvent.js
import { useEffect, useRef } from 'react'
import { socketService } from '@/core/services'

/**
 * useSocketEvent Hook
 * 
 * React hook for listening to Socket.IO events.
 * Automatically cleans up listeners on unmount.
 * 
 * @param {string} event - Event name to listen to
 * @param {Function} callback - Event handler function
 *
 * @example
 * useSocketEvent('new-notification', (data) => {
 *   console.log('New notification:', data)
 *   showNotification(data)
 * })
 */
export const useSocketEvent = (event, callback) => {
    const callbackRef = useRef(callback)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    useEffect(() => {
        if (!event) return

        const handler = (...args) => callbackRef.current?.(...args)
        const unsubscribe = socketService.on(event, handler)

        return unsubscribe
    }, [event])
}
