import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

// --- AJOUTS POUR L'IOT ---
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
const db = getFirestore(app);
// -------------------------

export default function HomeScreen() {
  const router = useRouter();

  // --- LOGIQUE IOT (Lecture en temps réel) ---
  const [cellarData, setCellarData] = useState({ temperature: '--', humidity: '--' });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "cellar_sensors", "sensor_01"), (snapshot) => {
      if (snapshot.exists()) {
        setCellarData(snapshot.data() as any);
      }
    });
    return () => unsub();
  }, []);
  // --------------------------------------------

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>

        <Image
          source={{
            uri: 'https://legardemangerdusud.com/wp-content/uploads/2024/06/1718769825_route-des-vins-de-provence-escales-degustatives-et-panoramas-enchanteurs.jpg',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.title}>Sommly</Text>
        <Text style={styles.subtitle}>
          Discover exceptional wines, carefully selected for every occasion.
        </Text>

        <Pressable style={styles.button} onPress={() => router.push('/two')}>
          <Text style={styles.buttonText}>Explore the shop</Text>
        </Pressable>

        {/* --- BLOC IOT : SMART CELLAR STATUS --- */}
        <View style={styles.iotCard}>
          <View style={styles.iotHeader}>
            <Text style={styles.iotTitle}>🍷 Smart Cellar Status</Text>
            <View style={styles.liveDot} />
          </View>
          <View style={styles.iotStatsRow}>
            <View style={styles.iotStatBox}>
              <Text style={styles.iotStatLabel}>TEMPERATURE</Text>
              <Text style={styles.iotStatValue}>{cellarData.temperature}°C</Text>
            </View>
            <View style={styles.iotStatBox}>
              <Text style={styles.iotStatLabel}>HUMIDITY</Text>
              <Text style={styles.iotStatValue}>{cellarData.humidity}%</Text>
            </View>
          </View>
          <Text style={styles.iotStatusText}>● Real-time monitoring enabled</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A curated selection</Text>
          <Text style={styles.sectionText}>
            At Sommly, every wine is carefully chosen by our expert sommeliers.
            From bold reds to crisp whites, discover flavors from around the world.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <Image
              source={{ uri: 'https://s3.eu-west-3.amazonaws.com/butler-academy.com/wp-content/uploads/2022/03/26155223/9.jpg' }}
              style={styles.smallImage}
            />
            <Image
              source={{ uri: 'https://s3.eu-west-3.amazonaws.com/butler-academy.com/wp-content/uploads/2025/11/28155023/image.jpg' }}
              style={styles.smallImage}
            />
            <Image
              source={{ uri: 'https://www.lepetitsommelier.paris/wp-content/uploads/elementor/thumbs/Comment_en_apprendre_le_maximum_sur_l_univers_du_vin_-pxujzn1u0z9vop41urnsjbiekuca5yinq6w4weonrk.jpg' }}
              style={styles.smallImage}
            />
            <Image
              source={{ uri: 'https://cdn.pixabay.com/photo/2017/01/04/13/57/wine-1952051_1280.jpg' }}
              style={styles.smallImage}
            />
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience and Passion</Text>
          <Text style={styles.sectionText}>
            Our sommeliers guide you to the perfect wine for any moment.
            Enjoy tasting notes, region details, and food pairing tips for every bottle.
          </Text>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/recommendation')}
          >
            <Text style={styles.secondaryButtonText}>
              Discover Sommelier Recommendations
            </Text>
          </Pressable>

          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2015/10/24/11/09/red-wine-1004255_1280.jpg',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Promise</Text>
          <Text style={styles.sectionText}>
            Premium wines selected by experts, detailed tasting notes, easy delivery,
            and personalized recommendations for every wine lover.
          </Text>

          <Image
            source={{
              uri: 'https://cdn.pixabay.com/photo/2014/11/22/18/38/christmas-background-541922_1280.jpg',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontFamily: Colors.typography.heading,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: Colors.palette.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 24, // Réduit un peu pour laisser de la place à la carte IoT
  },
  buttonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
  },
  // --- NOUVEAUX STYLES IOT ---
  iotCard: {
    width: '100%',
    backgroundColor: '#fdf7f7',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  iotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iotTitle: {
    fontSize: 18,
    fontFamily: Colors.typography.heading,
    color: Colors.palette.primary,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  iotStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iotStatBox: {
    alignItems: 'center',
  },
  iotStatLabel: {
    fontSize: 10,
    fontFamily: Colors.typography.bodyBold,
    color: '#999',
    letterSpacing: 1,
  },
  iotStatValue: {
    fontSize: 26,
    fontFamily: Colors.typography.heading,
    color: Colors.palette.textPrimary,
  },
  iotStatusText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#4CAF50',
    marginTop: 12,
    fontFamily: Colors.typography.bodyBold,
  },
  // ---------------------------
  section: {
    width: '100%',
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: Colors.typography.heading,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  imageRow: {
    flexDirection: 'row',
  },
  smallImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
  },
  secondaryButton: {
    alignSelf: 'center',
    backgroundColor: Colors.palette.primary, 
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.light.card, 
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
    textAlign: 'center',
  },
});