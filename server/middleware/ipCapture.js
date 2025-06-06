/**
 * IP Capture Middleware
 * This middleware ensures that real IP addresses are captured and available
 * throughout the request lifecycle, even in complex hosting environments
 */

const { getRealIpAddress, getIpInfo, forceRealIp } = require('../utils/ipUtils');

/**
 * Middleware to capture and attach real IP address to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const captureIpMiddleware = (req, res, next) => {
    try {
        // Capture the real IP address using most aggressive method
        const realIp = forceRealIp(req);

        // Attach it to the request object for easy access
        req.realIp = realIp;

        // Capture full IP info for debugging
        req.ipInfo = getIpInfo(req);

        // Log IP capture (can be disabled in production)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`IP Captured: ${realIp} for ${req.method} ${req.path}`);
        }

        // Continue to next middleware
        next();
    } catch (error) {
        console.error('Error in IP capture middleware:', error);
        // Don't fail the request, just set unknown IP and continue
        req.realIp = 'unknown';
        req.ipInfo = { ip: 'unknown', error: error.message };
        next();
    }
};

/**
 * Enhanced IP logging middleware for debugging
 * Use this temporarily to debug IP issues
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const debugIpMiddleware = (req, res, next) => {
    console.log('\n=== ENHANCED IP DEBUG ===');
    console.log('Path:', req.path);
    console.log('Method:', req.method);
    console.log('Real IP:', req.realIp);
    console.log('Express req.ip:', req.ip);
    console.log('Express req.ips:', req.ips);

    // Log all relevant headers
    const relevantHeaders = [
        'x-forwarded-for',
        'x-real-ip',
        'x-client-ip',
        'cf-connecting-ip',
        'true-client-ip',
        'fastly-client-ip',
        'x-cluster-client-ip',
        'x-forwarded',
        'forwarded-for',
        'forwarded'
    ];

    console.log('Relevant Headers:');
    relevantHeaders.forEach(header => {
        if (req.headers[header]) {
            console.log(`  ${header}: ${req.headers[header]}`);
        }
    });

    console.log('Connection Info:');
    console.log('  remoteAddress:', req.connection?.remoteAddress);
    console.log('  socket.remoteAddress:', req.socket?.remoteAddress);

    console.log('Full IP Info:', req.ipInfo);
    console.log('========================\n');

    next();
};

module.exports = {
    captureIpMiddleware,
    debugIpMiddleware
}; 