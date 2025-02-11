import { useEffect, useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView } from 'react-native';
import WatchlistsModal from '../components/ui/modal/WatchlistsModal';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { getCoinsMarkets } from '../redux/slices/coinsSlice';

export default function MainScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleOnCreateNew = () => {
    setModalVisible(false);
    router.push('/new-watchlist-screen');
  };

  useEffect(() => {
    dispatch(getCoinsMarkets());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Button title="Open Watchlists" onPress={() => setModalVisible(true)} />

        <WatchlistsModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          watchlists={[]}
          onSelectWatchlist={() => {}}
          onCreateNew={handleOnCreateNew}
          onEditPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
