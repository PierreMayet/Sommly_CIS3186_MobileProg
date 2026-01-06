import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, FlatList, Image, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { CartContext } from '../../context/CartContext';

const db = getFirestore(app);

export default function SommelierScreen() {
  const [wines, setWines] = useState<any[]>([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const winesCol = collection(db, 'wines');
        const snapshot = await getDocs(winesCol);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWines(data);
      } catch (e) {
        console.error('Error fetching wines:', e);
      }
    };

    fetchWines();
  }, []);

  const renderRecommendation = (wine: any) => {
    const origin = wine.origin ?? {};
    const pairings = wine.pairing ?? [];

    return (
      <View style={styles.card}>
        {wine.image && (
          <Image source={{ uri: wine.image }} style={styles.wineImage} />
        )}

        <Text style={styles.wineType}>{wine.color}</Text>
        <Text style={styles.wineTitle}>{wine.name}</Text>


        {wine.description && (
          <Text style={styles.comment}>
            {wine.description}
          </Text>
        )}


        {(origin.country || origin.region || origin.Year) && (
          <Text style={styles.meta}>
            Origin: {origin.country}
            {origin.region ? `, ${origin.region}` : ''}
            {origin.Year ? ` • ${origin.Year}` : ''}
          </Text>
        )}


        {pairings.length > 0 && (
          <Text style={styles.pairing}>
            Perfect with: {pairings.join(', ')}
          </Text>
        )}

        <Button
          title="Add to Cart"
          onPress={() =>
            addToCart({
              id: wine.id,
              name: wine.name,
              image: wine.image,
            })
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sommelier Recommendations</Text>
      <View
        style={styles.separator}
        lightColor={Colors.light.border}
        darkColor={Colors.dark.border}
      />

      <FlatList
        data={wines}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => renderRecommendation(item)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    marginBottom: 8,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: '85%',
  },
  card: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  wineImage: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  wineType: {
    fontSize: 13,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  wineTitle: {
    fontSize: 18,
    fontFamily: Colors.typography.subheading,
    marginBottom: 8,
    textAlign: 'center',
  },
  comment: {
    fontSize: 15,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  meta: {
    fontSize: 13,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  pairing: {
    fontSize: 14,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.secondary,
    marginBottom: 12,
    textAlign: 'center',
  },
});
