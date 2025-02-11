import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { clearTempWatchlist } from './redux/slices/tempWatchlistsSlice';
import { createWatchlist } from './redux/slices/watchlistsSlice';
import { availableIcons } from './constants/Icons';
import IconSelectionModal from './components/ui/modal/IconSelectionModal';

export default function NewWatchlistScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCoins } = useSelector((state: RootState) => state.tempWatchlists);

  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  const [watchlistName, setWatchlistName] = useState('');
  const [isIconModalVisible, setIconModalVisible] = useState(false);

  const handleNameChange = (value: string) => {
    setWatchlistName(value);
  };

  const handleCreatePress = () => {
    if (!watchlistName.trim()) {
      return;
    }

    dispatch(
      createWatchlist({
        id: Date.now().toString(),
        name: watchlistName,
        icon: selectedIcon,
        coins: selectedCoins,
      }),
    );

    dispatch(clearTempWatchlist());
    router.back();
  };

  const handleCancelPress = () => {
    dispatch(clearTempWatchlist());
    router.back();
  };

  const handleAddCoinsPress = () => {
    router.push('/add-coins-screen');
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName as typeof selectedIcon);
    setIconModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleCancelPress}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New Watchlist</Text>
        <Pressable onPress={handleCreatePress}>
          <Text style={[styles.createText, !watchlistName && { opacity: 0.5 }]}>Create</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Pressable onPress={() => setIconModalVisible(true)} style={styles.avatarContainer}>
          <Ionicons name={selectedIcon} size={60} color="#8e44ad" />
        </Pressable>

        <TextInput
          style={styles.nameInput}
          placeholder="Watchlist Name"
          value={watchlistName}
          onChangeText={handleNameChange}
        />

        {selectedCoins.length > 0 && (
          <FlatList
            style={{ marginTop: 16 }}
            data={selectedCoins}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.coinRow}>
                <Image source={{ uri: item.image }} style={styles.coinImage} />
                <View>
                  <Text style={styles.symbol}>{item.symbol.toUpperCase()}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                </View>
              </View>
            )}
          />
        )}

        <Pressable style={styles.addCoinsBtn} onPress={handleAddCoinsPress}>
          <Text style={styles.addCoinsText}>+ Add Coins</Text>
        </Pressable>
      </View>

      <IconSelectionModal
        visible={isIconModalVisible}
        selectedIcon={selectedIcon}
        onSelectIcon={handleIconSelect}
        onClose={() => setIconModalVisible(false)}
      />
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

  title: { fontSize: 16, fontWeight: '600', color: '#000' },

  createText: { fontSize: 16, color: '#8e44ad' },

  body: { flex: 1, padding: 24, alignItems: 'center' },

  avatarContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 40,
    marginBottom: 16,
  },

  nameInput: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
  },

  addCoinsBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
  },

  addCoinsText: {
    fontSize: 16,
    color: '#8e44ad',
    fontWeight: '500',
  },

  coinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    width: 300,
  },

  coinImage: { width: 32, height: 32, marginRight: 12, borderRadius: 16 },

  symbol: { fontSize: 16, fontWeight: '500' },

  name: { fontSize: 12, color: '#666' },
});
