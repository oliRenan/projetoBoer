import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import {
    TextInput,
    Button,
    Title,
    Card, // Vamos usar Card para listar
    useTheme,
    ActivityIndicator,
    Text,
    IconButton,
    Portal,
    Dialog
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

// Importar o Realtime Database
import { database } from '../../services/connectionFirebase';
import { ref, push, set, onValue, update, remove, query, orderByChild } from "firebase/database";

// --- Componente do Formulário ---
const CadastroForm = ({
    nome,
    setNome,
    descricao,
    setDescricao,
    preco,
    setPreco,
    imageUrl,
    setImageUrl,
    handleSalvar,
    loading,
    itemEmEdicao,
    onLimparSelecao
}) => {
    const { colors } = useTheme();
    const isEditing = !!itemEmEdicao;

    // Função para lidar com a entrada de preço
    const handlePrecoChange = (text) => {
        let valorLimpo = text.replace(/[^0-9.,]/g, ''); // Apenas números, ponto ou vírgula
        valorLimpo = valorLimpo.replace(',', '.');
        if (valorLimpo.split('.').length > 2) return;
        if (isNaN(Number(valorLimpo)) && valorLimpo !== '') return;
        setPreco(valorLimpo);
    };

    return (
        <View style={styles.formContainer}>
            <Title style={styles.title}>
                {isEditing ? `Editando: ${itemEmEdicao.nome}` : 'Cadastrar Nova Fruta'}
            </Title>
            <TextInput
                label="Nome da Fruta"
                value={nome}
                onChangeText={setNome}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
            />

            <TextInput
                label="URL da Imagem (Opcional)"
                value={imageUrl}
                onChangeText={setImageUrl}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
                keyboardType="url"
                autoCapitalize="none"
            />
            
            <TextInput
                label="Preço"
                value={preco}
                onChangeText={handlePrecoChange}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
                keyboardType="numeric"
                left={<TextInput.Affix text="R$ " />}
                placeholder="0.00"
            />

            <TextInput
                label="Descrição (ex: Tipo, Safra, etc.)"
                value={descricao}
                onChangeText={setDescricao}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                outlineColor={colors.outline}
                multiline
                numberOfLines={3}
            />
            <Button
                mode="contained"
                onPress={handleSalvar}
                loading={loading}
                disabled={loading}
                icon={isEditing ? "pencil" : "plus-circle"}
                style={[styles.button, { backgroundColor: isEditing ? colors.accent : colors.primary }]}
                textColor={colors.onPrimary}
            >
                {isEditing ? 'Atualizar Fruta' : 'Salvar Fruta'}
            </Button>

            {isEditing && (
                <Button
                    mode="text"
                    onPress={onLimparSelecao}
                    disabled={loading}
                    style={styles.buttonCancel}
                    textColor={colors.primary}
                >
                    Cancelar Edição
                </Button>
            )}

            <Title style={styles.titleList}>Frutas Cadastradas</Title>
        </View>
    );
}


// --- Componente do Item da Lista (Card) ---
const ItemDaLista = React.memo(({ item, onEditar, onExcluir }) => {
    const { colors } = useTheme();

    const formatarData = (timestamp) => {
        if (!timestamp) return 'Data indisponível';
        try {
            return `Cadastrado em: ${new Date(timestamp).toLocaleDateString('pt-BR')}`;
        } catch (e) {
            return 'Data inválida';
        }
    };

    const precoFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(item.preco || 0);

    return (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            
            {item.imageUrl ? (
                <Card.Cover source={{ uri: item.imageUrl }} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    {/* Ícone de Maçã */}
                    <IconButton icon="food-apple" size={40} iconColor={colors.primary} />
                    <Text variant="bodySmall">Sem imagem</Text>
                </View>
            )}
            
            <Card.Title
                title={item.nome}
                titleStyle={[styles.itemTitle, { color: colors.primary }]}
                subtitle={precoFormatado}
                subtitleStyle={{ color: colors.onSurface, fontSize: 16 }}
            />
            <Card.Content>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>{item.descricao}</Text>
                <Text variant="bodySmall" style={{ fontStyle: 'italic', color: colors.onSurfaceVariant }}>
                    {formatarData(item.criadoEm)}
                </Text>
            </Card.Content>
            
            <Card.Actions>
                <Button 
                    icon="pencil" 
                    textColor={colors.primary}
                    onPress={onEditar}
                >
                    Editar
                </Button>
                <Button 
                    icon="delete" 
                    textColor={colors.error}
                    onPress={onExcluir}
                >
                    Excluir
                </Button>
            </Card.Actions>
        </Card>
    );
});


// --- Componente Principal (Tela) ---
export default function CadastroScreen() {
    const { colors } = useTheme();
    const flatListRef = useRef(null);

    // --- Estados do formulário ---
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState(''); 
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [itemEmEdicao, setItemEmEdicao] = useState(null);

    // Estados da lista
    const [listaItens, setListaItens] = useState([]);
    const [loadingLista, setLoadingLista] = useState(true);

    // Estados do Diálogo
    const [dialogVisible, setDialogVisible] = useState(false);
    const [itemParaExcluir, setItemParaExcluir] = useState(null);

    useEffect(() => {
        setLoadingLista(true);
        // Nó do Firebase será 'frutas'
        const dbRef = ref(database, 'frutas');
        // Ordenar por data de criação para a lista
        const q = query(dbRef, orderByChild('criadoEm')); 

        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itensArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setListaItens(itensArray.reverse()); // .reverse() para novos primeiro
            } else {
                setListaItens([]);
            }
            setLoadingLista(false);
        }, (error) => {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível carregar a lista de frutas." });
            setLoadingLista(false);
        });

        return () => unsubscribe();
    }, []);

    const limparCampos = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImageUrl('');
        setItemEmEdicao(null);
        Keyboard.dismiss();
    };

    const handleSalvar = async () => {
        
        if (!nome?.trim() || !descricao?.trim()) {
            Toast.show({ type: 'error', text1: "Atenção", text2: "Preencha o Nome e a Descrição." });
            return;
        }

        const precoNumero = parseFloat(preco.replace(',', '.'));
        
        if (isNaN(precoNumero) || precoNumero <= 0) {
            Toast.show({ type: 'error', text1: "Atenção", text2: "O preço deve ser um valor maior que R$ 0,00." });
            return;
        }

        const urlLimpa = imageUrl?.trim() || '';
        if (urlLimpa && !urlLimpa.startsWith('http')) {
            Toast.show({ type: 'error', text1: "URL Inválida", text2: "A URL da imagem deve começar com http ou https." });
            return;
        }
        
        setLoading(true);
        const dadosFruta = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: precoNumero,
            imageUrl: urlLimpa
        };

        try {
            if (itemEmEdicao) {
                const itemRef = ref(database, 'frutas/' + itemEmEdicao.id);
                await update(itemRef, dadosFruta);
                Toast.show({ type: 'success', text1: "Sucesso", text2: "Fruta atualizada!" });
            } else {
                const dbRef = ref(database, 'frutas');
                const novoItemRef = push(dbRef);
                await set(novoItemRef, {
                    ...dadosFruta,
                    criadoEm: new Date().toISOString()
                });
                Toast.show({ type: 'success', text1: "Sucesso", text2: "Fruta cadastrada!" });
            }
            limparCampos();

        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível salvar a fruta." });
        } finally {
            setLoading(false);
        }
    };

    const abrirDialogExcluir = (item) => {
        setItemParaExcluir(item);
        setDialogVisible(true);
    };

    const fecharDialogExcluir = () => {
        setItemParaExcluir(null);
        setDialogVisible(false);
    };

    const handleExcluirConfirmado = async () => {
        if (!itemParaExcluir) return;
        setLoading(true);
        try {
            const itemRef = ref(database, 'frutas/' + itemParaExcluir.id);
            await remove(itemRef);
            Toast.show({ type: 'success', text1: "Excluído", text2: `"${itemParaExcluir.nome}" foi removido.` });
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível excluir a fruta." });
        } finally {
            setLoading(false);
            fecharDialogExcluir();
        }
    };

    const handleEditar = (item) => {
        setItemEmEdicao(item);
        
        setNome(item.nome || '');
        setDescricao(item.descricao || '');
        setPreco(item.preco ? String(item.preco) : '');
        setImageUrl(item.imageUrl || ''); 

        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    const renderItem = ({ item }) => (
        <ItemDaLista
            item={item}
            onEditar={() => handleEditar(item)}
            onExcluir={() => abrirDialogExcluir(item)}
        />
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: colors.background }]}
            keyboardVerticalOffset={80}
        >
            {loadingLista ? (
                <ActivityIndicator animating={true} color={colors.primary} size="large" style={styles.loading} />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={listaItens}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={
                        <CadastroForm
                            nome={nome}
                            setNome={setNome}
                            descricao={descricao}
                            setDescricao={setDescricao}
                            preco={preco}
                            setPreco={setPreco}
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            handleSalvar={handleSalvar}
                            loading={loading}
                            itemEmEdicao={itemEmEdicao}
                            onLimparSelecao={limparCampos}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma fruta cadastrada ainda.</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    keyboardShouldPersistTaps="handled"
                />
            )}

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={fecharDialogExcluir} style={{backgroundColor: colors.surface}}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Tem certeza que deseja excluir a fruta:
                        </Text>
                        <Text variant="bodyLarge" style={styles.deleteItemName}>
                            "{itemParaExcluir?.nome}"?
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: 10 }}>
                            Esta ação não pode ser desfeita.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={fecharDialogExcluir} disabled={loading} textColor={colors.onSurfaceVariant}>
                            Cancelar
                        </Button>
                        <Button
                            onPress={handleExcluirConfirmado}
                            textColor={colors.error}
                            loading={loading}
                            disabled={loading}
                        >
                            Excluir
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </KeyboardAvoidingView>
    );
}

// --- Estilos ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 22,
        fontWeight: 'bold',
    },
    titleList: {
        marginTop: 30,
        marginBottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 10,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonCancel: {
        marginTop: 5,
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        elevation: 2, // Sombra sutil
        borderRadius: 12,
    },
    imagePlaceholder: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 18
    },
    emptyContainer: {
        paddingHorizontal: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
    },
    deleteItemName: {
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16
    }
});
