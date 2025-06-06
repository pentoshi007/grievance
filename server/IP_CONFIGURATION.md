# IP Address Capture Configuration

This document explains the aggressive IP address capture implementation for the grievance system.

## Overview

The system now captures real IP addresses instead of localhost (`::1` or `127.0.0.1`) by implementing multiple layers of IP detection that work across different hosting environments, proxies, and load balancers.

## Implementation Details

### 1. Express Trust Proxy Configuration

```javascript
app.set("trust proxy", true);
```

This enables Express to correctly extract IP addresses from proxy headers.

### 2. Aggressive IP Detection Utility (`utils/ipUtils.js`)

The system checks multiple headers in order of priority:

- `cf-connecting-ip` (Cloudflare)
- `true-client-ip` (Akamai, Cloudflare Enterprise)
- `x-forwarded-for` (Most common proxy header)
- `x-real-ip` (Nginx proxy)
- `x-client-ip` (Apache proxy)
- `x-vercel-forwarded-for` (Vercel hosting)
- And many more...

### 3. IP Capture Middleware (`middleware/ipCapture.js`)

Automatically captures and attaches real IP to all requests as `req.realIp`.

### 4. Database Schema Update

The Grievance model now includes an `ipAddress` field that is required.

## Testing IP Detection

### Method 1: Use the Test Endpoint

```bash
curl http://localhost:5001/api/grievances/test-ip
```

### Method 2: Use the Test Script

```bash
cd server
node test-ip.js
```

Then test with:

```bash
curl -H "X-Forwarded-For: 203.0.113.1" http://localhost:3001/test
```

### Method 3: Test with Different Headers

```bash
# Test Cloudflare header
curl -H "CF-Connecting-IP: 192.0.2.1" http://localhost:5001/api/grievances/test-ip

# Test Nginx header
curl -H "X-Real-IP: 198.51.100.1" http://localhost:5001/api/grievances/test-ip

# Test standard proxy header
curl -H "X-Forwarded-For: 203.0.113.1" http://localhost:5001/api/grievances/test-ip
```

## Environment Variables

For production environments, you can set:

- `TRUSTED_PROXY_COUNT`: Number of trusted proxies (e.g., "1", "2")
- `NODE_ENV`: Set to "production" for production-specific behavior

## Production Deployment Considerations

### Vercel

Vercel automatically sets `x-vercel-forwarded-for` header. The system is configured to read this.

### Cloudflare

Cloudflare sets `cf-connecting-ip` which is the highest priority header.

### AWS Load Balancer

AWS ALB sets `x-forwarded-for` which is handled.

### Nginx Proxy

Nginx typically sets `x-real-ip` and `x-forwarded-for`.

## Debugging

The system includes extensive logging. Check console output for:

- "Found public IP in [header]: [ip]"
- "Using Express req.ip: [ip]"
- "Development mode: Using simulated IP"

## Fallback Behavior

If no real IP can be detected:

1. In development: Returns test IP `203.0.113.1`
2. In production: Returns localhost IP with warning

## Security Notes

- Private IP ranges (10.x.x.x, 192.168.x.x, 172.16-31.x.x) are filtered out
- Localhost addresses are avoided when possible
- All headers are validated for proper IP format

## Files Modified

1. `models/Grievance.js` - Added `ipAddress` field
2. `utils/ipUtils.js` - IP detection utilities
3. `middleware/ipCapture.js` - IP capture middleware
4. `models/controllers/grievanceController.js` - Updated to save IP
5. `routes/grievanceRoutes.js` - Added test endpoint
6. `server.js` - Configured Express proxy trust
7. `test-ip.js` - Test script

## Usage in Code

```javascript
// In any route handler
const userIp = req.realIp; // Captured by middleware
// OR
const userIp = forceRealIp(req); // Manual extraction
```
