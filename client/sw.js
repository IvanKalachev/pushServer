// Service Worker


// Listen for Notifications
self.addEventListener('push', (e) => {
    self.registration.showNotification(e.stopImmediatePropagation.text())
});