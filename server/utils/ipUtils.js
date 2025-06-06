/**
 * Utility functions for IP address extraction
 * These functions aggressively attempt to capture the real client IP address
 * even when behind proxies, load balancers, or in various hosting environments
 */

/**
 * Extracts the real IP address from the request object
 * Checks multiple headers and sources in order of reliability
 * @param {Object} req - Express request object
 * @returns {String} - The extracted IP address
 */
const getRealIpAddress = (req) => {
    // Array of headers to check in order of preference
    const ipHeaders = [
        'cf-connecting-ip',        // Cloudflare
        'true-client-ip',         // Akamai, Cloudflare Enterprise
        'x-forwarded-for',         // Most common proxy header
        'x-real-ip',              // Nginx proxy
        'x-client-ip',            // Apache proxy
        'x-cluster-client-ip',    // Cluster
        'x-forwarded',            // Variant
        'forwarded-for',          // Variant
        'forwarded',              // RFC 7239
        'fastly-client-ip',       // Fastly CDN
        'x-azure-clientip',       // Azure
        'x-azure-socketip',       // Azure
        'x-vercel-forwarded-for', // Vercel
        'x-forwarded-proto',      // Sometimes contains IP
        'x-original-forwarded-for', // Original forwarded
        'client-ip',              // Generic client IP
        'remote-addr'             // Remote address header
    ];

    // First, try to get IP from headers
    for (const header of ipHeaders) {
        const headerValue = req.headers[header];
        if (headerValue) {
            // Handle comma-separated list (x-forwarded-for can contain multiple IPs)
            const ips = headerValue.split(',').map(ip => ip.trim());

            // First try to find a valid public IP
            for (const ip of ips) {
                if (isValidPublicIp(ip)) {
                    console.log(`Found public IP in ${header}: ${ip}`);
                    return ip;
                }
            }

            // If no public IP found, try to find any valid IP format
            for (const ip of ips) {
                if (isValidIpFormat(ip) && !isLoopback(ip)) {
                    console.log(`Found non-loopback IP in ${header}: ${ip}`);
                    return ip;
                }
            }

            // If still nothing, return the first non-empty IP from the list
            if (ips.length > 0 && ips[0] !== '') {
                console.log(`Using first IP from ${header}: ${ips[0]}`);
                return ips[0];
            }
        }
    }

    // Fallback to Express's req.ip (works with trust proxy)
    if (req.ip && !isLoopback(req.ip)) {
        console.log(`Using Express req.ip: ${req.ip}`);
        return req.ip;
    }

    // Try req.ips array (when trust proxy is set)
    if (req.ips && req.ips.length > 0) {
        for (const ip of req.ips) {
            if (!isLoopback(ip)) {
                console.log(`Using Express req.ips: ${ip}`);
                return ip;
            }
        }
    }

    // Fallback to connection remote address
    if (req.connection && req.connection.remoteAddress) {
        const ip = req.connection.remoteAddress;
        if (!isLoopback(ip)) {
            console.log(`Using connection.remoteAddress: ${ip}`);
            return ip;
        }
    }

    // Fallback to socket remote address
    if (req.socket && req.socket.remoteAddress) {
        const ip = req.socket.remoteAddress;
        if (!isLoopback(ip)) {
            console.log(`Using socket.remoteAddress: ${ip}`);
            return ip;
        }
    }

    // Final fallback to connection info
    if (req.info && req.info.remoteAddress) {
        const ip = req.info.remoteAddress;
        if (!isLoopback(ip)) {
            console.log(`Using info.remoteAddress: ${ip}`);
            return ip;
        }
    }

    // If all else fails, try to get any available IP
    const anyIp = req.ip ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.info?.remoteAddress ||
        '127.0.0.1'; // Default fallback

    console.log(`Final fallback IP: ${anyIp}`);
    return anyIp;
};

/**
 * Checks if an IP is loopback/localhost
 * @param {String} ip - IP address to check
 * @returns {Boolean} - True if loopback
 */
