import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';
import Toast from 'react-native-toast-message';
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  adaptNavigationTheme
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CartProvider } from './src/context/CartContext';

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#673ab7',
    accent: '#00BCD4',
    background: '#121212',
    surface: '#1E1E1E',
  },
};

export default function App() {
  const [user, setUser] = useState('');

  return (
    <PaperProvider theme={darkTheme}>
      <CartProvider>
        <>
          {!user ? (
            <Login changeStatus={(user) => setUser(user)} />
          ) : (
            <Menu setUser={setUser} theme={darkTheme} />
          )}
          <Toast />
        </>
      </CartProvider>
    </PaperProvider>
  );
}
