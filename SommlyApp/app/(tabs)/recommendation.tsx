import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function SommelierScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sommelier</Text>
      <View style={styles.separator} lightColor={Colors.light.border} darkColor={Colors.dark.border} />
      {/* Add sommelier recommender content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 20,
    fontFamily: Colors.typography.heading,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
