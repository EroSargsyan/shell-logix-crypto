import { View, Text, Modal, Pressable, StyleSheet, FlatList, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { IWatchlistItem, IWatchlistsModalProps } from '@/app/types/types';

export default function WatchlistsModal({
  visible,
  onClose,
  watchlists,
  selectedWatchlistId,
  onSelectWatchlist,
  onCreateNew,
  onEditWatchlist,
  onDeleteWatchlist,
}: IWatchlistsModalProps) {
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
            <Ionicons name={item.icon} size={34} color="#8e44ad" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.coinCount} Coin(s)</Text>
          </View>

          {isSelected && <Text style={styles.checkmark}>✔</Text>}
        </Pressable>

        <Pressable style={styles.iconButton} onPress={() => onEditWatchlist(item.id)}>
          <Ionicons name="create-outline" size={20} color="#8e44ad" />
        </Pressable>

        <Pressable style={styles.iconButton} onPress={() => handleDeletePress(item.id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
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
  overlayTouchable: { flex: 1 },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  editText: { fontSize: 16, color: '#8e44ad', fontWeight: '500' },
  flatList: { flexGrow: 0, marginBottom: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: { fontSize: 15, fontWeight: '500', color: '#000' },
  itemSubtitle: { fontSize: 13, color: '#777' },
  checkmark: { fontSize: 18, color: '#8e44ad', fontWeight: '600', marginLeft: 8 },
  iconButton: { padding: 8 },
  newWatchlistButton: { paddingVertical: 10 },
  newWatchlistText: { fontSize: 16, color: '#8e44ad', fontWeight: '600' },
});
