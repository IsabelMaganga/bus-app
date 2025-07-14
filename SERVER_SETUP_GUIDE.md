# Server Setup Guide for Mobile Development

## 🚨 Important: Fix the "Check Your Internet Connection" Error

The error you're experiencing is because the app is trying to connect to `localhost:8000`, which doesn't work on mobile devices. Here's how to fix it:

## 🔧 Step 1: Find Your Computer's IP Address

### On Windows:
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. It will look like: `192.168.1.100` or `10.0.0.50`

### On Mac/Linux:
1. Open Terminal
2. Type: `ifconfig` (Mac/Linux) or `ip addr` (Linux)
3. Look for "inet" followed by your IP address

## 🔧 Step 2: Update the API Configuration

1. Open `app/config/api.js`
2. Replace the IP address with your actual IP:

```javascript
const API_CONFIG = {
  BASE_URL: 'http://YOUR_ACTUAL_IP:8000', // Replace with your IP
};
```

**Example:**
```javascript
const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:8000', // Your actual IP
};
```

## 🔧 Step 3: Ensure Your Laravel Server is Accessible

1. **Start your Laravel server:**
```bash
cd api
php artisan serve --host=0.0.0.0 --port=8000
```

2. **Test the connection:**
   - Open your browser on your computer
   - Go to: `http://YOUR_IP:8000/api/bookings`
   - You should see a JSON response (even if it's an error, it means the server is reachable)

## 🔧 Step 4: Check Firewall Settings

### Windows:
1. Open Windows Defender Firewall
2. Allow Laravel/PHP through the firewall
3. Or temporarily disable firewall for testing

### Mac:
1. System Preferences → Security & Privacy → Firewall
2. Allow incoming connections for your development tools

## 🔧 Step 5: Test the Connection

1. **On your mobile device:**
   - Make sure your phone is on the same WiFi network as your computer
   - Try accessing `http://YOUR_IP:8000` in your phone's browser
   - You should see the Laravel welcome page

2. **In your React Native app:**
   - The booking flow should now work without the "internet connection" error

## 🚨 Common Issues and Solutions

### Issue 1: "Network request failed"
**Solution:** Check that your IP address is correct and Laravel server is running

### Issue 2: "Connection refused"
**Solution:** Make sure you're using `--host=0.0.0.0` when starting Laravel server

### Issue 3: "Timeout"
**Solution:** Check firewall settings and ensure both devices are on same network

### Issue 4: "CORS error"
**Solution:** Update your Laravel CORS configuration in `config/cors.php`:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## 🔧 Alternative Solutions

### Option 1: Use ngrok (for testing)
1. Install ngrok: `npm install -g ngrok`
2. Start your Laravel server: `php artisan serve`
3. In another terminal: `ngrok http 8000`
4. Use the ngrok URL in your API config

### Option 2: Use Expo Development Build
1. Use Expo's development server which can handle localhost
2. Update your API config to use the Expo server URL

### Option 3: Deploy to a real server
1. Deploy your Laravel API to a hosting service
2. Update the API config with your domain

## 📱 Testing the Complete Flow

After fixing the server URL:

1. **Book a ticket** → Should work without connection errors
2. **Select seats** → Should create booking successfully
3. **Navigate to payment** → Should go to Mpamba/Airtel page based on selection
4. **Payment instructions** → Should show business code and instructions

## 🔍 Debugging Tips

1. **Check console logs** in your React Native app
2. **Use browser developer tools** to test API endpoints
3. **Check Laravel logs** in `storage/logs/laravel.log`
4. **Use Postman** to test API endpoints before using in app

## 🎯 Quick Fix Summary

1. Find your computer's IP address
2. Update `app/config/api.js` with your IP
3. Start Laravel with: `php artisan serve --host=0.0.0.0 --port=8000`
4. Test the connection
5. Your booking flow should now work!

The key issue was using `localhost` instead of your actual IP address. Mobile devices can't access `localhost` on your computer, so they need the actual network IP address. 