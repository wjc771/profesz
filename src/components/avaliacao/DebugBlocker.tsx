
import { useEffect } from 'react';

export function DebugBlocker() {
  useEffect(() => {
    // Bloquear todas as tentativas de requisições problemáticas
    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    
    // Interceptar fetch
    window.fetch = function(...args) {
      const [url] = args;
      
      if (typeof url === 'string') {
        // Bloquear requisições problemáticas
        if (url.includes('/_sandbox/dev-server') || 
            url.includes('lovableproject.com/_sandbox') ||
            url.includes('lovable.dev/_sandbox')) {
          console.warn('Blocked problematic request:', url);
          return Promise.reject(new Error('Request blocked to prevent CORS loop'));
        }
      }
      
      return originalFetch.apply(this, args);
    };
    
    // Interceptar XMLHttpRequest
    const originalOpen = originalXHR.prototype.open;
    originalXHR.prototype.open = function(method, url, ...args) {
      if (typeof url === 'string' && 
          (url.includes('/_sandbox/dev-server') || 
           url.includes('lovableproject.com/_sandbox') ||
           url.includes('lovable.dev/_sandbox'))) {
        console.warn('Blocked XHR request:', url);
        throw new Error('XHR request blocked to prevent CORS loop');
      }
      
      return originalOpen.call(this, method, url, ...args);
    };
    
    // Cleanup
    return () => {
      window.fetch = originalFetch;
      originalXHR.prototype.open = originalOpen;
    };
  }, []);

  return null;
}
