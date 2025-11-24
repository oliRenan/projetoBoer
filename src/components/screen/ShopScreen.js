import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

export default function ShopScreen() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { adicionarAoCarrinho, carrinho } = useCart();

    // COLOQUE AQUI A URL DO SEU BIN PÚBLICO
    const API_URL = 'https://api.jsonbin.io/v3/b/6921fdf143b1c97be9be5a76';

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await axios.get(API_URL);
            // Ajuste conforme a estrutura do seu JSON (se for v3, geralmente é data.record.produtos)
            setProdutos(response.data.record ? response.data.record.produtos : response.data.produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            // alert("Erro ao carregar produtos. Verifique a URL.");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image
                source={{ uri: item.imagem || 'https://via.placeholder.com/150' }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nome}</Text>
                <Text style={styles.productPrice}>R$ {item.preco.toFixed(2)}</Text>

                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => {
                        adicionarAoCarrinho(item);
                        // Feedback visual rápido (opcional)
                    }}
                >
                    <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color="#D00000" /></View>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Carrinho')}
            >
                <Ionicons name="cart" size={24} color="#fff" />
                {carrinho.length > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{carrinho.length}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    productCard: {
        backgroundColor: '#fff',
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
    productName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    productPrice: { fontSize: 14, color: '#D00000', fontWeight: '600', marginVertical: 4 },
    addToCartButton: {
        backgroundColor: '#D00000',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 4
    },
    addToCartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#D00000',
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
        backgroundColor: '#333',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});
