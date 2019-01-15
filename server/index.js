// Modules
const http = require('http');
const push = require('./push');

// Create HTTP Server
http.createServer((request, response) => {

    //Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');

    // Get request vars
    const { url, method } = request;

    // Subscribe
    if (method === 'POST' && url.match(/^\/subscribe\/?/)) {
        // Get POST Body
        let body = []

        // Read body stream
        request.on('data', chunk => body.push(chunk)).on('end', () => {

            // Parse subscription body to object
            let subscription = JSON.parse(body.toString());

            // Store subscription for push notifications
            push.addSubscription(subscription);

            // Respond
            response.end('Subscribed')
        });

        // Public Key 
    } else if (url.match(/^\/key\/?/)) {

        // Get key from push module
        let key = push.getKey()

        // Respond with public key
        response.end(key);

        // Push notifications    
    } else if (method === 'POST' && /^\/push\/?/) {
        // Get POST Body
        let body = []

        // Read body stream
        request.on('data', chunk => body.push(chunk)).on('end', () => {

            // Send notification with POST body
            push.send(body.toString());

            response.end('Push Sent')
        });
        // Not Found
    } else {
        response.statusCode = 404;
        response.end('Error: Unknown request');
    }

    // Start the server    
}).listen(3333, () => { console.log('Server Running') });