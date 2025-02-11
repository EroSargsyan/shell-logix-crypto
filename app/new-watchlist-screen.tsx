import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, SafeAreaView } from 'react-native';
// import { useDispatch } from 'react-redux'
// import { createWatchlist } from '../redux/slices/watchlistSlice'
// etc.

export default function NewWatchlistScreen() {
  const [watchlistName, setWatchlistName] = useState('');
  // const dispatch = useDispatch()

  const handleCreatePress = () => {
    if (!watchlistName.trim()) return;
    // dispatch(createWatchlist({ name: watchlistName, icon: '🦄', coins: [] }))
    // navigation.goBack()
  };

  const handleAddCoinsPress = () => {
    router.push('/add-coins-screen');
  };

  const handleCancelPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleCancelPress}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New Watchlist</Text>
        <Pressable onPress={handleCreatePress}>
          <Text style={[styles.createText, !watchlistName && { opacity: 0.5 }]}>Create</Text>
        </Pressable>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Icon / Emoji */}
        <Text style={styles.emoji}>🦄</Text>

        {/* Watchlist Name Input */}
        <TextInput
          style={styles.nameInput}
          placeholder="Watchlist Name"
          value={watchlistName}
          onChangeText={setWatchlistName}
        />

        {/* Add Coins Button */}
        <Pressable style={styles.addCoinsBtn} onPress={handleAddCoinsPress}>
          <Text style={styles.addCoinsText}>+ Add Coins</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
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
    color: '#000',
  },
  createText: {
    fontSize: 16,
    color: '#8e44ad',
  },
  body: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
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
    textAlign: 'center',
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
});
