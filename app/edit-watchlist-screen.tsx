import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { ICoin, IWatchlist } from '@/app/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppDispatch, RootState } from '@/app/redux/store';
import { updateWatchlist } from '@/app/redux/slices/watchlistsSlice';
import { clearTempWatchlist } from '@/app/redux/slices/tempWatchlistsSlice';
import Colors from '@/app/constants/Colors';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

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
  const [isEditOrderMode, setIsEditOrderMode] = useState(false);

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
        <View
          style={[
            styles.coinRow,
            { backgroundColor: isActive ? Colors.background : Colors.cardBackground },
          ]}
        >
          <View style={styles.coinInfo}>
            <Text style={styles.coinSymbol}>{item.data.symbol.toUpperCase()}</Text>

            <Text style={styles.coinName} numberOfLines={1} ellipsizeMode="tail">
              {item.data.name}
            </Text>
          </View>
          <View style={styles.rowActions}>
            <Pressable onPress={() => toggleCoinSelection(item.data.id)} style={styles.selectBtn}>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={scale(30)} color={Colors.primary} />
              ) : (
                <Ionicons name="add-circle-outline" size={scale(30)} color={Colors.primary} />
              )}
            </Pressable>
            {isEditOrderMode && (
              <Pressable onPressIn={drag} style={styles.dragHandle}>
                <Ionicons name="reorder-three-outline" size={scale(30)} color={Colors.primary} />
              </Pressable>
            )}
          </View>
        </View>
      );
    },
    [toggleCoinSelection, isEditOrderMode],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Watchlist</Text>
      </View>
      <View style={styles.actionRow}>
        <Pressable onPress={handleCancelPress} style={styles.actionButton}>
          <Text style={styles.actionText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={() => setIsEditOrderMode((prev) => !prev)} style={styles.actionButton}>
          <Text style={styles.actionText}>{isEditOrderMode ? 'Finish Editing' : 'Edit Order'}</Text>
        </Pressable>
        <Pressable onPress={handleDonePress} style={styles.actionButton}>
          <Text style={styles.actionText}>Done</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        {watchlist && (
          <View style={styles.watchlistIconContainer}>
            <Ionicons name={watchlist.icon as any} size={scale(50)} color={Colors.primary} />
          </View>
        )}
        <TextInput
          style={styles.nameInput}
          placeholder="Watchlist Name"
          multiline
          scrollEnabled
          placeholderTextColor={Colors.text}
          value={name}
          onChangeText={setName}
        />
        <View style={{ flex: 5 }}>
          <DraggableFlatList
            data={localCoins}
            activationDistance={isEditOrderMode ? scale(5) : scale(1000)}
            keyExtractor={(item) => item.data.id}
            renderItem={renderCoinRow}
            onDragEnd={({ data }) => setLocalCoins(data)}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Pressable style={styles.addCoinsBtn} onPress={handleAddCoinsPress}>
            <Text style={styles.addCoinsText}>+ Add Coins</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingVertical: scale(20),
  },
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: Colors.cardBackground,
  },
  title: {
    fontSize: scale(20),
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: scale(16),
    backgroundColor: Colors.cardBackground,
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
  body: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  watchlistIconContainer: {
    alignItems: 'center',
    marginBottom: scale(16),
  },
  nameInput: {
    alignSelf: 'center',
    width: '80%',
    maxHeight: scale(60),
    padding: scale(12),
    marginVertical: scale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: scale(8),
    fontSize: scale(16),
    textAlign: 'center',
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
  },

  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(12),
    marginVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  coinInfo: {
    flex: 1,
  },
  coinSymbol: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Colors.text,
  },
  coinName: {
    fontSize: scale(14),
    color: Colors.text,
    marginTop: scale(4),
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectBtn: {
    marginRight: scale(12),
    padding: scale(8),
  },
  dragHandle: {
    padding: scale(8),
  },
  addCoinsBtn: {
    marginTop: scale(16),
    alignSelf: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(24),
    backgroundColor: Colors.primary,
    borderRadius: scale(8),
  },
  addCoinsText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: Colors.cardBackground,
  },
});
