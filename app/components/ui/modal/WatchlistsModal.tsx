import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet, FlatList, Image } from 'react-native';
import { IWatchlistItem, IWatchlistModalProps } from '@/app/types/types';

const WatchlistsModal: React.FC<IWatchlistModalProps> = ({
  visible,
  onClose,
  watchlists,
  selectedWatchlistId,
  onSelectWatchlist,
  onCreateNew,
  onEditPress,
}) => {
  const renderItem = ({ item }: { item: IWatchlistItem }) => {
    const isSelected = item.id === selectedWatchlistId;

    return (
      <Pressable style={styles.itemContainer} onPress={() => onSelectWatchlist(item.id)}>
        {/* Icon/emoji on the left */}
        <Image source={item.icon} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemSubtitle}>{item.coinCount}+ Coins</Text>
        </View>
        {/* Purple checkmark if selected */}
        {isSelected && <Text style={styles.checkmark}>✔</Text>}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Close area outside modal */}

      <View style={styles.modalOverlay}>
        <Pressable style={styles.overlayTouchable} onPress={onClose} />
        {/* The bottom sheet container */}
        <View style={styles.modalContainer}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Watchlists</Text>
            <Pressable onPress={onEditPress}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          {/* Watchlists list */}
          <FlatList
            data={watchlists}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            style={styles.flatList}
          />

          {/* "New Watchlist" button */}
          <Pressable onPress={onCreateNew} style={styles.newWatchlistButton}>
            <Text style={styles.newWatchlistText}>+ New Watchlist</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default WatchlistsModal;

const styles = StyleSheet.create({
  /**
   * Dark overlay behind the sheet
   */
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayTouchable: {
    flex: 1,
  },
  /**
   * Bottom sheet container
   */
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxHeight: '50%', // or adjust to suit your design
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  /**
   * Header
   */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  editText: {
    fontSize: 16,
    color: '#8e44ad',
    fontWeight: '500',
  },
  /**
   * FlatList
   */
  flatList: {
    flexGrow: 0,
    marginBottom: 8,
  },
  /**
   * Each watchlist item row
   */
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    width: 34,
    height: 34,
    marginRight: 12,
    borderRadius: 17,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#777',
  },
  checkmark: {
    fontSize: 18,
    color: '#8e44ad',
    fontWeight: '600',
    marginLeft: 8,
  },
  /**
   * "New Watchlist" button row
   */
  newWatchlistButton: {
    paddingVertical: 10,
  },
  newWatchlistText: {
    fontSize: 16,
    color: '#8e44ad',
    fontWeight: '600',
  },
});
