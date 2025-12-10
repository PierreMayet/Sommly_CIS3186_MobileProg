import React, { useContext } from 'react';
import { StyleSheet, Image, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { CartContext } from '../../context/CartContext';

export default function CartScreen() {
  const { cartItems } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <View style={styles.center}><Text>Your cart is empty.</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.wineImage} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.wineName}>{item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
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
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa',
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
    marginBottom: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