const isLoopback = (ip) => {
    if (!ip) return true;

    const cleanIp = ip.replace(/^::ffff:/, '');
    return cleanIp === '127.0.0.1' ||
        cleanIp === '::1' ||
        cleanIp === 'localhost' ||
        cleanIp.startsWith('127.');
};

/**
 * Checks if a string has a valid IP format
 * @param {String} ip - IP address to validate
 * @returns {Boolean} - True if valid format
 */
const isValidIpFormat = (ip) => {
    if (!ip || ip === '') return false;

    // Remove IPv6 prefix if present
    const cleanIp = ip.replace(/^::ffff:/, '');

    // Basic IP format validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    return ipv4Regex.test(cleanIp) || ipv6Regex.test(cleanIp);
};

/**
 * Checks if an IP address is valid and public (not localhost or private network)
 * @param {String} ip - IP address to validate
 * @returns {Boolean} - True if valid public IP
 */
const isValidPublicIp = (ip) => {
    if (!isValidIpFormat(ip)) return false;
    if (isLoopback(ip)) return false;

    // Remove IPv6 prefix if present
    const cleanIp = ip.replace(/^::ffff:/, '');

    // Check for private IPv4 ranges
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(cleanIp)) {
        const parts = cleanIp.split('.').map(Number);

        // 10.0.0.0/8
        if (parts[0] === 10) return false;

        // 172.16.0.0/12
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;

        // 192.168.0.0/16
        if (parts[0] === 192 && parts[1] === 168) return false;

        // 169.254.0.0/16 (link-local)
        if (parts[0] === 169 && parts[1] === 254) return false;

        // Check for invalid ranges
        if (parts[0] === 0 || parts[0] >= 224) return false;
    }

    return true;
};

/**
 * Gets the IP address and additional metadata
 * @param {Object} req - Express request object
 * @returns {Object} - Object containing IP and metadata
 */
const getIpInfo = (req) => {
    const ip = getRealIpAddress(req);

    return {
        ip,
        userAgent: req.headers['user-agent'] || 'unknown',
        timestamp: new Date().toISOString(),
        headers: {
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-real-ip': req.headers['x-real-ip'],
            'cf-connecting-ip': req.headers['cf-connecting-ip'],
            'true-client-ip': req.headers['true-client-ip'],
            'x-client-ip': req.headers['x-client-ip'],
            'x-vercel-forwarded-for': req.headers['x-vercel-forwarded-for']
        },
        expressData: {
            ip: req.ip,
            ips: req.ips
        },
        connectionData: {
            remoteAddress: req.connection?.remoteAddress,
            socketRemoteAddress: req.socket?.remoteAddress
        }
    };
};

/**
 * Force real IP extraction - tries even harder to get non-localhost IP
 * @param {Object} req - Express request object
 * @returns {String} - The extracted IP address
 */
const forceRealIp = (req) => {
    // Get standard IP
    let ip = getRealIpAddress(req);

    // If we still have localhost, try some more aggressive methods
    if (isLoopback(ip)) {
        // Check all headers for any IP-looking strings
        const allHeaders = req.headers;
        for (const [key, value] of Object.entries(allHeaders)) {
            if (typeof value === 'string' && value.includes('.')) {
                const possibleIps = value.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g);
                if (possibleIps) {
                    for (const possibleIp of possibleIps) {
                        if (!isLoopback(possibleIp)) {
                            console.log(`Found IP in header ${key}: ${possibleIp}`);
                            return possibleIp;
                        }
                    }
                }
            }
        }

        // For development, we might want to simulate a real IP
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Using simulated IP');
            return '203.0.113.1'; // Test IP from RFC 5737
        }
    }

    return ip;
};

module.exports = {
    getRealIpAddress,
    isValidPublicIp,
    isValidIpFormat,
    isLoopback,
    getIpInfo,
    forceRealIp
}; 