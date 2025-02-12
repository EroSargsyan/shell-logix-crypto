import { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Share, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ICoin } from '@/app/types/types';
import Colors from './constants/Colors';
import { AppDispatch, RootState } from './redux/store';
import {
  clearSelectedWatchlistId,
  deleteWatchlist,
  setSelectedWatchlistId,
} from './redux/slices/watchlistsSlice';
import WatchlistsModal from './components/ui/modal/WatchlistsModal';

export default function MainScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const watchlists = useSelector((state: RootState) => state.watchlists.items);
  const { items: allCoins } = useSelector((state: RootState) => state.coins);
  const selectedWatchlistId = useSelector(
    (state: RootState) => state.watchlists.selectedWatchlistId,
  );

  const [isModalVisible, setModalVisible] = useState(false);
  const [displayedCoins, setDisplayedCoins] = useState<ICoin[]>([]);

  const selectedWatchlist = useMemo(() => {
    return watchlists.find((w) => w.id === selectedWatchlistId) || null;
  }, [watchlists, selectedWatchlistId]);

  useEffect(() => {
    if (!selectedWatchlist || !allCoins) {
      return;
    }

    const displayedCoins = selectedWatchlist.coins
      .map((coinInWatchlist) => allCoins.find((coin) => coin.id === coinInWatchlist.id))
      .filter((coin): coin is ICoin => Boolean(coin));

    setDisplayedCoins(displayedCoins);
  }, [selectedWatchlist, allCoins]);

  const handleSelectWatchlist = (watchlistId: string) => {
    dispatch(setSelectedWatchlistId(watchlistId));
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
      const remaining = watchlists.filter((w) => w.id !== watchlistId);
      if (remaining.length) {
        dispatch(setSelectedWatchlistId(remaining[0].id));
      } else {
        dispatch(clearSelectedWatchlistId());
      }
    }
  };

  const handleShareWatchlist = async () => {
    if (!selectedWatchlist) return;
    try {
      const coinList = displayedCoins.map((coin) => coin.name).join(', ');
      const message = `Watchlist: ${selectedWatchlist.name}\nCoins: ${coinList}`;
      await Share.share({ message });
    } catch (error) {
      console.log('Error sharing watchlist:', error);
    }
  };

  const renderCoin = ({ item }: { item: ICoin }) => (
    <View style={styles.coinRow}>
      <Text style={styles.coinName}>{item.name}</Text>
      <Text style={styles.coinPrice}>${item.current_price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Crypto Watchlist</Text>
        <Pressable style={styles.watchlistButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="list" size={24} color={Colors.cardBackground} />
        </Pressable>
      </View>

      {selectedWatchlist ? (
        <View style={styles.content}>
          <View style={styles.watchlistHeader}>
            <View style={styles.watchlistIconContainer}>
              <Ionicons name={selectedWatchlist.icon as any} size={40} color={Colors.primary} />
            </View>
            <View style={styles.watchlistTitleContainer}>
              <Text style={styles.watchlistTitle} numberOfLines={1}>
                {selectedWatchlist.name}
              </Text>
            </View>
            <Pressable style={styles.shareButton} onPress={handleShareWatchlist}>
              <Ionicons name="share-social-outline" size={24} color={Colors.cardBackground} />
            </Pressable>
          </View>

          <FlatList
            data={displayedCoins}
            keyExtractor={(coin) => coin.id}
            renderItem={renderCoin}
            ListEmptyComponent={<Text style={styles.emptyText}>No coin data found.</Text>}
          />
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Select a watchlist to see its coins & prices</Text>
        </View>
      )}

      <WatchlistsModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSelectWatchlist={handleSelectWatchlist}
        onCreateNew={handleOnCreateNew}
        onEditWatchlist={handleEditWatchlist}
        onDeleteWatchlist={handleDeleteWatchlist}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '10%',
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  watchlistButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  watchlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  watchlistIconContainer: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchlistTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  watchlistTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  shareButton: {
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 8,
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coinName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  coinPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.text,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.text,
    fontSize: 16,
  },
});
