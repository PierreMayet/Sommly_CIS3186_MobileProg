import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Image principale */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <Text style={styles.title}>Sommly</Text>
        <Text style={styles.subtitle}>
          Discover exceptional wines, carefully selected for every occasion.
        </Text>

        {/* Bouton vers la boutique */}
        <Pressable style={styles.button} onPress={() => router.push('/two')}>
          <Text style={styles.buttonText}>Explore the shop</Text>
        </Pressable>

        {/* Section avec images et texte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>A curated selection</Text>
          <Text style={styles.sectionText}>
            At Sommly, every wine is carefully chosen by our expert sommeliers.
            From bold reds to crisp whites, discover flavors from around the world.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03' }}
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03' }}
              style={styles.smallImage}
            />

          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Promise</Text>
          <Text style={styles.sectionText}>
            Premium wines selected by experts, detailed tasting notes, easy delivery,
            and personalized recommendations for every wine lover.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03' }}
              style={styles.smallImage}
            />

          </ScrollView>
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
    marginBottom: 36,
  },
  buttonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
  },
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
});
