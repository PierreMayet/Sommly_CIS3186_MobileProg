# Sommly_CIS3186_MobileProg
Project CIS3186 Mobile Device Programming

## Project Structure

```
SommlyApp/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navigation des onglets principaux
│   │   ├── index.tsx           # Home page
│   │   ├── two.tsx             # Shop page
│   │   ├── recommendation.tsx  # Sommelier page
│   │   ├── cart.tsx            # Cart page
│   ├── +html.tsx
│   ├── +not-found.tsx
│   ├── modal.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   └── Themed.tsx
├── constants/
│   └── Colors.ts
├── app.json
├── package.json
├── tsconfig.json
└── ...
```

**Main folders/files :**
- `app/(tabs)/` : Main application pages (tabs)
- `components/` : Reusable UI components
- `assets/` : Images and fonts
- `constants/` : Colors and other constants

---

## Firebase Usage Examples

### Authentification (login, register, logout)

```typescript
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebaseConfig'; // adapte le chemin si besoin

const auth = getAuth(app);

// Login
async function handleLogin(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Utilisateur connecté !
  } catch (error: any) {
    alert(error.message);
  }
}

// Register
async function handleRegister(email: string, password: string) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // Utilisateur inscrit et connecté !
  } catch (error: any) {
    alert(error.message);
  }
}

// Logout
async function handleLogout() {
  try {
    await signOut(auth);
    // Utilisateur déconnecté !
  } catch (error: any) {
    alert(error.message);
  }
}
```

### Firestore usage (save user data)

```typescript
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'; // adapte le chemin

const db = getFirestore(app);

// Save user data
async function saveUserData(userId: string, data: any) {
  try {
    await setDoc(doc(db, 'users', userId), data);
    // Les infos utilisateur sont enregistrées.
  } catch (error: any) {
    alert(error.message);
  }
}
```

---