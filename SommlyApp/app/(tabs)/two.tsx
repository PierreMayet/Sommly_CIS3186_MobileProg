import React, { useEffect, useState, useContext, useRef } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager, View as RNView, Button, TextInput, ScrollView, PanResponder } from 'react-native';
import { Text, View } from '@/components/Themed';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../firebaseConfig';
import { CartContext } from '../../context/CartContext';
import Colors from '@/constants/Colors';

const db = getFirestore(app);

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Red', value: 'Red' },
  { label: 'White', value: 'White' },
  { label: 'Rosé', value: 'Rosé' },
  { label: 'Sweet White', value: 'Sweet White' },
  { label: 'Champagne', value: 'Champagne' },
];

// Composant Range Slider avec deux poignées
function RangeSlider({ 
  min, 
  max, 
  minValue, 
  maxValue, 
  onValueChange, 
  style 
}: { 
  min: number; 
  max: number; 
  minValue: number; 
  maxValue: number; 
  onValueChange: (minVal: number, maxVal: number) => void;
  style?: any;
}) {
  const sliderRef = useRef<RNView>(null);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);

  const getValueFromPosition = (pageX: number) => {
    if (sliderRef.current) {
      sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
        const ratio = Math.max(0, Math.min(1, (pageX - pageX) / width));
        return min + (max - min) * ratio;
      });
    }
    return null;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (sliderRef.current) {
        sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          const touchX = evt.nativeEvent.pageX;
          const ratio = Math.max(0, Math.min(1, (touchX - pageX) / width));
          const touchValue = min + (max - min) * ratio;
          
          // Déterminer quelle poignée est la plus proche
          const minDist = Math.abs(touchValue - minValue);
          const maxDist = Math.abs(touchValue - maxValue);
          
          if (minDist < maxDist) {
            setActiveThumb('min');
          } else {
            setActiveThumb('max');
          }
        });
      }
    },
    onPanResponderMove: (evt) => {
      if (sliderRef.current && activeThumb) {
        sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
          const touchX = evt.nativeEvent.pageX;
          const ratio = Math.max(0, Math.min(1, (touchX - pageX) / width));
          const newValue = Math.round(min + (max - min) * ratio);
          
          if (activeThumb === 'min') {
            const newMin = Math.max(min, Math.min(newValue, maxValue - 1));
            onValueChange(newMin, maxValue);
          } else {
            const newMax = Math.min(max, Math.max(newValue, minValue + 1));
            onValueChange(minValue, newMax);
          }
        });
      }
    },
    onPanResponderRelease: () => {
      setActiveThumb(null);
    },
  });

  const minPercentage = ((minValue - min) / (max - min)) * 100;
  const maxPercentage = ((maxValue - min) / (max - min)) * 100;

  return (
    <RNView 
      ref={sliderRef}
      style={[{ width: '100%', height: 50, justifyContent: 'center', paddingVertical: 10 }, style]}
      {...panResponder.panHandlers}
    >
      <RNView style={styles.sliderTrack}>
        <RNView 
          style={[
            styles.sliderFill, 
            { 
              left: `${minPercentage}%`, 
              width: `${maxPercentage - minPercentage}%` 
            }
          ]} 
        />
        <RNView 
          style={[
            styles.sliderThumb, 
            { left: `${minPercentage}%`, marginLeft: -10 },
            activeThumb === 'min' && styles.sliderThumbActive
          ]} 
        />
        <RNView 
          style={[
            styles.sliderThumb, 
            { left: `${maxPercentage}%`, marginLeft: -10 },
            activeThumb === 'max' && styles.sliderThumbActive
          ]} 
        />
      </RNView>
    </RNView>
  );
}


