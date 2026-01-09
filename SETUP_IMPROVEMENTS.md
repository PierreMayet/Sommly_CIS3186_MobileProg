# Payment System Improvements - Setup Guide

## What Was Improved

The payment system has been enhanced to work reliably across different laptops and network configurations. Here's what changed:

### ✅ Key Improvements

1. **Multiple URL Detection Strategies**
   - Tries multiple methods to find the backend server
   - Works with Expo Go, iOS Simulator, Android Emulator, and physical devices
   - Handles different network configurations automatically

2. **Automatic URL Caching**
   - Remembers the working URL using AsyncStorage
   - Faster subsequent connections
   - Automatically finds new URL if network changes

3. **Retry Logic with Fallbacks**
   - If one URL fails, automatically tries alternatives
   - Tests each URL before using it
   - Provides better error messages

4. **Better Error Handling**
   - More descriptive error messages
   - Automatic retry with alternative URLs
   - Clear instructions when connection fails

## Installation Steps

### 1. Install New Dependencies

```bash
cd SommlyApp
npm install
```

This will install `@react-native-async-storage/async-storage` which is needed for URL caching.

### 2. Start Backend Server

In one terminal:
```bash
cd SommlyApp/backend
npm install  # First time only
npm start
```

You should see: `Backend running on http://localhost:4242`

### 3. Start Expo App

In another terminal:
```bash
cd SommlyApp
npm start
```

### 4. Test Payment

1. Add items to cart
2. Go to cart screen
3. Click "Validate Order"
4. The app will automatically find and connect to the backend

## How It Works

### URL Detection Priority

The app tries URLs in this order:

1. **Cached URL** (if previously successful)
2. **Android Emulator**: `http://10.0.2.2:4242` (for Android emulator only)
3. **Expo hostUri**: From `Constants.expoConfig.hostUri`
4. **Expo debuggerHost**: Alternative Expo detection method
5. **Manifest debuggerHost**: For newer Expo versions
6. **iOS Simulator**: `http://localhost:4242`
7. **Fallback**: `http://localhost:4242`

### Automatic Testing

- Each URL is tested before use
- If a URL fails, the next one is tried automatically
- Working URLs are cached for faster future connections

### Network Changes

- If you change networks, the app will automatically detect and use the new URL
- Cached URLs are re-tested on each connection attempt
- If cached URL fails, it tries all alternatives again

## Troubleshooting

### Still Not Working?

1. **Check Backend is Running**
   ```bash
   curl http://localhost:4242/create-payment-intent
   ```
   Should return an error (method not allowed), but confirms server is running

2. **Check Console Logs**
   - Look for "🔍 Trying URLs:" message
   - See which URLs are being tested
   - Check which URL succeeded: "✅ Found working URL:"

3. **Clear Cached URL** (if needed)
   - The app will automatically find a new URL if cached one fails
   - Or reinstall the app to clear cache

4. **Verify Network**
   - Make sure device and computer are on same WiFi
   - Check firewall isn't blocking port 4242
   - Try restarting both servers

## Benefits

✅ **Works on any laptop** - Automatically adapts to different network configurations  
✅ **Faster connections** - Caches working URLs  
✅ **Better reliability** - Tries multiple URLs automatically  
✅ **Clearer errors** - Better error messages with troubleshooting tips  
✅ **Network resilient** - Handles network changes automatically  

## Technical Details

- Uses `@react-native-async-storage/async-storage` for URL caching
- Tests URLs with a 2-second timeout
- Retries with alternative URLs on failure
- Logs all URL attempts for debugging

