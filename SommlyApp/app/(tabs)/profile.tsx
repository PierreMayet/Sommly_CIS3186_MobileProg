import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
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
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
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

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

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

        // 🔽 Récupération des commandes
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(ordersData);
        });

        return () => unsubscribeOrders();
      } else {
        setOrders([]);
      }
    });

    return unsubscribe;
  }, []);

  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log('Login error:', error.code, error.message);
      alert(`Login failed: ${error.code} - ${error.message}`);
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
      console.log('Register error:', error.code, error.message);
      alert(`Registration failed: ${error.code} - ${error.message}`);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {user ? (
        <View style={styles.card}>
          <Text style={styles.subtitle}>Connected as</Text>
          <Text style={styles.email}>{user.email}</Text>

          {isEditing ? (
            // Formulaire d'édition
            <>
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

              <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Affichage des informations
            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>First Name:</Text>
                <Text style={styles.infoValue}>{firstName || 'Not set'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Name:</Text>
                <Text style={styles.infoValue}>{lastName || 'Not set'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>{age || 'Not set'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>City:</Text>
                <Text style={styles.infoValue}>{city || 'Not set'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>{address || 'Not set'}</Text>
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.primaryButtonText}>Edit Information</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.ordersContainer}>
            <Text style={styles.ordersTitle}>My Orders</Text>
            {orders.length === 0 ? (
              <Text style={styles.noOrders}>No orders yet</Text>
            ) : (
              <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.orderItem}>
                    <Text style={styles.orderDate}>
                      {item.createdAt instanceof Timestamp 
                        ? item.createdAt.toDate().toLocaleDateString()
                        : new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.orderTotal}>Total: ${item.total.toFixed(2)}</Text>
                    <Text style={styles.orderStatus}>Status: {item.status}</Text>
                    <Text style={styles.orderItems}>
                      Items: {item.items.map((wine: any) => `${wine.name} (${wine.quantity})`).join(', ')}
                    </Text>
                  </View>
                )}
                scrollEnabled={false}
              />
            )}
          </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 16,
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
    alignSelf: 'center',
    marginBottom: 20,
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
  ordersContainer: {
    width: '100%',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  ordersTitle: {
    fontSize: 18,
    fontFamily: Colors.typography.bodyBold,
    marginBottom: 10,
    textAlign: 'center',
  },
  noOrders: {
    textAlign: 'center',
    color: Colors.palette.textSecondary,
    fontStyle: 'italic',
  },
  orderItem: {
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.primary,
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 14,
    color: Colors.palette.textSecondary,
    marginTop: 2,
  },
  orderItems: {
    fontSize: 12,
    color: Colors.palette.textSecondary,
    marginTop: 4,
  },
  profileInfo: {
    width: '100%',
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  infoLabel: {
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.textPrimary,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.palette.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
});
