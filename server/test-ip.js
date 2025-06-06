/**
 * IP Detection Test Script
 * Run this to test if IP detection is working correctly
 */

const express = require('express');
const { captureIpMiddleware, debugIpMiddleware } = require('./middleware/ipCapture');

const app = express();

// Configure trust proxy
app.set('trust proxy', true);

// Use our IP capture middleware
app.use(captureIpMiddleware);
app.use(debugIpMiddleware);

// Test endpoint
app.get('/test', (req, res) => {
    res.json({
        message: 'IP Detection Test',
        detectedIp: req.realIp,
        expressIp: req.ip,
        expressIps: req.ips,
        headers: {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-real-ip': req.headers['x-real-ip'],
            'cf-connecting-ip': req.headers['cf-connecting-ip']
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`IP Test server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/test`);
    console.log('\nTo test with headers, use curl:');
    console.log(`curl -H "X-Forwarded-For: 203.0.113.1" http://localhost:${PORT}/test`);
    console.log(`curl -H "X-Real-IP: 198.51.100.1" http://localhost:${PORT}/test`);
    console.log(`curl -H "CF-Connecting-IP: 192.0.2.1" http://localhost:${PORT}/test`);
}); 