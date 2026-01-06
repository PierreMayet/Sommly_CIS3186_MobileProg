import { useEffect } from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { Lato_400Regular, Lato_700Bold } from "@expo-google-fonts/lato";

import { CartProvider } from "../context/CartContext";

import { Stack } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    Lato_400Regular,
    Lato_700Bold,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <StripeProvider publishableKey="pk_test_51SmbsSI0awnRhdBdrBvkCwuOZL6jyGbK6tdqUytYQ2Uz5nvPM8vAKB4NJN2Yz7NkO2NlfCKhfI1HBKbkBK4H4EyF00qQegosXK">
      <CartProvider>
        <Slot />
      </CartProvider>
    </StripeProvider>
  );
}
