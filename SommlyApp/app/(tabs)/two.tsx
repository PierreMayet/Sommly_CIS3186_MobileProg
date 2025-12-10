import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager, View as RNView, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { CartContext } from '../../context/CartContext';

const db = getFirestore(app);

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

function WineAccordion({ wine, onAdd }: {wine: any, onAdd: () => void}) {
  const [expanded, setExpanded] = useState(false);
  // Normalize firebase fields in case the casing differs (e.g. "year" vs "Year", "pairing" vs "Pairing").
  const description = wine.description ?? wine.Description ?? '';
  const origin = wine.origin ?? {};
  const year = origin.Year ?? origin.year ?? wine.year;
  const pairings = wine.Pairing ?? wine.pairings ?? wine.pairing ?? [];
  
  return (

    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.85}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(e => !e);
        }}
      >
        <Image source={{ uri: wine.image }} style={styles.wineImage} />
        <View style={{ flex: 1, marginLeft: 12, flexDirection:'row',alignItems:'center',justifyContent: 'space-between'}}>
          <Text style={styles.wineName}>{wine.name}</Text>
          <Text style={styles.expandIcon}>{expanded ? '-' : '+'}</Text>

        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          
          {wine.color && <Text>Color: {wine.color}</Text>}
          {description && <Text>"{description}"</Text>}
          {origin && (origin.country || origin.region) && (
            <Text>
              Origin: {origin.country}{origin.region ? `, ${origin.region}` : ''}
            </Text>
          )}
          {typeof year !== 'undefined' && <Text>Year: {year}</Text>}
          {'rating' in wine && <Text>Rating: {wine.rating} ⭐</Text>}
          

          {Array.isArray(pairings) && pairings.length > 0 && (
            <RNView style={{flexDirection:'row',flexWrap:'wrap',marginTop:4}}>
              {pairings.map((p:string,i:number) => (
                <RNView key={i} style={{backgroundColor:'#eee',borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginRight:5,marginBottom:4}}>
                  <Text style={{fontSize:13}}>{p}</Text>
                </RNView>
              ))}
            </RNView>
          )}
          <Button title="Add to Cart" onPress={onAdd} />
        </View>
      )}
    </View>
  );
}

export default function ShopScreen() {
  const [wines, setWines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

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

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (wines.length === 0) return <View style={styles.center}><Text>No wine found.</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop</Text>
      <FlatList
        data={wines}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WineAccordion
            wine={item}
            onAdd={() => addToCart({ id: item.id, name: item.name, image: item.image })}
          />
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
  accordionContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  wineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e2e2e2',
  },
  wineName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  expandIcon: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#444',
    marginLeft: 15,
  },
  accordionContent: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
});
