import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// TabBarIcon générique avec possibilité de passer un composant d'icône
function TabBarIcon(props: {
  name: string;
  color: string;
  IconComponent?: any;
}) {
  const Icon = props.IconComponent || FontAwesome;
  return <Icon size={28} style={{ marginBottom: -3 }} name={props.name} color={props.color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="recommendation"
        options={{
          title: 'Sommelier',
          tabBarIcon: ({ color }) => <TabBarIcon name="wine-bottle" color={color} IconComponent={FontAwesome5} />, // Utilise FontAwesome5 pour la bouteille
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />, 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />, 
        }}
      />
    </Tabs>
  );
}
