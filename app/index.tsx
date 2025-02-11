import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { getCoinsMarkets } from './redux/slices/coinsSlice';
import { deleteWatchlist } from './redux/slices/watchlistsSlice';
import WatchlistsModal from './components/ui/modal/WatchlistsModal';
import { ICoin, IWatchlist } from '@/app/types/types';

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const watchlists = useSelector((state: RootState) => state.watchlists.items);
  const { items: allCoins } = useSelector((state: RootState) => state.coins);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState<IWatchlist | null>(null);

  const displayedCoins = useMemo(() => {
    if (!selectedWatchlist) return [];
    const watchlistCoinIds = new Set(selectedWatchlist.coins.map((c) => c.id));
    return allCoins.filter((coin) => watchlistCoinIds.has(coin.id));
  }, [selectedWatchlist, allCoins]);

  const handleSelectWatchlist = (watchlistId: string) => {
    setSelectedWatchlist(watchlists?.find((w) => w.id === watchlistId) || null);
    setModalVisible(false);
  };

  const handleOnCreateNew = () => {
    setModalVisible(false);
    router.push('/new-watchlist-screen');
  };

  const handleEditWatchlist = (watchlistId: string) => {
    setModalVisible(false);
    router.push(`/edit-watchlist-screen?watchlistId=${watchlistId}`);
  };

  const handleDeleteWatchlist = (watchlistId: string) => {
    dispatch(deleteWatchlist(watchlistId));
    setModalVisible(false);

    if (selectedWatchlist?.id === watchlistId) {
      setSelectedWatchlist(watchlists.length > 1 ? watchlists[0] : null);
    }
  };

  useEffect(() => {
    dispatch(getCoinsMarkets());
  }, [dispatch]);

  const renderCoin = ({ item }: { item: ICoin }) => (
    <View style={styles.coinRow}>
      <Text style={styles.coinName}>{item.name}</Text>
      <Text style={styles.coinPrice}>${item.current_price}</Text>
    </View>
  );

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
        selectedWatchlistId={selectedWatchlist?.id}
        onSelectWatchlist={handleSelectWatchlist}
        onCreateNew={handleOnCreateNew}
        onEditWatchlist={handleEditWatchlist}
        onDeleteWatchlist={handleDeleteWatchlist}
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
