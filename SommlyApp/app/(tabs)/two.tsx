import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);

export default function ShopScreen() {
  const [wines, setWines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{[id: string]: number}>({});

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      const winesCol = collection(db, 'wines');
      const wineSnapshot = await getDocs(winesCol);
      setWines(wineSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchWines();
  }, []);

  function handleAddToCart(wineId: string) {
    setCart(prev => ({ ...prev, [wineId]: (prev[wineId] || 0) + 1 }));
    // TODO: plus tard, alimenter Firestore ou Context pour le vrai panier
  }

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (wines.length === 0) return <View style={styles.center}><Text>No wine found.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <FlatList
        data={wines}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.wineImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.wineName}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>⭐ {item.rating} | {item.color} | {item.origin?.country}, {item.origin?.region}</Text>
              <Text>Pairings:
                {Array.isArray(item.pairing) && item.pairing.map((p: string, i: number) =>
                  <Text key={i}> {p}{i<item.pairing.length-1?',':''}</Text>
                )}
              </Text>
              <Button title="Add to Cart"
                onPress={() => handleAddToCart(item.id)}
              />
              {cart[item.id] && <Text style={{ fontStyle: 'italic' }}>In Cart: {cart[item.id]}</Text>}
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  wineImage: {
    width: 75,
    height: 75,
    borderRadius: 8,
    backgroundColor: '#e2e2e2',
  },
  wineName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
});
