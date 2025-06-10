
import { useEffect } from 'react';

export function DebugBlocker() {
  useEffect(() => {
    // Bloquear tentativas infinitas de reconnect do dev server
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
      const [url] = args;
      
      // Bloquear requests para dev-server que podem causar loop
      if (typeof url === 'string' && url.includes('/_sandbox/dev-server')) {
        console.warn('Blocked dev-server request to prevent CORS loop');
        return Promise.reject(new Error('Blocked dev-server request'));
      }
      
      return originalFetch.apply(this, args);
    };
    
    // Cleanup
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
