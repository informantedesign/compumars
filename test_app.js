const http = require('http');

const urls = ['/', '/dashboard', '/finance', '/fleet'];

console.log('Testing URLs...');

urls.forEach(path => {
    http.get('http://localhost:3000' + path, (res) => {
        console.log(`${path}: ${res.statusCode}`);
        res.resume(); // Consume response to free up socket
    }).on('error', (e) => {
        console.error(`${path}: ERROR ${e.message}`);
    });
});
