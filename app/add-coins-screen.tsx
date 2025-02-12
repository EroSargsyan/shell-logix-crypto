import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { getCoinsMarkets } from '@/app/redux/slices/coinsSlice';
import { setTempWatchlist } from '@/app/redux/slices/tempWatchlistsSlice';
import { ICoin } from '@/app/types/types';
import Colors from '@/app/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function AddCoinsScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const { existingCoinIds } = useLocalSearchParams();
  let excludedCoinIds: string[] = [];
  if (existingCoinIds) {
    if (typeof existingCoinIds === 'string') {
      excludedCoinIds = existingCoinIds.split(',');
    } else if (Array.isArray(existingCoinIds)) {
      excludedCoinIds = existingCoinIds;
    }
  }

  const { items: allCoins, status, error } = useSelector((state: RootState) => state.coins);
  const tempCoins = useSelector((state: RootState) => state.tempWatchlists.tempWatchlist);
  const initialSelectedIds = tempCoins?.map((coin: ICoin) => coin.id) || [];
  const [selectedCoinIds, setSelectedCoinIds] = useState<string[]>(initialSelectedIds);
  const [searchText, setSearchText] = useState('');
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);

  const toggleCoin = (coinId: string) => {
    setSelectedCoinIds((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId],
    );
  };

  const handleDonePress = () => {
    const selectedCoins = allCoins.filter((coin) => selectedCoinIds.includes(coin.id));
    dispatch(setTempWatchlist(selectedCoins));
    router.back();
  };

  useEffect(() => {
    const filtered = allCoins.filter(
      (coin) =>
        !excludedCoinIds.includes(coin.id) &&
        (coin.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
          coin.name.toLowerCase().includes(searchText.toLowerCase())),
    );
    setFilteredCoins(filtered);
  }, [searchText]);

  useEffect(() => {
    if (!allCoins.length && status === 'idle') {
      dispatch(getCoinsMarkets());
    }
  }, [dispatch, allCoins.length, status]);

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (status === 'failed') {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  const renderCoinItem = ({ item }: { item: ICoin }) => {
    const isSelected = selectedCoinIds.includes(item.id);
    return (
      <View style={styles.coinRow}>
        <View style={styles.coinInfo}>
          <Image source={{ uri: item.image }} style={styles.coinImage} />
          <View>
            <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.rowActions}>
          <Pressable onPress={() => toggleCoin(item.id)} style={styles.selectBtn}>
            {isSelected ? (
              <Ionicons name="checkmark-circle" size={scale(30)} color={Colors.primary} />
            ) : (
              <Ionicons name="add-circle-outline" size={scale(30)} color={Colors.primary} />
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Coins</Text>
        <View style={styles.actionRow}>
          <Pressable onPress={() => router.back()} style={styles.actionButton}>
            <Text style={styles.actionText}>Cancel</Text>
          </Pressable>

          <Pressable onPress={handleDonePress} style={styles.actionButton}>
            <Text style={styles.actionText}>Done</Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search coins..."
        placeholderTextColor={Colors.placeholderText}
        onChangeText={setSearchText}
        value={searchText}
      />

      <FlatList data={filteredCoins} keyExtractor={(item) => item.id} renderItem={renderCoinItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: scale(20),
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: Colors.cardBackground,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scale(12),
  },

  actionButton: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(12),
  },

  actionText: {
    fontSize: scale(16),
    color: Colors.primary,
    fontWeight: '600',
  },

  title: {
    fontSize: scale(20),
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },

  searchInput: {
    margin: scale(16),
    padding: scale(12),
    borderWidth: scale(1),
    borderColor: Colors.border,
    borderRadius: scale(8),
    fontSize: scale(16),
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
  },

  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: scale(0.5),
    borderBottomColor: Colors.border,
  },

  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  coinImage: {
    width: scale(32),
    height: scale(32),
    marginRight: scale(12),
    borderRadius: scale(16),
  },

  symbol: {
    fontSize: scale(16),
    fontWeight: '500',
    color: Colors.text,
  },

  name: {
    fontSize: scale(12),
    color: Colors.text,
  },

  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectBtn: {
    marginRight: scale(12),
    padding: scale(8),
  },

  addBtn: {
    padding: scale(8),
  },

  addBtnText: {
    fontSize: scale(16),
    color: Colors.primary,
    fontWeight: '600',
  },
});
