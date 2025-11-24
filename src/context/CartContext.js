import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext({});

export function CartProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);

  // Adiciona ou incrementa se já existir
  const adicionarAoCarrinho = (produto) => {
    setCarrinho(listaAtual => {
      const itemExistente = listaAtual.find(item => item.id === produto.id);

      if (itemExistente) {
        return listaAtual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...listaAtual, { ...produto, quantidade: 1 }];
    });
  };

  // Aumenta quantidade
  const incrementarQtd = (id) => {
    setCarrinho(listaAtual =>
      listaAtual.map(item =>
        item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
      )
    );
  };

  // Diminui quantidade (mínimo 1)
  const decrementarQtd = (id) => {
    setCarrinho(listaAtual =>
      listaAtual.map(item => {
        if (item.id === id) {
          return { ...item, quantidade: Math.max(1, item.quantidade - 1) };
        }
        return item;
      })
    );
  };

  // Remove item da lista
  const removerItem = (id) => {
    setCarrinho(listaAtual => listaAtual.filter(item => item.id !== id));
  };

  // Zera o carrinho
  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Calcula total
  const totalGeral = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <CartContext.Provider value={{
      carrinho,
      adicionarAoCarrinho,
      incrementarQtd,
      decrementarQtd,
      removerItem,
      limparCarrinho,
      totalGeral
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
