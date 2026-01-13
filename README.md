# Sommly_CIS3186_MobileProg
Project CIS3186 Mobile Device Programming

## Project Structure

```
SommlyApp/
├── app/
│   ├── _layout.tsx             # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navigation des onglets principaux
│   │   ├── index.tsx           # Home page
│   │   ├── two.tsx             # Shop page
│   │   ├── recommendation.tsx  # Sommelier page
│   │   ├── cart.tsx            # Cart page
│   │   └── profile.tsx         # Profile/Authentication page
│   ├── +html.tsx
│   ├── +not-found.tsx
│   └── modal.tsx
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       └── splash-icon.png
├── components/
│   ├── __tests__/
│   │   └── StyledText-test.js
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   ├── Themed.tsx
│   ├── useClientOnlyValue.ts
│   ├── useClientOnlyValue.web.ts
│   ├── useColorScheme.ts
│   └── useColorScheme.web.ts
├── constants/
│   └── Colors.ts
├── context/
│   └── CartContext.tsx         # Cart state management
├── services/
│   ├── auth.ts                 # Firebase authentication service
│   ├── db.ts                   # Firestore database service
│   └── README.md
├── backend/
│   ├── functions/
│   │   ├── index.js
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── firebase.json
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── start-server.bat
│   └── start-server.sh
├── _vscode/
│   ├── extensions.json
│   └── settings.json
├── app.json
├── expo-env.d.ts
├── firebaseConfig.ts           # Firebase configuration
├── package.json
├── package-lock.json
└── tsconfig.json
```

**Main folders/files :**
- `app/(tabs)/` : Main application pages (tabs navigation)
- `components/` : Reusable UI components and hooks
- `assets/` : Images and fonts
- `constants/` : Colors and other constants
- `context/` : React Context providers (Cart state)
- `services/` : Firebase services (auth, database)
- `backend/` : Backend server and Firebase functions
- `firebaseConfig.ts` : Firebase initialization and configuration

---