
import  { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { Coin } from './types/types'
import { router } from 'expo-router'




const COINS: Coin[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP' },
  { id: 'bch', symbol: 'BCH', name: 'Bitcoin Cash' },

]

export default function AddCoinsScreen() {
  const [searchText, setSearchText] = useState('')
  const [selectedCoins, setSelectedCoins] = useState<string[]>([])

  const filteredCoins = COINS.filter(
    coin =>
      coin.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
      coin.name.toLowerCase().includes(searchText.toLowerCase())
  )

  const toggleCoin = (coinId: string) => {
    setSelectedCoins(prev =>
      prev.includes(coinId) ? prev.filter(id => id !== coinId) : [...prev, coinId]
    )
  }

  const handleDonePress = () => {
    // e.g. dispatch(addCoinsToWatchlist(selectedCoins)) 
    // or pass them back to the previous screen
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Add Coins</Text>
        <Pressable onPress={handleDonePress}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={setSearchText}
        value={searchText}
      />

      {/* Coins List */}
      <FlatList
        data={filteredCoins}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedCoins.includes(item.id)
          return (
            <View style={styles.coinRow}>
              <View style={styles.coinInfo}>
                <Text style={styles.symbol}>{item.symbol}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <Pressable
                style={styles.addBtn}
                onPress={() => toggleCoin(item.id)}
              >
                <Text style={{ color: isSelected ? '#888' : '#8e44ad' }}>
                  {isSelected ? '✔' : '+'}
                </Text>
              </Pressable>
            </View>
          )
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneText: {
    fontSize: 16,
    color: '#8e44ad',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  coinInfo: {
    flexDirection: 'column',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '500',
  },
  name: {
    fontSize: 12,
    color: '#666',
  },
  addBtn: {
    padding: 8,
  },
})
