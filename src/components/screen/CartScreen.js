import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useCart } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Portal, Dialog, Paragraph, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function CartScreen() {
    const { carrinho, incrementarQtd, decrementarQtd, removerItem, totalGeral, limparCarrinho } = useCart();
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleFinalizarCompra = () => {
        hideDialog();
        limparCarrinho(); // Zera o carrinho
        alert('Compra finalizada com sucesso!');
        navigation.navigate('Home');
    };

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.imagem || 'https://via.placeholder.com/150' }}
                style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={styles.itemPriceUnit}>Unit: R$ {item.preco.toFixed(2)}</Text>
                <Text style={styles.itemTotal}>Total: R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
            </View>

            <View style={styles.controls}>
                <View style={styles.quantityControl}>
                    <TouchableOpacity onPress={() => decrementarQtd(item.id)} style={styles.qtdBtn}>
                        <Ionicons name="remove" size={16} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.qtdText}>{item.quantidade}</Text>

                    <TouchableOpacity onPress={() => incrementarQtd(item.id)} style={styles.qtdBtn}>
                        <Ionicons name="add" size={16} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removerItem(item.id)} style={styles.removeBtn}>
                    <Ionicons name="trash" size={20} color="#D00000" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {carrinho.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Carrinho Vazio</Text>
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
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Geral:</Text>
                        <Text style={styles.totalValue}>R$ {totalGeral.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity style={styles.checkoutButton} onPress={showDialog}>
                        <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: 'white' }}>
                    <Dialog.Title style={{ color: '#333' }}>Confirmar Compra</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={{ color: '#666' }}>
                            Deseja finalizar o pedido no valor de R$ {totalGeral.toFixed(2)}?
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <PaperButton onPress={hideDialog} textColor="#666">Cancelar</PaperButton>
                        <PaperButton onPress={handleFinalizarCompra} textColor="#D00000">Confirmar</PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#999', marginTop: 10 },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee'
    },
    itemImage: { width: 50, height: 50, borderRadius: 4, backgroundColor: '#eee' },
    itemDetails: { flex: 1, marginLeft: 10 },
    itemName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
    itemPriceUnit: { fontSize: 12, color: '#666' },
    itemTotal: { fontSize: 12, fontWeight: 'bold', color: '#D00000', marginTop: 2 },
    controls: { alignItems: 'flex-end' },
    quantityControl: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    qtdBtn: {
        backgroundColor: '#D00000',
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
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#D00000' },
    checkoutButton: {
        backgroundColor: '#D00000',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
