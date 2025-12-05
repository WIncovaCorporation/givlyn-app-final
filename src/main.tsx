import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initSentry } from "./lib/sentry";

// Force unregister any old Service Workers to fix cache issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered:', registration.scope);
    }
  });
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log('Cache deleted:', cacheName);
      });
    });
  }
}

// Initialize Sentry error monitoring
initSentry();

createRoot(document.getElementById("root")!).render(<App />);
