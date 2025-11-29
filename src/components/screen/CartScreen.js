import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Portal, Dialog, Paragraph, Button as PaperButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { database } from '../../services/connectionFirebase';
import { ref, push, set } from "firebase/database";

// CONSTANTES DO JSONBIN
const BIN_ID = '692b63c743b1c97be9cd511e';
const API_KEY = '$2a$10$PnDIWDYWH2ZxH3Er9aEDg.O7WuAvLSo/P8vu5jzbkYUs7PV6N0Hc2';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export default function CartScreen() {
    const { carrinho, incrementarQtd, decrementarQtd, removerItem, totalGeral, limparCarrinho } = useCart();
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de loading para o botão

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleFinalizarCompra = async () => {
        setLoading(true);
        try {
            const pedido = {
                itens: carrinho,
                total: totalGeral,
                data: new Date().toISOString(),
                status: 'pendente'
            };

            const dbRef = ref(database, 'pedidos');
            const novoPedidoRef = push(dbRef);
            await set(novoPedidoRef, pedido);

            // --- 2. Salvar no Jsonbin.io (Novo) ---
            try {
                // a) Buscar dados atuais
                const responseGet = await axios.get(API_URL, {
                    headers: {
                        'X-Master-Key': API_KEY
                    }
                });

                let currentData = responseGet.data.record;
                // Garante que existe o array de pedidos
                let pedidosJson = currentData.pedidos || [];

                // b) Adicionar novo pedido
                const novoPedidoJson = {
                    id: novoPedidoRef.key, // Usa o mesmo ID do Firebase se possível, ou gera um
                    ...pedido
                };
                pedidosJson.push(novoPedidoJson);

                // c) Atualizar o bin (mantendo os produtos e atualizando pedidos)
                await axios.put(API_URL, {
                    ...currentData, // Mantém produtos e outros dados
                    pedidos: pedidosJson
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': API_KEY
                    }
                });
                console.log("Pedido salvo no Jsonbin com sucesso!");

            } catch (jsonError) {
                console.error("Erro ao salvar pedido no Jsonbin:", jsonError);
                // Não vamos alertar o usuário para não assustar, já que foi salvo no Firebase
            }

            hideDialog();
            limparCarrinho(); // Zera o carrinho
            alert('Compra finalizada com sucesso! Pedido salvo.');
            navigation.navigate('Home');
        } catch (error) {
            console.error("Erro ao finalizar compra:", error);
            alert('Erro ao finalizar compra. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.cartItem, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <Image
                source={{ uri: item.imagem || 'https://via.placeholder.com/150' }}
                style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
                <Text style={[styles.itemName, { color: colors.onSurface }]}>{item.nome}</Text>
                <Text style={[styles.itemPriceUnit, { color: colors.onSurfaceVariant }]}>Unit: R$ {item.preco.toFixed(2)}</Text>
                <Text style={[styles.itemTotal, { color: colors.primary }]}>Total: R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
            </View>

            <View style={styles.controls}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => decrementarQtd(item.id)} style={[styles.qtdBtn, { backgroundColor: colors.primary }]}>
                        <Ionicons name="remove" size={16} color={colors.onPrimary} />
                    </TouchableOpacity>

                    <Text style={[styles.qtdText, { color: colors.onSurface }]}>{item.quantidade}</Text>

                    <TouchableOpacity onPress={() => incrementarQtd(item.id)} style={[styles.qtdBtn, { backgroundColor: colors.primary }]}>
                        <Ionicons name="add" size={16} color={colors.onPrimary} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.removeBtn}>
                    <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {carrinho.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={64} color={colors.onSurfaceVariant} />
                    <Text style={[styles.emptyText, { color: colors.onSurfaceVariant }]}>Carrinho Vazio</Text>
                </View>
            ) : (
                <FlatList
                    data={carrinho}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                />
            )}

            {carrinho.length > 0 && (
                <View style={[styles.footer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
                    <View style={styles.totalRow}>
                        <Text style={[styles.totalLabel, { color: colors.onSurface }]}>Total Geral:</Text>
                        <Text style={[styles.totalValue, { color: colors.primary }]}>R$ {totalGeral.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity style={[styles.checkoutButton, { backgroundColor: colors.primary }]} onPress={showDialog}>
                        <Text style={[styles.checkoutButtonText, { color: colors.onPrimary }]}>Finalizar Compra</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: colors.surface }}>
                    <Dialog.Title style={{ color: colors.onSurface }}>Confirmar Compra</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{ color: colors.onSurfaceVariant }}>
                            Deseja finalizar o pedido no valor de R$ {totalGeral.toFixed(2)}?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={hideDialog} textColor={colors.onSurfaceVariant} disabled={loading}>Cancelar</PaperButton>
                        <PaperButton onPress={handleFinalizarCompra} textColor={colors.primary} loading={loading} disabled={loading}>Confirmar</PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, marginTop: 10 },
    cartItem: {
        flexDirection: 'row',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    itemImage: { width: 50, height: 50, borderRadius: 4, backgroundColor: '#eee' },
    itemDetails: { flex: 1, marginLeft: 10 },
    itemName: { fontWeight: 'bold', fontSize: 14 },
    itemPriceUnit: { fontSize: 12 },
    itemTotal: { fontSize: 12, fontWeight: 'bold', marginTop: 2 },
    controls: { alignItems: 'flex-end' },
    quantityControl: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    qtdBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    qtdText: { marginHorizontal: 8, fontSize: 14, fontWeight: 'bold' },
    removeBtn: { padding: 4 },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 22, fontWeight: 'bold' },
    checkoutButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});
