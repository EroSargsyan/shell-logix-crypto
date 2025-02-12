import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { getCoinsMarkets } from '../redux/slices/coinsSlice';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getCoinsMarkets());
  }, [dispatch]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new-watchlist-screen" options={{ headerShown: false }} />
      <Stack.Screen name="add-coins-screen" options={{ headerShown: false }} />
      <Stack.Screen name="edit-watchlist-screen" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
