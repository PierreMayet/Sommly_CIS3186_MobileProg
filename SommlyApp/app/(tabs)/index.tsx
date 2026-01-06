import { StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

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
