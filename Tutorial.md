# Getting Started with Sommly on Expo Go

This guide will walk you through launching the Sommly application on Expo Go from start to finish, after downloading the project files.

## Step-by-Step Setup

### 1. Extract the Project Files

- Download the ZIP file and extract it to your desired location
- Navigate to the extracted folder in your terminal:
  ```bash
  cd path/to/Sommly_CIS3186_MobileProg
  ```

### 2. Navigate to the App Directory

```bash
cd SommlyApp
```

### 3. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will download and install all dependencies listed in `package.json`, including Expo, React Native, Stripe integration, and Firebase packages.


### 4. Install Backend Dependencies

```bash
cd SommlyApp/backend
npm install
cd ..
```

### 5. Start the Expo Development Server

Launch the Expo development server:

```bash
npm start
```

### 6. Open on Your Mobile Device

- A QR code will appear in your terminal
- Open the **Expo Go** app on your mobile device
- Tap the "Scan QR Code" button (or camera icon)
- Scan the QR code from your terminal
- The app will load on your device