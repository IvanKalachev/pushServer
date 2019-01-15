// Service Worker Registration
let swReg;

// Push Server URL
const serverUrl = 'http://localhost:3333';

// Update UI for subscribed status
const setSubscribedStatus = (state) => {
    if (state) {
        document.getElementById('subscribe').className = 'hidden';
        document.getElementById('unsubscribe').className = '';
    } else {
        document.getElementById('subscribe').className = '';
        document.getElementById('unsubscribe').className = 'hidden';
    }
}

// Register Service Worker
navigator.serviceWorker.register('sw.js').then(registration => {

    // Reference registration globally
    swReg = registration

    // Check if a subscription exists, and if so, update UI
    swReg.pushManager.getSubscription().then(setSubscribedStatus)
}).catch(console.log)

// Get public key from server
const getApplicationServerKey = () => {
    return fetch(`${serverUrl}/key`)
        // Parse response body as arrayBuffer
        .then(res => res.arrayBuffer())
        // Return araayBuffer as new Uint8Array
        .then(key => new Uint8Array(key))
}

// Unsubscribe from push service
const unsubscribe = () => {
    // Unsubscribe and update UI
    swReg.pushManager.getSubscription().then(subscription => {
        subscription.unsubscribe().then(() => {
            setSubscribedStatus(false);
        });
    });
}

// Subscribe for push notifications
const subscribe = () => {

    // Check registration is available
    if (!swReg) {
        return console.error('ServiceWorker Registration Not Found');
    }

    // Get applicationServerKey from push server
    getApplicationServerKey().then(key => {
        // Subscribe
        swReg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key })
            .then(res => res.toJSON())
            .then(subscription => {

                // Pass subscription to server
                fetch(`${serverUrl}/subscribe`, { method: 'POST', body: JSON.stringify(subscription) })
                    .then(setSubscribedStatus)
                    .catch(unsubscribe)

            }).catch(console.error)
    });
}