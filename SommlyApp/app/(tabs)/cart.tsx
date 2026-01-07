import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { CartContext } from "../../context/CartContext";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import Constants from "expo-constants";

/* =========================
   UTILS
========================= */
function getBaseUrl() {
  if (Platform.OS === "android" && !Constants.isDevice) {
    return "http://10.0.2.2:4242";
  }

  const host = Constants.expoConfig?.hostUri?.split(":").shift() ?? "localhost";
  return `http://${host}:4242`;
}

/* =========================
   SCREEN
========================= */
export default function CartScreen() {
  const { cartItems, removeFromCart, clearCart } =
    useContext(CartContext);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     STRIPE
  ========================= */
  async function fetchClientSecret() {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const amount = Math.round(total * 100);
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/create-payment-intent`;

    // Set a fetch timeout so we get a clear error instead of a silent hang
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const body = await res.text();
        console.error("Create payment intent failed:", res.status, body);
        Alert.alert("Erreur serveur", `${res.status}: ${body}`);
        throw new Error(`Server error ${res.status}`);
      }

      const { clientSecret } = await res.json();
      return clientSecret;
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = (err as any)?.name === "AbortError";
      if (isAbort) {
        console.error("Network timeout to", url);
        Alert.alert("Timeout réseau", `La requête vers ${url} a expiré.`);
        throw new Error("Network timeout");
      }

      console.error("Network error while fetching client secret:", err);
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Erreur réseau", message);
      throw err;
    }
  }

  async function initializePaymentSheet() {
    try {
      setLoading(true);
      console.log("INIT PAYMENT");
      const clientSecret = await fetchClientSecret();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Sommly",
        paymentIntentClientSecret: clientSecret,
        returnURL: "sommlybase://stripe-redirect",
      });

      if (error) {
        console.error("Stripe init error:", error);
        Alert.alert("Erreur Paiement", error.message || "Échec de l'initialisation du paiement");
        return;
      }

      setReady(true);

      // Auto-open payment sheet after init to complete in one tap
      const { error: presentError } = await presentPaymentSheet();
      if (!presentError) {
        clearCart();
        setReady(false);
      } else {
        console.error("Payment error:", presentError);
      }
    } catch (err) {
      console.error("Stripe init error:", err);
      const message = err instanceof Error ? err.message : String(err);
      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  }

  async function openPaymentSheet() {
    const { error } = await presentPaymentSheet();

    if (!error) {
      clearCart();
      setReady(false);
    }
  }

  /* =========================
     EMPTY CART
  ========================= */
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🍷</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySubtitle}>
          Discover our exceptional wines and start your selection!
        </Text>
      </View>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: item.image }}
              style={styles.wineImage}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.wineName}>{item.name}</Text>
              <Text style={styles.priceText}>
                Price: ${item.price}
              </Text>
              <View style={styles.quantityContainer}>
                <Pressable
                  onPress={() => removeFromCart(item.id)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>
                <Text style={styles.quantityText}>
                  Quantity: {item.quantity}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* FOOTER FIXE */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: $
          {cartItems
            .reduce(
              (sum, item) =>
                sum + item.price * item.quantity,
              0
            )
            .toFixed(2)}
        </Text>

        <Pressable
          onPress={initializePaymentSheet}
          disabled={loading}
          style={[styles.payButton, loading && { opacity: 0.8 }]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.payButtonText}>
              Validate Order
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={openPaymentSheet}
          disabled={!ready}
          style={[
            styles.payButton,
            { backgroundColor: ready ? "#722F37" : "#999" },
          ]}
        >
          <Text style={styles.payButtonText}>Pay</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    margin: 16,
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
  },
  wineImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  wineName: {
    fontSize: 18,
    marginBottom: 6,
  },
  priceText: {
    fontSize: 16,
    color: Colors.palette.primary,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: Colors.palette.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  quantityButtonText: {
    color: "white",
    fontSize: 18,
  },
  quantityText: {
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  totalText: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: "center",
    color: Colors.palette.primary,
  },
  payButton: {
    backgroundColor: "#722F37",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 80,
  },
  emptyTitle: {
    fontSize: 24,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 6,
  },
});
