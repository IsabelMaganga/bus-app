# Troubleshooting Guide - Loading Issue

## Problem
The "Confirm Selection" button keeps loading and doesn't navigate to the next page.

## Possible Causes & Solutions

### 1. API Connection Issue
**Most likely cause**: The app can't connect to your Laravel backend.

**Check this first**:
1. Make sure your Laravel server is running:
   ```bash
   cd api
   php artisan serve --host=0.0.0.0 --port=8000
   ```

2. Find your computer's IP address:
   - **Windows**: Run `ipconfig` in Command Prompt
   - **Mac/Linux**: Run `ifconfig` in Terminal
   - Look for your local IP (usually starts with 192.168.x.x or 10.0.x.x)

3. Update the API config file:
   - Open `app/config/api.js`
   - Replace `localhost` with your actual IP address
   - Example: `BASE_URL: 'http://192.168.1.105:8000'`

### 2. Check Console Logs
1. Open your React Native development tools
2. Look at the console logs when you click "Confirm Selection"
3. You should see logs like:
   - "Starting booking process..."
   - "Token retrieved: Yes/No"
   - "API URL: http://..."
   - "Response status: 200/404/500"

### 3. Common Error Messages

**"Network request failed"**
- Your Laravel server isn't running
- Wrong IP address in API config
- Firewall blocking the connection

**"401 Unauthorized"**
- User not logged in
- Token expired or invalid

**"404 Not Found"**
- API endpoint doesn't exist
- Wrong API URL

**"500 Internal Server Error"**
- Laravel backend error
- Check Laravel logs in `api/storage/logs/laravel.log`

### 4. Quick Test
To test if the API is working:

1. Open your browser
2. Go to `http://YOUR_IP:8000/api/bookings` (replace YOUR_IP with your actual IP)
3. You should see a JSON response (even if it's an error, it means the server is reachable)

### 5. Alternative: Use Localhost
If you're testing on the same device as the server:
1. Update `app/config/api.js` to use:
   ```javascript
   BASE_URL: 'http://localhost:8000'
   ```

### 6. Check Laravel Backend
Make sure your Laravel backend has:
1. The bookings route defined in `api/routes/api.php`
2. The BookingController exists
3. Database migrations are run:
   ```bash
   cd api
   php artisan migrate
   ```

## Debugging Steps
1. **Check server status**: Is Laravel running?
2. **Check IP address**: Is the API config using the correct IP?
3. **Check console logs**: What errors are showing?
4. **Test API directly**: Can you access the API in a browser?
5. **Check Laravel logs**: Any backend errors?

## Still Having Issues?
If the problem persists:
1. Share the console logs from your React Native app
2. Share any error messages from Laravel logs
3. Confirm your Laravel server is running and accessible 