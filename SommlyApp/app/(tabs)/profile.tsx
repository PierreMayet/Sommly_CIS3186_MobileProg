import React, { useState } from 'react';
import { StyleSheet, TextInput, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '../../firebaseConfig';

const auth = getAuth(app);

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User|null>(null);
  
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
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
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <View style={{alignItems: 'center'}}>
          <Text>Logged in as:</Text>
          <Text style={{fontWeight: 'bold'}}>{user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View style={{width: '80%'}}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            secureTextEntry
            autoCapitalize="none"
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={handleLogin} />
          <View style={{height: 8}} />
          <Button title="Register" onPress={handleRegister} />
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
});
