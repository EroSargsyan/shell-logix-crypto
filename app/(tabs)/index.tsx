import { useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView } from 'react-native';
import WatchlistsModal from '../components/ui/WatchlistsModal';
import { router } from 'expo-router';

export default function MainScreen() {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleOnCreateNew = () => {
    setModalVisible(false);
    router.push('/new-watchlist-screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Button title="Open Watchlists" onPress={() => setModalVisible(true)} />

        {/* Bottom Sheet / Modal */}
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
