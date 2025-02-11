import { WatchlistItem, WatchlistModalProps } from '@/app/types/types';
import { View, Text, Modal, Pressable, StyleSheet, FlatList, Image } from 'react-native';

const WatchlistsModal: React.FC<WatchlistModalProps> = ({
  visible,
  onClose,
  watchlists,
  selectedWatchlistId,
  onSelectWatchlist,
  onCreateNew,
  onEditPress,
}) => {
  const renderItem = ({ item }: { item: WatchlistItem }) => {
    const isSelected = item.id === selectedWatchlistId;
    return (
      <Pressable style={styles.itemContainer} onPress={() => onSelectWatchlist(item.id)}>
        {/* Could also use an emoji or local image */}
        <Image source={item.icon} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.coinCount}+ Coins</Text>
        </View>
        {isSelected && <Text style={styles.checkmark}>✔</Text>}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Watchlists</Text>
            <Pressable onPress={onEditPress}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          {/* Watchlists List */}
          <FlatList
            data={watchlists}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={{ flexGrow: 0 }}
          />

          {/* New Watchlist Button */}
          <Pressable onPress={onCreateNew} style={styles.newWatchlistButton}>
            <Text style={styles.newWatchlistText}>+ New Watchlist</Text>
          </Pressable>
        </View>

        {/* Close area outside modal */}
        <Pressable style={styles.overlayTouchable} onPress={onClose} />
      </View>
    </Modal>
  );
};

export default WatchlistsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  editText: {
    fontSize: 16,
    color: '#8e44ad', // your accent color
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 12,
    borderRadius: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  checkmark: {
    fontSize: 18,
    color: '#8e44ad',
    fontWeight: 'bold',
  },
  newWatchlistButton: {
    paddingVertical: 12,
  },
  newWatchlistText: {
    fontSize: 16,
    color: '#8e44ad',
    fontWeight: '500',
  },
});
