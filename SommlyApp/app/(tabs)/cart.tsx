import React, { useContext, useState } from 'react';
import { StyleSheet, Image, FlatList, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { CartContext } from '../../context/CartContext';
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";

export default function CartScreen() {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  // --- LOGIQUE PAIEMENT STRIPE ---
  const [ready, setReady] = useState(false);

  async function fetchClientSecret() {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amount = Math.round(total * 100); // Convert to cents
    const res = await fetch("http://10.0.2.2:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    const { clientSecret } = await res.json();
    return clientSecret;
  }

  async function initializePaymentSheet() {
    const clientSecret = await fetchClientSecret();
    await initPaymentSheet({
      merchantDisplayName: "Sommly",
      paymentIntentClientSecret: clientSecret,
    });
    setReady(true);
  }

  async function openPaymentSheet() {
    const { error } = await presentPaymentSheet();
    if (!error) {
      // Payment successful, clear the cart
      clearCart();
    }
  }
  // --------------------------------

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🍷</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>Discover our exceptional wines and start your selection!</Text>
      </View>
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
              <Text style={styles.priceText}>Price: ${item.price}</Text>              
              <View style={styles.quantityContainer}>
                <Pressable onPress={() => removeFromCart(item.id)} style={styles.quantityButton}>
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>Quantité: {item.quantity}</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />

      {/* Total Price */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: ${cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
        </Text>
      </View>

      {/* --- BLOC PAIEMENT --- */}
      <View style={{ padding: 20, marginTop: 20 }}>
        <Pressable
          onPress={initializePaymentSheet}
          style={{
            backgroundColor: "#722F37",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Validate Order</Text>
        </Pressable>

        <Pressable
          onPress={openPaymentSheet}
          disabled={!ready}
          style={{
            backgroundColor: ready ? "#722F37" : "#999",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Pay</Text>
        </Pressable>
      </View>
      {/* ------------------- */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    marginBottom: 16,
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.light.card,
    padding: 10,
  },
  wineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.light.muted,
  },
  wineName: {
    fontFamily: Colors.typography.subheading,
    fontSize: 18,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontFamily: Colors.typography.body,
    color: Colors.palette.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.palette.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  quantityButtonText: {
    color: Colors.light.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
  },
  totalContainer: {
    padding: 16,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontFamily: Colors.typography.heading,
    color: Colors.palette.primary,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    color: Colors.palette.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
