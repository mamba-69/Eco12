/**
 * SiteBridge Module - Lightweight communication between admin and client components
 * Optimized for performance with minimal overhead
 */

import { useEffect, useState, useCallback } from 'react';

// Custom event name
const SETTINGS_CHANGED = 'site-settings-changed';

/**
 * Broadcast settings changes efficiently
 */
export function broadcastSettingsChange(settings: any, source: string = 'unknown') {
  if (typeof window === 'undefined') return;
  
  // Create a simple event with minimal payload
  const event = new CustomEvent(SETTINGS_CHANGED, {
    detail: {
      settings,
      timestamp: Date.now(),
      source
    }
  });
  
  // Dispatch the event
  window.dispatchEvent(event);
}

/**
 * Performance-optimized hook to listen for settings changes
 */
export function useSettingsChangeListener(callback: (data: any) => void) {
  useEffect(() => {
    // Efficient event handler
    const handleSettingsChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };
    
    // Add event listener
    if (typeof window !== 'undefined') {
      window.addEventListener(SETTINGS_CHANGED, handleSettingsChange);
    }
    
    // Clean up
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(SETTINGS_CHANGED, handleSettingsChange);
      }
    };
  }, [callback]);
}

/**
 * Simple, efficient debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Force refresh a component
 * This is useful for components that don't naturally react to store updates
 */
export function useForceRefresh() {
  const [, setForceUpdate] = useState(0);
  
  const forceRefresh = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);
  
  return forceRefresh;
} 