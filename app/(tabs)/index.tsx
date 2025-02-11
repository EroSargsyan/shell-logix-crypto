import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getCoinsMarkets } from '../redux/slices/coinsSlice';
import WatchlistsModal from '../components/ui/modal/WatchlistsModal';
import { IWatchlistItem, ICoin } from '@/app/types/types';

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const [isModalVisible, setModalVisible] = useState(false);

  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);

  const watchlists = useSelector((state: RootState) => state.watchlists.items) as IWatchlistItem[];

  const { items: allCoins } = useSelector((state: RootState) => state.coins);

  useEffect(() => {
    dispatch(getCoinsMarkets());
  }, [dispatch]);

  // 6) The watchlist user selected
  const selectedWatchlist = useMemo(() => {
    return watchlists.find((w) => w.id === selectedWatchlistId) || null;
  }, [watchlists, selectedWatchlistId]);

  // 7) Merge watchlist's coin IDs with the updated coin data from store
  //    This ensures we show fresh "current_price" etc.
  const displayedCoins = useMemo(() => {
    if (!selectedWatchlist) return [];
    const watchlistCoinIds = selectedWatchlist.coins.map((c) => c.id);
    // Filter `allCoins` for those IDs, or fallback to watchlist coins
    return allCoins.filter((coin) => watchlistCoinIds.includes(coin.id));
  }, [selectedWatchlist, allCoins]);

  const handleSelectWatchlist = (watchlistId: string) => {
    setSelectedWatchlistId(watchlistId);
    setModalVisible(false);
  };

  const handleOnCreateNew = () => {
    setModalVisible(false);
    router.push('/new-watchlist-screen');
  };

  const renderCoin = ({ item }: { item: ICoin }) => {
    return (
      <View style={styles.coinRow}>
        <Text style={styles.coinName}>{item.name}</Text>
        <Text style={styles.coinPrice}>${item.current_price}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Button title="Open Watchlists" onPress={() => setModalVisible(true)} />
      </View>

      {selectedWatchlist ? (
        <View style={styles.listArea}>
          <Text style={styles.listTitle}>{selectedWatchlist.name}</Text>
          <FlatList
            data={displayedCoins}
            keyExtractor={(coin) => coin.id}
            renderItem={renderCoin}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', marginTop: 20 }}>No coin data found.</Text>
            }
          />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text>Select a watchlist to see its coins & prices</Text>
        </View>
      )}

      <WatchlistsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        watchlists={watchlists}
        selectedWatchlistId={selectedWatchlistId || undefined}
        onSelectWatchlist={handleSelectWatchlist}
        onCreateNew={handleOnCreateNew}
        onEditPress={() => {
          // handle watchlist editing
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  topBar: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  listArea: {
    flex: 1,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  coinName: {
    fontSize: 16,
    fontWeight: '500',
  },
  coinPrice: {
    fontSize: 16,
    color: '#8e44ad',
  },
});
