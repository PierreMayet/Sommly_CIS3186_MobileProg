import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // Infos profil
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        // 🔽 Récupération du profil Firestore
        const ref = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setAge(data.age || '');
          setCity(data.city || '');
          setAddress(data.address || '');
        }
      }
    });

    return unsubscribe;
  }, []);

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleRegister() {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 🔐 Création du document utilisateur Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        createdAt: new Date(),
      });
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function handleSaveProfile() {
    if (!user) return;

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          firstName,
          lastName,
          age,
          city,
          address,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true } // 👈 très important
      );

      alert('Profile saved successfully');
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Connected as</Text>
          <Text style={styles.email}>{user.email}</Text>

          <TextInput
            style={styles.input}
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor={Colors.palette.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor={Colors.palette.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
            placeholderTextColor={Colors.palette.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
            placeholderTextColor={Colors.palette.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={Colors.palette.textSecondary}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile}>
            <Text style={styles.primaryButtonText}>Save Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Text style={styles.secondaryButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
            placeholderTextColor={Colors.palette.textSecondary}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
            placeholderTextColor={Colors.palette.textSecondary}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleRegister}>
            <Text style={styles.secondaryButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    marginBottom: 4,
  },
  email: {
    fontFamily: Colors.typography.bodyBold,
    marginBottom: 16,
  },
  card: {
    width: '90%',
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: Colors.light.background,
    color: Colors.palette.textPrimary,
  },
  primaryButton: {
    backgroundColor: Colors.palette.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
  },
  secondaryButton: {
    backgroundColor: Colors.palette.secondary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
  },
});
