import React, { useContext, useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { app } from "../../firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

/* =========================
   UTILS - Improved URL Detection
========================= */
const BACKEND_PORT = 4242;
const CACHED_URL_KEY = "@sommly_backend_url";

/**
 * Get all possible backend URLs to try
 */
function getAllPossibleUrls(): string[] {
  const urls: string[] = [];

  // 1. Android Emulator (always first for Android emulator)
  if (Platform.OS === "android" && !Constants.isDevice) {
    urls.push("http://10.0.2.2:4242");
    return urls; // Return early for emulator
  }

  // 2. Try to get cached URL (if exists)
  // This will be loaded asynchronously, so we'll handle it separately

  // 3. Try Expo hostUri (most reliable for Expo Go)
  try {
    if (Constants.expoConfig?.hostUri) {
      const host = Constants.expoConfig.hostUri.split(":").shift();
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        urls.push(`http://${host}:${BACKEND_PORT}`);
      }
    }
  } catch (error) {
    console.warn("Error getting hostUri:", error);
  }

  // 4. Try debuggerHost (alternative Expo method)
  try {
    const expoConfig = Constants.expoConfig as any;
    if (expoConfig?.debuggerHost) {
      const host = expoConfig.debuggerHost.split(":").shift();
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        urls.push(`http://${host}:${BACKEND_PORT}`);
      }
    }
  } catch (error) {
    console.warn("Error getting debuggerHost:", error);
  }

  // 5. Try manifest2 extra.expoGo.debuggerHost (for newer Expo versions)
  try {
    const manifest = (Constants.manifest2 || Constants.manifest) as any;
    if (manifest?.extra?.expoGo?.debuggerHost) {
      const host = manifest.extra.expoGo.debuggerHost.split(":").shift();
      if (host && host !== "localhost" && host !== "127.0.0.1") {
        urls.push(`http://${host}:${BACKEND_PORT}`);
      }
    }
  } catch (error) {
    console.warn("Error getting manifest debuggerHost:", error);
  }

  // 6. For iOS Simulator, use localhost
  if (Platform.OS === "ios" && !Constants.isDevice) {
    urls.push(`http://localhost:${BACKEND_PORT}`);
  }

  // 7. Fallback to localhost (for web or when all else fails)
  urls.push(`http://localhost:${BACKEND_PORT}`);

  // Remove duplicates
  return Array.from(new Set(urls));
}

/**
 * Test if a URL is reachable
 */
async function testUrl(url: string, timeout: number = 3000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${url}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1000 }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok || response.status === 405; // 405 = Method not allowed (but server is reachable)
  } catch (error) {
    return false;
  }
}

/**
 * Find working backend URL by trying multiple options
 */
async function findWorkingUrl(): Promise<string> {
  // Try cached URL first
  try {
    const cachedUrl = await AsyncStorage.getItem(CACHED_URL_KEY);
    if (cachedUrl) {
      console.log("Testing cached URL:", cachedUrl);
      const isWorking = await testUrl(cachedUrl, 2000);
      if (isWorking) {
        console.log("✅ Using cached URL:", cachedUrl);
        return cachedUrl;
      }
    }
  } catch (error) {
    console.warn("Error checking cached URL:", error);
  }

  // Get all possible URLs
  const urls = getAllPossibleUrls();
  console.log("🔍 Trying URLs:", urls);

  // Try each URL
  for (const url of urls) {
    console.log(`Testing: ${url}`);
    const isWorking = await testUrl(url, 2000);
    if (isWorking) {
      console.log(`✅ Found working URL: ${url}`);
      // Cache the working URL
      try {
        await AsyncStorage.setItem(CACHED_URL_KEY, url);
      } catch (error) {
        console.warn("Failed to cache URL:", error);
      }
      return url;
    }
  }

  // If none work, return the first one (will show error to user)
  console.warn("⚠️ No working URL found, using first option:", urls[0]);
  return urls[0] || `http://localhost:${BACKEND_PORT}`;
}

/* =========================
   SCREEN
========================= */
export default function CartScreen() {
  const { cartItems, removeFromCart, increaseQuantity, clearCart } =
    useContext(CartContext);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Find working backend URL on component mount
  useEffect(() => {
    findWorkingUrl().then((url) => {
      setBackendUrl(url);
      console.log("Backend URL set to:", url);
    });
  }, []);

  /* =========================
     STRIPE
  ========================= */
  async function fetchClientSecret() {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const amount = Math.round(total * 100);

    // Get backend URL (use cached or find new one)
    let baseUrl = backendUrl;
    if (!baseUrl) {
      console.log("No cached URL, finding working URL...");
      baseUrl = await findWorkingUrl();
      setBackendUrl(baseUrl);
    }

    const url = `${baseUrl}/create-payment-intent`;
    console.log("Making payment request to:", url);

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
        
        // Try to find a different working URL
        console.log("Trying to find alternative URL...");
        const newUrl = await findWorkingUrl();
        if (newUrl !== baseUrl) {
          setBackendUrl(newUrl);
          // Retry once with new URL
          return fetchClientSecret();
        }

        Alert.alert(
          "Erreur serveur",
          `Status: ${res.status}\nURL: ${url}\n\nAssurez-vous que le serveur backend est démarré sur le port 4242.`
        );
        throw new Error(`Server error ${res.status}`);
      }

      const { clientSecret } = await res.json();
      return clientSecret;
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = (err as any)?.name === "AbortError";
      
      if (isAbort) {
        console.error("Network timeout to", url);
        
        // Try to find a different working URL before showing error
        console.log("Timeout detected, trying to find alternative URL...");
        const newUrl = await findWorkingUrl();
        if (newUrl !== baseUrl) {
          setBackendUrl(newUrl);
          // Retry once with new URL
          try {
            return await fetchClientSecret();
          } catch (retryErr) {
            // If retry also fails, show error
          }
        }

        Alert.alert(
          "Timeout réseau",
          `Impossible de se connecter à: ${url}\n\nVérifiez que:\n1. Le serveur backend est démarré (port 4242)\n2. Vous êtes sur le même réseau WiFi\n3. Le firewall n'est pas bloqué\n\nEssayez de redémarrer le serveur backend.`
        );
        throw new Error("Network timeout");
      }

      console.error("Network error while fetching client secret:", err);
      const message = err instanceof Error ? err.message : String(err);
      
      // Try to find a different working URL
      const newUrl = await findWorkingUrl();
      if (newUrl !== baseUrl) {
        setBackendUrl(newUrl);
        // Retry once with new URL
        try {
          return await fetchClientSecret();
        } catch (retryErr) {
          // If retry also fails, show error
        }
      }

      Alert.alert(
        "Network error",
        `URL: ${url}\n\nErreur: ${message}\n\nVérifiez que le serveur backend est démarré.\n\nCommande: cd backend && npm start`
      );
      throw err;
    }
  }

  async function saveOrder() {
    if (!user) return;

    try {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cartItems,
        total: total,
        status: "paid",
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  }

  async function initializePaymentSheet() {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "You must be logged in to validate an order. Please go to Profile to login or register."
      );
      return;
    }

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
        return;
      }

      setReady(true);

      // Auto-open payment sheet after init to complete in one tap
      const { error: presentError } = await presentPaymentSheet();
      if (!presentError) {
        // Payment successful, save order to Firestore
        await saveOrder();
        clearCart();
        setReady(false);
        Alert.alert("Success", "Your order has been placed successfully!");
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
                <Pressable
                  onPress={() => increaseQuantity(item.id)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
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
