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
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './redux/store';
import { clearTempWatchlist } from './redux/slices/tempWatchlistsSlice';
import { createWatchlist } from './redux/slices/watchlistsSlice';
import { availableIcons } from './constants/Icons';
import IconSelectionModal from './components/ui/modal/IconSelectionModal';
import Colors from './constants/Colors';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const scale = (size: number) => (width / guidelineBaseWidth) * size;

export default function NewWatchlistScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { tempWatchlist } = useSelector((state: RootState) => state.tempWatchlists);

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
        coins: tempWatchlist,
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

  const renderListItem = ({ item }: { item: any }) => (
    <View style={styles.coinRow}>
      <View style={styles.coinInfo}>
        <Image source={{ uri: item.image }} style={styles.coinImage} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
          <Text style={styles.coinName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Watchlist</Text>
      </View>
      <View style={styles.actionRow}>
        <Pressable onPress={handleCancelPress} style={styles.actionButton}>
          <Text style={styles.actionText}>Cancel</Text>
        </Pressable>

        <Pressable onPress={handleCreatePress} style={styles.actionButton}>
          <Text style={styles.actionText}>Create</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Pressable onPress={() => setIconModalVisible(true)} style={styles.avatarContainer}>
          <Ionicons name={selectedIcon} size={scale(60)} color={Colors.primary} />
        </Pressable>
        <TextInput
          style={styles.nameInput}
          placeholder="Watchlist Name"
          placeholderTextColor={Colors.text}
          value={watchlistName}
          onChangeText={handleNameChange}
          multiline
          scrollEnabled
        />

        <View style={styles.flatListContainer}>
          <FlatList
            data={tempWatchlist}
            keyExtractor={(item) => item.id}
            renderItem={renderListItem}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Pressable style={styles.addCoinsBtn} onPress={handleAddCoinsPress}>
            <Text style={styles.addCoinsText}>+ Add Coins</Text>
          </Pressable>
        </View>
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
    fontSize: scale(18),
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },

  body: {
    flex: 1,
    paddingHorizontal: scale(16),
    alignItems: 'center',
    paddingBottom: scale(16),
  },

  avatarRow: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  avatarContainer: {
    width: scale(70),
    height: scale(70),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(30),
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

  nameInput: {
    width: '80%',
    maxHeight: scale(60),
    padding: scale(12),
    marginVertical: scale(12),
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: Colors.border,
    borderRadius: scale(8),
    fontSize: scale(16),
    textAlign: 'center',
    color: Colors.text,
    backgroundColor: Colors.cardBackground,
  },

  flatListContainer: {
    flex: 5,
    marginTop: scale(16),
    width: '100%',
  },

  coinRow: {
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
    flexDirection: 'row',
    alignItems: 'center',
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

  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectBtn: {
    marginRight: scale(12),
    padding: scale(8),
  },

  coinImage: {
    width: scale(24),
    height: scale(24),
    marginRight: scale(8),
    borderRadius: scale(12),
  },
});
