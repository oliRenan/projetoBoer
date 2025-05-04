import React, { useState } from 'react';
import Login from './src/components/login';
import Menu from './src/components/menu';
import Toast from 'react-native-toast-message';

export default function App() {
  const [user, setUser] = useState('');
 //  if (!user) {
 //   return <Login changeStatus={(user) => setUser(user)} />
 //  }
 // return <Menu/>
  //
  
  return (
    <>
      {!user ? (
        <Login changeStatus={(user) => setUser(user)} />
      ) : (
          <Menu />
        )}
      {/* Toast deve estar fora das telas para funcionar globalmente */}
      <Toast />
    </>
  );

}
