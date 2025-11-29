import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { useTheme } from 'react-native-paper';

import { database } from '../../services/connectionFirebase';
import { ref, onValue } from "firebase/database";

export default function ShopScreen() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { adicionarAoCarrinho, carrinho } = useCart();
    const { colors } = useTheme();

    // COLOQUE AQUI A URL DO SEU BIN PÚBLICO
    const API_URL = 'https://api.jsonbin.io/v3/b/6921fdf143b1c97be9be5a76';

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        setLoading(true);
        try {
            // 1. Buscar do JSONBin
            const responseJson = await axios.get(API_URL);
            const produtosJson = responseJson.data.record ? responseJson.data.record.produtos : responseJson.data.produtos;

            // 2. Buscar do Firebase
            const dbRef = ref(database, 'tenis');
            onValue(dbRef, (snapshot) => {
                const data = snapshot.val();
                let produtosFirebase = [];
                
                if (data) {
                    produtosFirebase = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                        imagem: data[key].imageUrl || 'https://via.placeholder.com/150' // Mapear imageUrl para imagem
                    }));
                }

                // 3. Mesclar as duas listas
                // Dica: Se quiser que os do Firebase apareçam primeiro, coloque antes no array
                const listaCompleta = [...produtosFirebase, ...produtosJson];
                
                setProdutos(listaCompleta);
                setLoading(false);
            }, (error) => {
                console.error("Erro ao buscar do Firebase:", error);
                // Mesmo com erro no Firebase, mostra o que veio do JSONBin
                setProdutos(produtosJson);
                setLoading(false);
            });

        } catch (error) {
            console.error("Erro ao buscar produtos (JSONBin):", error);
            // Se der erro no JSONBin, tenta mostrar só o Firebase (precisaria de lógica separada, 
            // mas aqui vamos só parar o loading para não travar a tela)
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.productCard, { backgroundColor: colors.surface }]}>
            <Image
                source={{ uri: item.imagem || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.onSurface }]}>{item.nome}</Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>R$ {item.preco.toFixed(2)}</Text>

                <TouchableOpacity
                    style={[styles.addToCartButton, { backgroundColor: colors.primary }]}
                    onPress={() => {
                        adicionarAoCarrinho(item);
                    }}
                >
                    <Text style={[styles.addToCartButtonText, { color: colors.onPrimary }]}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />

            <TouchableOpacity
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('Carrinho')}
            >
                <Ionicons name="cart" size={24} color={colors.onPrimary} />
                {carrinho.length > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.error }]}>
                        <Text style={[styles.badgeText, { color: colors.onError }]}>{carrinho.length}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    productCard: {
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
        backgroundColor: '#eee',
    },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: 'bold' },
    productPrice: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
    addToCartButton: {
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 4
    },
    addToCartButtonText: { fontWeight: 'bold', fontSize: 12 },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { fontSize: 10, fontWeight: 'bold' }
});
