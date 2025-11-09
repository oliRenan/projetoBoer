import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';
import Toast from 'react-native-toast-message';
// 1. Importe o MD3DarkTheme e o useTheme
import { 
  Provider as PaperProvider, 
  MD3DarkTheme,
  adaptNavigationTheme 
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 2. Defina seu novo tema escuro
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#673ab7', // Um roxo forte
    accent: '#00BCD4',   // Um ciano/azul claro
    background: '#121212', // Fundo escuro padrão
    surface: '#1E1E1E',   // Cor dos "Cards"
  },
};

// (O App.js vai precisar lidar com o NavigationContainer também
// se quisermos que o tema do Paper se aplique à barra de navegação)

export default function App() {
  const [user, setUser] = useState('');

  return (
    // 3. Aplique o 'darkTheme' ao PaperProvider
    <PaperProvider theme={darkTheme}>
      <>
        {!user ? (
          <Login changeStatus={(user) => setUser(user)} />
        ) : (
          // 4. Passe o tema para o Menu
          <Menu setUser={setUser} theme={darkTheme} />
        )}
        <Toast />
      </>
    </PaperProvider>
  );
}