function FiltersToggle({
  active,
  onChange,
  pairingOptions,
  pairingFilter,
  setPairingFilter,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange
}: {
  active: string;
  onChange: (v: string) => void;
  pairingOptions: string[];
  pairingFilter: string[];
  setPairingFilter: (v: string) => void;
  minPrice: number;
  maxPrice: number;
  priceRange: { min: number; max: number };
  onPriceChange: (min: number, max: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.filterBar}>
      <TouchableOpacity onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOpen(o => !o);
      }}>
        <Text style={styles.filterLink}>Filters {open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <>
          <View style={styles.filterList}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterBtn, active === f.value && styles.filterBtnActive]}
                onPress={() => onChange(f.value)}
              >
                <Text style={[styles.filterBtnText, active === f.value && styles.filterBtnTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Chips des plats scrollables dans le même dropdown */}
          {pairingOptions.length > 1 && (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:8, marginBottom:6}}>
    <RNView>
      {/* Répartit équitablement les chips sur 3 lignes */}
      {(() => {
        const chunkSize = Math.ceil(pairingOptions.length / 3);
        const rows = [
          pairingOptions.slice(0, chunkSize),
          pairingOptions.slice(chunkSize, chunkSize * 2),
          pairingOptions.slice(chunkSize * 2)
        ];
        return rows.map((chips, rowIdx) => (
          <RNView key={rowIdx} style={{flexDirection:'row', marginBottom: rowIdx < 2 ? 3 : 0}}>
            {chips.map(item => {
              const isAll = item === 'all';
              const isChecked = isAll ? pairingFilter.length === 0 : pairingFilter.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.filterBtn,
                    isChecked && styles.filterBtnActive,
                    { marginRight: 8, marginBottom: 4 }
                  ]}
                  onPress={() => setPairingFilter(item)}
                >
                  <Text style={[
                    styles.filterBtnText,
                    isChecked && styles.filterBtnTextActive
                  ]}>{isAll ? 'All pairings' : item}</Text>
                </TouchableOpacity>
              );
            })}
          </RNView>
        ));
      })()}
    </RNView>
  </ScrollView>
          )}
          {/* Filtre de prix avec range slider */}
          <RNView style={styles.priceFilterContainer}>
            <Text style={styles.priceFilterLabel}>Price Range: ${priceRange.min} - ${priceRange.max}</Text>
            <RangeSlider
              min={minPrice}
              max={maxPrice}
              minValue={priceRange.min}
              maxValue={priceRange.max}
              onValueChange={onPriceChange}
            />
            <RNView style={styles.priceInputsRow}>
              <RNView style={styles.priceInputContainer}>
                <Text style={styles.priceInputLabel}>Min</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder={`${minPrice}`}
                  keyboardType="numeric"
                  value={priceRange.min > minPrice ? priceRange.min.toString() : ''}
                  onChangeText={(text) => {
                    const val = text ? parseFloat(text) : minPrice;
                    onPriceChange(Math.max(minPrice, Math.min(val, priceRange.max)), priceRange.max);
                  }}
                />
              </RNView>
              <RNView style={styles.priceInputContainer}>
                <Text style={styles.priceInputLabel}>Max</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder={`${maxPrice}`}
                  keyboardType="numeric"
                  value={priceRange.max < maxPrice ? priceRange.max.toString() : ''}
                  onChangeText={(text) => {
                    const val = text ? parseFloat(text) : maxPrice;
                    onPriceChange(priceRange.min, Math.min(maxPrice, Math.max(val, priceRange.min)));
                  }}
                />
              </RNView>
            </RNView>
            <TouchableOpacity
              style={styles.resetPriceButton}
              onPress={() => onPriceChange(minPrice, maxPrice)}
            >
              <Text style={styles.resetPriceText}>Reset Price Filter</Text>
            </TouchableOpacity>
          </RNView>
        </>
      )}
    </View>
  );
}

