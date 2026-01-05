import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

const SOMMELIER_POSTS = [
  {
    id: '1',
    type: 'Red Wine',
    title: 'Château Margaux – Bordeaux',
    comment:
      'An iconic red wine with exceptional elegance. Aromas of blackcurrant, violet, and fine oak. A refined choice for special occasions.',
  },
  {
    id: '2',
    type: 'White Wine',
    title: 'Chablis Premier Cru',
    comment:
      'Crisp and mineral-driven, this wine reveals citrus zest and green apple notes. Perfect with oysters or grilled fish.',
  },
  {
    id: '3',
    type: 'Rosé Wine',
    title: 'Côtes de Provence Rosé',
    comment:
      'Light, fresh, and expressive. Notes of strawberry and white peach make this rosé ideal for summer aperitifs.',
  },
  {
    id: '4',
    type: 'Red Wine',
    title: 'Barolo – Piedmont',
    comment:
      'A powerful and complex red with aromas of cherry, leather, and truffle. Best enjoyed with rich and slow-cooked dishes.',
  },
  {
    id: '5',
    type: 'White Wine',
    title: 'Sancerre',
    comment:
      'Vibrant and aromatic, this Sauvignon Blanc offers floral notes and a clean finish. Excellent with goat cheese.',
  },
  {
    id: '6',
    type: 'Red Wine',
    title: 'Rioja Reserva',
    comment:
      'Smooth and balanced, featuring ripe red fruits, vanilla, and subtle spice. A great companion for grilled meats.',
  },
  {
    id: '7',
    type: 'Rosé Wine',
    title: 'Tavel Rosé',
    comment:
      'Structured and intense for a rosé. Rich aromas of red berries and spices make it perfect for food pairings.',
  },
  {
    id: '8',
    type: 'White Wine',
    title: 'Puligny-Montrachet',
    comment:
      'Elegant and round with notes of butter, hazelnut, and white flowers. A luxurious white wine for fine dining.',
  },
  {
    id: '9',
    type: 'Red Wine',
    title: 'Malbec – Mendoza',
    comment:
      'Bold and generous with dark fruit flavors and a hint of cocoa. A perfect match for barbecued dishes.',
  },
  {
    id: '10',
    type: 'White Wine',
    title: 'Riesling – Alsace',
    comment:
      'Fresh and aromatic, with notes of citrus and floral honey. Its vibrant acidity makes it very food-friendly.',
  },
];

export default function SommelierScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommendations</Text>

      <View
        style={styles.separator}
        lightColor={Colors.light.border}
        darkColor={Colors.dark.border}
      />

      <FlatList
        data={SOMMELIER_POSTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.wineTitle}>{item.title}</Text>
            <Text style={styles.comment}>{item.comment}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: Colors.typography.heading,
    alignSelf: 'center',
    marginBottom: 8,
  },
  separator: {
    marginVertical: 16,
    height: 1,
    width: '85%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  type: {
    fontSize: 13,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.primary,
    marginBottom: 6,
  },
  wineTitle: {
    fontSize: 18,
    fontFamily: Colors.typography.subheading,
    marginBottom: 8,
  },
  comment: {
    fontSize: 15,
    fontFamily: Colors.typography.body,
    color: Colors.palette.textSecondary,
    lineHeight: 22,
  },
});
