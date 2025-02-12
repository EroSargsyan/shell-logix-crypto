import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IWatchlistItem, IWatchlistsModalProps } from '@/app/types/types';
import { RootState } from '@/app/redux/store';
import Colors from '@/app/constants/Colors';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function WatchlistsModal({
  visible,
  onClose,
  onSelectWatchlist,
  onCreateNew,
  onEditWatchlist,
  onDeleteWatchlist,
}: IWatchlistsModalProps) {
  const watchlists = useSelector((state: RootState) => state.watchlists.items);

  const selectedWatchlistId = useSelector(
    (state: RootState) => state.watchlists.selectedWatchlistId,
  );

  const handleDeletePress = (watchlistId: string) => {
    Alert.alert(
      'Delete Watchlist',
      'Are you sure you want to delete this watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteWatchlist(watchlistId) },
      ],
      { cancelable: true },
    );
  };

  const renderItem = ({ item }: { item: IWatchlistItem }) => {
    const isSelected = item.id === selectedWatchlistId;
    return (
      <View style={styles.itemRow}>
        <Pressable style={styles.itemContainer} onPress={() => onSelectWatchlist(item.id)}>
          <View style={styles.iconWrapper}>
            <Ionicons name={item.icon} size={scale(40)} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
            <Text style={styles.itemSubtitle}>{item.coinCount} Coin(s)</Text>
          </View>
        </Pressable>
        <View style={styles.actionButton}>
          {isSelected && (
            <Ionicons name="checkmark-outline" size={scale(24)} color={Colors.primary} />
          )}
        </View>
        <Pressable style={styles.actionButton} onPress={() => onEditWatchlist(item.id)}>
          <Ionicons name="create-outline" size={scale(24)} color={Colors.primary} />
        </Pressable>
        <Pressable style={styles.actionButton} onPress={() => handleDeletePress(item.id)}>
          <Ionicons name="trash-outline" size={scale(24)} color="red" />
        </Pressable>
      </View>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Watchlists</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.editText}>Done</Text>
            </Pressable>
          </View>
          <FlatList
            data={watchlists}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.flatList}
          />
          <Pressable onPress={onCreateNew} style={styles.newWatchlistButton}>
            <Text style={styles.newWatchlistText}>+ New Watchlist</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  overlayTouchable: {
    flex: 1,
  },

  modalContainer: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingVertical: scale(16),
    paddingHorizontal: scale(20),
    maxHeight: '60%',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(12),
  },

  headerTitle: {
    fontSize: scale(20),
    fontWeight: '600',
    color: Colors.text,
  },

  editText: {
    fontSize: scale(16),
    color: Colors.primary,
    fontWeight: '500',
  },

  flatList: {
    flexGrow: 0,
    marginBottom: scale(8),
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: scale(10),
  },

  iconWrapper: {
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },

  itemTitle: {
    fontSize: scale(15),
    fontWeight: '500',
    color: Colors.text,
  },

  itemSubtitle: {
    fontSize: scale(13),
    color: Colors.text,
    opacity: 0.7,
  },

  actionButton: {
    width: scale(50),
    height: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },

  newWatchlistButton: {
    paddingVertical: scale(10),
    alignItems: 'center',
  },

  newWatchlistText: {
    fontSize: scale(16),
    color: Colors.primary,
    fontWeight: '600',
  },
});
