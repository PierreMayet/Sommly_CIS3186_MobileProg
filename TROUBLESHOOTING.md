# Payment System Troubleshooting Guide

## Common Issues: Payment Works on Friend's Laptop but Not Yours

### 🔴 Issue 1: Backend Server Not Running

**Problem**: The payment system requires a backend server running on port 4242.

**Solution**:
1. Open a terminal in the `SommlyApp/backend` folder
2. Make sure dependencies are installed:
   ```bash
   cd backend
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   # OR
   node server.js
   ```
4. You should see: `Backend running on http://localhost:4242`

**Check**: Open `http://localhost:4242/create-payment-intent` in your browser (should return an error, but confirms server is running)

---

### 🔴 Issue 2: Network Configuration Problems

**Problem**: The app can't find the backend server due to incorrect URL detection.

**Symptoms**:
- "Network timeout" errors
- "Network error" alerts
- Payment button doesn't work

**Solution**:

#### For Physical Devices:
1. Find your computer's local IP address:
   - **Windows**: Open Command Prompt, type `ipconfig`, look for "IPv4 Address"
   - **Mac/Linux**: Open Terminal, type `ifconfig` or `ip addr`, look for your network interface IP
2. Make sure your phone and computer are on the **same WiFi network**
3. The app should automatically detect the IP, but if it doesn't, you may need to manually set it

#### For Emulators/Simulators:
- **Android Emulator**: Uses `10.0.2.2` (already configured)
- **iOS Simulator**: Uses `localhost` (should work automatically)
- **Expo Go**: Should auto-detect, but may need manual configuration

---

### 🔴 Issue 3: Missing Dependencies

**Problem**: Required packages aren't installed.

**Solution**:
1. In `SommlyApp` folder:
   ```bash
   npm install
   ```

2. In `SommlyApp/backend` folder:
   ```bash
   cd backend
   npm install
   ```

3. Verify these packages exist:
   - Frontend: `@stripe/stripe-react-native`, `firebase`
   - Backend: `stripe`, `express`, `cors`

---

### 🔴 Issue 4: Port 4242 Blocked by Firewall

**Problem**: Windows Firewall or antivirus blocking port 4242.

**Solution**:
1. **Windows**: 
   - Open Windows Defender Firewall
   - Allow Node.js through firewall
   - Or temporarily disable firewall to test

2. **Mac**: 
   - System Preferences → Security & Privacy → Firewall
   - Allow Node.js

---

### 🔴 Issue 5: Expo Dev Server Not Running

**Problem**: The frontend app can't connect because Expo isn't running.

**Solution**:
1. In `SommlyApp` folder:
   ```bash
   npm start
   # OR
   npx expo start
   ```

2. Make sure both servers are running:
   - ✅ Expo dev server (usually port 8081)
   - ✅ Backend server (port 4242)

---

### 🔴 Issue 6: Different Network Setup

**Problem**: Friend's laptop might be on a different network configuration.

**Check**:
1. Compare network settings:
   - Are you on the same WiFi?
   - Is friend using a VPN?
   - Different network adapters?

2. Check if friend has any special network configuration

---

### 🔴 Issue 7: Stripe Keys Configuration

**Problem**: Stripe keys might be different or invalid.

**Check**:
1. Verify Stripe keys in:
   - `SommlyApp/app/_layout.tsx` (publishable key)
   - `SommlyApp/backend/server.js` (secret key)

2. Make sure you're using **test keys** (start with `pk_test_` and `sk_test_`)

---

## Quick Diagnostic Steps

1. **Check Backend Server**:
   ```bash
   cd SommlyApp/backend
   node server.js
   ```
   Should see: "Backend running on http://localhost:4242"

2. **Test Backend Endpoint**:
   ```bash
   curl -X POST http://localhost:4242/create-payment-intent -H "Content-Type: application/json" -d "{\"amount\":1000}"
   ```
   Should return JSON with `clientSecret`

3. **Check Network Connection**:
   - Open browser: `http://localhost:4242/create-payment-intent`
   - Should get an error (method not allowed for GET), but confirms server is reachable

4. **Check Console Logs**:
   - In your app, check the console/terminal for errors
   - Look for "Network timeout" or "Network error" messages

---

## Step-by-Step Setup (Fresh Install)

1. **Install Frontend Dependencies**:
   ```bash
   cd SommlyApp
   npm install
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Start Backend Server** (in one terminal):
   ```bash
   cd SommlyApp/backend
   npm start
   ```

4. **Start Expo App** (in another terminal):
   ```bash
   cd SommlyApp
   npm start
   ```

5. **Test Payment**:
   - Add items to cart
   - Go to cart screen
   - Click "Validate Order"
   - Should open Stripe payment sheet

---

## Still Not Working?

1. Compare with friend's setup:
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Operating system differences
   - Network adapter settings

2. Check for error messages in:
   - Backend terminal
   - Expo terminal
   - App console (React Native Debugger)

3. Try manual IP configuration (see improved code below)

