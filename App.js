import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';
import Toast from 'react-native-toast-message';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Personalize as cores aqui, se quiser
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
  },
};

export default function App() {
  const [user, setUser] = useState('');
 //  if (!user) {
 //   return <Login changeStatus={(user) => setUser(user)} />
 //  }
 // return <Menu/>
  //
  
  // return (
  //   <>
  //     {!user ? (
  //       <Login changeStatus={(user) => setUser(user)} />
  //     ) : (
  //         <Menu />
  //     )}
  //     <Toast />
  //   </>
  // );

 return (
    <PaperProvider theme={lightTheme}>
      <Menu></Menu>
      <Toast />
    </PaperProvider>
  );


}
