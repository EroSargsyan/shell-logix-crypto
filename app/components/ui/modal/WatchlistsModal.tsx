import { View, Text, Modal, Pressable, StyleSheet, FlatList, Image } from 'react-native';
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
}: IWatchlistsModalProps) {
  const renderItem = ({ item }: { item: IWatchlistItem }) => {
    const isSelected = item.id === selectedWatchlistId;
    return (
      <View style={styles.itemRow}>
        <Pressable style={styles.itemContainer} onPress={() => onSelectWatchlist(item.id)}>
          <Image source={item.icon} style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.coinCount} Coin(s)</Text>
          </View>
          {isSelected && <Text style={styles.checkmark}>✔</Text>}
        </Pressable>
        <Pressable style={styles.editIcon} onPress={() => onEditWatchlist(item.id)}>
          <Ionicons name="create-outline" size={20} color="#8e44ad" />
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  icon: { width: 34, height: 34, marginRight: 12, borderRadius: 17 },
  itemTitle: { fontSize: 15, fontWeight: '500', color: '#000' },
  itemSubtitle: { fontSize: 13, color: '#777' },
  checkmark: { fontSize: 18, color: '#8e44ad', fontWeight: '600', marginLeft: 8 },
  editIcon: { padding: 8 },
  newWatchlistButton: { paddingVertical: 10 },
  newWatchlistText: { fontSize: 16, color: '#8e44ad', fontWeight: '600' },
});
