import { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { ICoin, IWatchlist } from '@/app/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppDispatch, RootState } from '@/app/redux/store';
import { updateWatchlist } from '@/app/redux/slices/watchlistsSlice';
import { clearTempWatchlist } from '@/app/redux/slices/tempWatchlistsSlice';

interface LocalCoin {
  data: ICoin;
  selected: boolean;
  order: number;
}

export default function EditWatchlistScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams();
  const watchlistId = params?.watchlistId as string | undefined;

  const watchlist = useSelector((state: RootState) =>
    state.watchlists.items.find((w) => w.id === watchlistId),
  ) as IWatchlist | undefined;

  const [name, setName] = useState('');
  const [localCoins, setLocalCoins] = useState<LocalCoin[]>([]);

  useEffect(() => {
    if (watchlist) {
      setName(watchlist.name);
      setLocalCoins(
        watchlist.coins.map((c, i) => ({
          data: { ...c },
          selected: true,
          order: i,
        })),
      );
    }
  }, [watchlist]);

  const toggleCoinSelection = useCallback((coinId: string) => {
    setLocalCoins((prev) =>
      prev.map((item) => (item.data.id === coinId ? { ...item, selected: !item.selected } : item)),
    );
  }, []);

  const tempSelectedCoins = useSelector((state: RootState) => state.tempWatchlists.tempWatchlist);

  useFocusEffect(
    useCallback(() => {
      if (tempSelectedCoins?.length) {
        setLocalCoins((prev) => {
          const existingIds = prev.map((item) => item.data.id);
          const newCoins = tempSelectedCoins.filter((coin) => !existingIds.includes(coin.id));
          const nextOrder = prev.length;
          const newLocalCoins = newCoins.map((coin, index) => ({
            data: coin,
            selected: true,
            order: nextOrder + index,
          }));
          return [...prev, ...newLocalCoins];
        });

        dispatch(clearTempWatchlist());
      }
    }, [tempSelectedCoins, dispatch]),
  );

  const handleDonePress = () => {
    if (!name.trim() || !watchlist) {
      return;
    }
    const finalCoins = localCoins.filter((item) => item.selected).map((item) => item.data);

    dispatch(
      updateWatchlist({
        watchlistId: watchlist.id,
        newName: name,
        newCoins: finalCoins,
      }),
    );
    router.back();
  };

  const handleCancelPress = () => {
    router.back();
  };

  const handleAddCoinsPress = () => {
    const existingCoinIds = localCoins.map((item) => item.data.id);
    router.push(`/add-coins-screen?existingCoinIds=${existingCoinIds.join(',')}`);
  };

  const renderCoinRow = useCallback(
    ({ item, drag, isActive }: RenderItemParams<LocalCoin>) => {
      const isSelected = item.selected;
      return (
        <Pressable
          onPress={drag}
          disabled={isActive}
          style={[styles.coinRow, { backgroundColor: isActive ? '#f0f0f0' : '#fff' }]}
        >
          <View>
            <Text style={styles.coinSymbol}>{item.data.symbol.toUpperCase()}</Text>
            <Text style={styles.coinName}>{item.data.name}</Text>
          </View>
          <View style={styles.rowActions}>
            <Pressable onPress={() => toggleCoinSelection(item.data.id)} style={styles.selectBtn}>
              <Text style={{ color: isSelected ? '#888' : '#8e44ad' }}>
                {isSelected ? '✔' : '+'}
              </Text>
            </Pressable>
            <Pressable onLongPress={drag} style={styles.dragHandle}>
              <Ionicons name="reorder-three-outline" size={24} color="#8e44ad" />
            </Pressable>
          </View>
        </Pressable>
      );
    },
    [toggleCoinSelection],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleCancelPress}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Edit Watchlist</Text>
        <Pressable onPress={handleDonePress}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        {watchlist && (
          <View style={styles.watchlistIconContainer}>
            <Ionicons name={watchlist.icon as any} size={50} color="#8e44ad" />
          </View>
        )}

        <TextInput
          style={styles.nameInput}
          placeholder="Watchlist Name"
          value={name}
          onChangeText={setName}
        />

        <DraggableFlatList
          data={localCoins}
          keyExtractor={(item) => item.data.id}
          renderItem={renderCoinRow}
          onDragEnd={({ data }) => setLocalCoins(data)}
        />

        <Pressable style={styles.addCoinsBtn} onPress={handleAddCoinsPress}>
          <Text style={styles.addCoinsText}>+ Add Coins</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cancelText: { fontSize: 16, color: '#8e44ad' },

  title: { fontSize: 16, fontWeight: '600' },

  doneText: { fontSize: 16, color: '#8e44ad' },

  body: { flex: 1, padding: 16 },

  watchlistIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  nameInput: {
    alignSelf: 'center',
    width: '80%',
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
  },

  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },

  coinSymbol: { fontSize: 16, fontWeight: '600' },

  coinName: { fontSize: 13, color: '#666' },

  rowActions: { flexDirection: 'row', alignItems: 'center' },

  selectBtn: { marginRight: 12 },

  moveArrows: { flexDirection: 'column', justifyContent: 'center' },

  addCoinsBtn: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },

  addCoinsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8e44ad',
  },

  dragHandle: {
    padding: 8,
  },
});