function WineAccordion({ wine, onAdd }: {wine: any, onAdd: () => void}) {
  const [expanded, setExpanded] = useState(false);
  // Normalize firebase fields in case the casing differs (e.g. "year" vs "Year", "pairing" vs "Pairing").
  const description = wine.description ?? wine.Description ?? '';
  const origin = wine.origin ?? {};
  const year = origin.Year ?? origin.year ?? wine.year;
  const pairings = wine.Pairing ?? wine.pairings ?? wine.pairing ?? [];
  
  return (

    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        activeOpacity={0.85}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setExpanded(e => !e);
        }}
      >
        <Image source={{ uri: wine.image }} style={styles.wineImage} />
        <View style={{ flex: 1, marginLeft: 12, flexDirection:'row',alignItems:'center',justifyContent: 'space-between'}}>
          <Text style={styles.wineName}>{wine.name}</Text>
          <Text style={styles.expandIcon}>{expanded ? '-' : '+'}</Text>

        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          
          {wine.color && <Text>Color: {wine.color}</Text>}
          {description && <Text>"{description}"</Text>}
          {origin && (origin.country || origin.region) && (
            <Text>
              Origin: {origin.country}{origin.region ? `, ${origin.region}` : ''}
            </Text>
          )}
          {typeof year !== 'undefined' && <Text>Year: {year}</Text>}
          {'rating' in wine && <Text>Rating: {wine.rating} ⭐</Text>}
          {wine.price && <Text>Price: ${wine.price}</Text>}
          

          {Array.isArray(pairings) && pairings.length > 0 && (
            <RNView style={{flexDirection:'row',flexWrap:'wrap',marginTop:4}}>
              {pairings.map((p:string,i:number) => (
                <RNView key={i} style={{backgroundColor: Colors.light.muted,borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginRight:5,marginBottom:4}}>
                  <Text style={{fontSize:13}}>{p}</Text>
                </RNView>
              ))}
            </RNView>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAdd}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function ShopScreen() {
  const [wines, setWines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [pairingFilter, setPairingFilter] = useState<string[]>([]);
  const [pairingOptions, setPairingOptions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const { addToCart } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchWines = async () => {
      setLoading(true);
      const winesCol = collection(db, 'wines');
      const wineSnapshot = await getDocs(winesCol);
      const data = wineSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setWines(data);
      // Extraction dynamique (regroupement et normalisation)
      const pairingMap = new Map<string, string>();
      data.forEach((wine: any) => {
        let pairArr = wine.Pairing || wine.pairings || wine.pairing || [];
        if (!Array.isArray(pairArr)) pairArr = [];
        pairArr.forEach((p: string) => {
          const norm = p.trim().toLowerCase();
          if (norm && !pairingMap.has(norm)) {
            pairingMap.set(norm, p.trim());
          }
        });
      });
      setPairingOptions(['all', ...Array.from(pairingMap.values())]);
      
      // Calculer les prix min et max
      const prices = data
        .map((w: any) => parseFloat(w.price) || 0)
        .filter((p: number) => p > 0);
      if (prices.length > 0) {
        const calculatedMin = Math.floor(Math.min(...prices));
        const calculatedMax = Math.ceil(Math.max(...prices));
        setMinPrice(calculatedMin);
        setMaxPrice(calculatedMax);
        setPriceRange({ min: calculatedMin, max: calculatedMax });
      }
      
      setLoading(false);
    };
    fetchWines();
  }, []);

  const filtered = (wines as any[]).filter((w: any) => {
    const matchesFilter = filter === 'all' || (w.color ?? w.Color) === filter;
    let pairArr = (w.Pairing ?? w.pairings ?? w.pairing ?? []);
    if (!Array.isArray(pairArr)) pairArr = [];
    // Si aucun pairing n'est coché, on affiche tout (par défaut ou si "All pairings" activé)
    const matchesPairing =
      pairingFilter.length === 0 || pairArr.some((p: string) => pairingFilter.includes(p.trim()));
    const matchesSearch = w.name?.toLowerCase().includes(searchQuery.toLowerCase());
    // Filtre de prix
    const winePrice = parseFloat(w.price) || 0;
    const matchesPrice = winePrice >= priceRange.min && winePrice <= priceRange.max;
    return matchesFilter && matchesPairing && matchesSearch && matchesPrice;
  });
  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10, paddingHorizontal: 5 }}>
        <TextInput
          style={{ height: 40, backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10 }}
          placeholder="Search for a wine..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FiltersToggle
        active={filter}
        onChange={setFilter}
        pairingOptions={pairingOptions}
        pairingFilter={pairingFilter}
        setPairingFilter={(v: string) => {
          setPairingFilter((prev) => {
            if (v === 'all') return [];
            if (prev.includes(v)) {
              return prev.filter(x => x !== v);
            } else {
              return [...prev, v];
            }
          });
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        priceRange={priceRange}
        onPriceChange={(min, max) => setPriceRange({ min, max })}
      />
      {filtered.length === 0 ? (
        <View style={styles.center}><Text>No wine found.</Text></View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <WineAccordion
              wine={item}
              onAdd={() => addToCart({ id: item.id, name: item.name, image: item.image, price: item.price })}
            />
          )}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontFamily: Colors.typography.heading,
    marginBottom: 16,
    alignSelf: 'center',
  },
  filterBar: {
    marginBottom: 12,
  },
  filterLink: {
    color: Colors.palette.primary,
    fontFamily: Colors.typography.bodyBold,
    fontSize: 16,
  },
  filterList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.light.muted,
    marginRight: 8,
    marginBottom: 8,
  },
  filterBtnActive: {
    backgroundColor: Colors.palette.primary,
  },
  filterBtnText: {
    color: Colors.palette.textPrimary,
  },
  filterBtnTextActive: {
    color: Colors.light.card,
    fontFamily: Colors.typography.bodyBold,
  },
  accordionContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.light.card,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 15,
  },
  expandIcon: {
    fontSize: 36,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.secondary,
    marginLeft: 15,
  },
  accordionContent: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  addButton: {
    backgroundColor: Colors.palette.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: Colors.light.card,
    fontSize: 16,
    fontFamily: Colors.typography.bodyBold,
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  priceFilterContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.light.muted,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceFilterLabel: {
    fontSize: 14,
    fontFamily: Colors.typography.bodyBold,
    color: Colors.palette.textPrimary,
    marginBottom: 8,
  },
  priceInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  priceInputLabel: {
    fontSize: 12,
    color: Colors.palette.textSecondary,
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: Colors.palette.textPrimary,
  },
  resetPriceButton: {
    backgroundColor: Colors.palette.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  resetPriceText: {
    color: Colors.light.card,
    fontSize: 12,
    fontFamily: Colors.typography.bodyBold,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: Colors.light.border,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.palette.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.palette.primary,
    position: 'absolute',
    top: -8,
    borderWidth: 2,
    borderColor: Colors.light.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderThumbActive: {
    transform: [{ scale: 1.2 }],
    shadowOpacity: 0.4,
    elevation: 5,
  },
});
