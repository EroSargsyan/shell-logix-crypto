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
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/redux/store';
import { getCoinsMarkets } from '@/app/redux/slices/coinsSlice';
import { setTempWatchlist } from '@/app/redux/slices/tempWatchlistsSlice';
import { ICoin } from '@/app/types/types';

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
    dispatch(getCoinsMarkets());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8e44ad" />
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
        <Pressable style={styles.addBtn} onPress={() => toggleCoin(item.id)}>
          <Text style={{ color: isSelected ? '#888' : '#8e44ad' }}>{isSelected ? '✔' : '+'}</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Add Coins</Text>
        <Pressable onPress={handleDonePress}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search coins..."
        onChangeText={setSearchText}
        value={searchText}
      />

      <FlatList data={filteredCoins} keyExtractor={(item) => item.id} renderItem={renderCoinItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#666' },
  title: { fontSize: 16, fontWeight: '600' },
  doneText: { fontSize: 16, color: '#8e44ad' },
  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  coinInfo: { flexDirection: 'row', alignItems: 'center' },
  coinImage: { width: 32, height: 32, marginRight: 12, borderRadius: 16 },
  symbol: { fontSize: 16, fontWeight: '500' },
  name: { fontSize: 12, color: '#666' },
  addBtn: { padding: 8 },
});
