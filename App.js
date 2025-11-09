import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';
import Toast from 'react-native-toast-message';
import { 
  Provider as PaperProvider, 
  MD3LightTheme, 
} from 'react-native-paper';

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#D32F2F',     
    accent: '#B22222',      
    background: '#FFFFFF',  
    surface: '#F9F9F9',     
    text: '#212121',        
    onSurface: '#212121',   
    onSurfaceVariant: '#555555', 
    outline: '#BDBDBD',     
    error: '#D32F2F',       
    onPrimary: '#FFFFFF',   
  },
};

export default function App() {
  const [user, setUser] = useState('');

  return (
    <PaperProvider theme={lightTheme}>
      <>
        {!user ? (
          <Login changeStatus={(user) => setUser(user)} />
        ) : (
          <Menu setUser={setUser} theme={lightTheme} />
        )}
        <Toast />
      </>
    </PaperProvider>
  );
}
