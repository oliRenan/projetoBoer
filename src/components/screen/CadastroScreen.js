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
    Card, // 1. Trocamos List por Card
    useTheme,
    ActivityIndicator,
    Text,
    IconButton,
    Portal,
    Dialog
} from 'react-native-paper'; // Apenas 'react-native-paper'
import Toast from 'react-native-toast-message';
// Nenhuma biblioteca de máscara é necessária

import { database } from '../../services/connectionFirebase';
import { ref, push, set, onValue, update, remove } from "firebase/database";

// --- Componente do Formulário ---
const CadastroForm = ({
    nome,
    setNome,
    descricao,
    setDescricao,
    preco,
    setPreco,
    imageUrl, // 2. Adicionar o estado da imagem
    setImageUrl,
    handleSalvar,
    loading,
    itemEmEdicao,
    onLimparSelecao
}) => {
    const { colors } = useTheme();
    const isEditing = !!itemEmEdicao;

    const handlePrecoChange = (text) => {
        let valorLimpo = text.replace(/[^0-9.,]/g, '');
        valorLimpo = valorLimpo.replace(',', '.');
        if (valorLimpo.split('.').length > 2) return;
        if (isNaN(Number(valorLimpo)) && valorLimpo !== '') return;
        setPreco(valorLimpo);
    };

    return (
        <View style={styles.formContainer}>
            <Title style={styles.title}>
                {isEditing ? `Editando: ${itemEmEdicao.nome}` : 'Cadastrar Novo Tênis'}
            </Title>
            <TextInput
                label="Modelo do Tênis"
                value={nome}
                onChangeText={setNome}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
            />

            {/* 3. Adicionar o campo de URL da Imagem */}
            <TextInput
                label="URL da Imagem (Opcional)"
                value={imageUrl}
                onChangeText={setImageUrl}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                keyboardType="url" // Teclado apropriado
                autoCapitalize="none" // Desativa auto-capitalize
            />
            
            <TextInput
                label="Preço"
                value={preco}
                onChangeText={handlePrecoChange}
                mode="outlined"
                style={styles.input}
                activeOutlineColor={colors.primary}
                keyboardType="numeric"
                left={<TextInput.Affix text="R$ " />}
                placeholder="0.00"
            />

            <TextInput
                label="Descrição (ex: cor, tamanho, marca)"
                value={descricao}
                onChangeText={setDescricao}
                mode="outlined"
                style={styles.input}
                multiline
                numberOfLines={3}
                activeOutlineColor={colors.primary}
            />
            <Button
                mode="contained"
                onPress={handleSalvar}
                loading={loading}
                disabled={loading}
                icon={isEditing ? "pencil" : "plus-circle"}
                style={[styles.button, { backgroundColor: isEditing ? colors.accent : colors.primary }]}
            >
                {isEditing ? 'Atualizar Tênis' : 'Salvar Tênis'}
            </Button>

            {isEditing && (
                <Button
                    mode="text"
                    onPress={onLimparSelecao}
                    disabled={loading}
                    style={styles.buttonCancel}
                    textColor={colors.text}
                >
                    Cancelar Edição
                </Button>
            )}

            <Title style={styles.titleList}>Tênis Cadastrados</Title>
        </View>
    );
}


// --- Componente do Item da Lista (agora como Card) ---
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
        // 4. Usar o Card como container
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            
            {/* 5. Se tiver imageUrl, usa Card.Cover, senão, mostra um placeholder */}
            {item.imageUrl ? (
                <Card.Cover source={{ uri: item.imageUrl }} />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <IconButton icon="shoe-sneaker" size={40} iconColor={colors.accent} />
                    <Text variant="bodySmall">Sem imagem</Text>
                </View>
            )}
            
            <Card.Title
                title={item.nome}
                titleStyle={[styles.itemTitle, { color: colors.accent }]}
                subtitle={precoFormatado}
                subtitleStyle={{ color: colors.text, fontSize: 16 }}
            />
            <Card.Content>
                <Text variant="bodyMedium" style={{ marginBottom: 10 }}>{item.descricao}</Text>
                <Text variant="bodySmall" style={{ fontStyle: 'italic' }}>
                    {formatarData(item.criadoEm)}
                </Text>
            </Card.Content>
            
            {/* 6. Botões de Ação dentro do Card */}
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
    const [imageUrl, setImageUrl] = useState(''); // 7. Adicionar estado da Imagem
    const [loading, setLoading] = useState(false);
    const [itemEmEdicao, setItemEmEdicao] = useState(null);

    // ... (Estados da lista e diálogo permanecem os mesmos) ...
    const [listaItens, setListaItens] = useState([]);
    const [loadingLista, setLoadingLista] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [itemParaExcluir, setItemParaExcluir] = useState(null);

    useEffect(() => {
        setLoadingLista(true);
        const dbRef = ref(database, 'tenis');

        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itensArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setListaItens(itensArray.reverse());
            } else {
                setListaItens([]);
            }
            setLoadingLista(false);
        }, (error) => {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível carregar a lista de tênis." });
            setLoadingLista(false);
        });

        return () => unsubscribe();
    }, []);

    const limparCampos = () => {
        setNome('');
        setDescricao('');
        setPreco('');
        setImageUrl(''); // 8. Limpar o estado da imagem
        setItemEmEdicao(null);
        Keyboard.dismiss();
    };

    const handleSalvar = async () => {
        
        if (!nome?.trim() || !descricao?.trim()) {
            Toast.show({ type: 'error', text1: "Atenção", text2: "Preencha o Modelo e a Descrição." });
            return;
        }

        const precoNumero = parseFloat(preco.replace(',', '.'));
        
        if (isNaN(precoNumero) || precoNumero <= 0) {
            Toast.show({ type: 'error', text1: "Atenção", text2: "O preço deve ser um valor maior que R$ 0,00." });
            return;
        }

        // 9. Validação da URL
        const urlLimpa = imageUrl?.trim() || ''; // Pega a URL ou define como string vazia
        if (urlLimpa && !urlLimpa.startsWith('http')) {
            Toast.show({ 
                type: 'error', 
                text1: "URL Inválida", 
                text2: "Se preenchida, a URL da imagem deve começar com http ou https." 
            });
            return;
        }
        
        setLoading(true);
        const dadosTenis = {
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: precoNumero,
            imageUrl: urlLimpa // 10. Salva a URL (limpa)
        };

        try {
            if (itemEmEdicao) {
                const itemRef = ref(database, 'tenis/' + itemEmEdicao.id);
                await update(itemRef, dadosTenis);
                Toast.show({ type: 'success', text1: "Sucesso", text2: "Tênis atualizado!" });
            } else {
                const dbRef = ref(database, 'tenis');
                const novoItemRef = push(dbRef);
                await set(novoItemRef, {
                    ...dadosTenis,
                    criadoEm: new Date().toISOString()
                });
                Toast.show({ type: 'success', text1: "Sucesso", text2: "Tênis cadastrado!" });
            }
            limparCampos();

        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível salvar o tênis." });
        } finally {
            setLoading(false);
        }
    };

    // ... (abrirDialogExcluir e fecharDialogExcluir sem alterações) ...
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
            const itemRef = ref(database, 'tenis/' + itemParaExcluir.id);
            await remove(itemRef);
            Toast.show({ type: 'success', text1: "Excluído", text2: `"${itemParaExcluir.nome}" foi removido.` });
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível excluir o tênis." });
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
        setImageUrl(item.imageUrl || ''); // 11. Carregar a URL no formulário ao editar

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
                            imageUrl={imageUrl} // Passar props da imagem
                            setImageUrl={setImageUrl}
                            handleSalvar={handleSalvar}
                            loading={loading}
                            itemEmEdicao={itemEmEdicao}
                            onLimparSelecao={limparCampos}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum tênis cadastrado ainda.</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    onScrollBeginDrag={() => Keyboard.dismiss()}
                    keyboardShouldPersistTaps="handled"
                />
            )}

            {/* Diálogo de Exclusão */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={fecharDialogExcluir}>
                    <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Tem certeza que deseja excluir o tênis:
                        </Text>
                        <Text variant="bodyLarge" style={styles.deleteItemName}>
                            "{itemParaExcluir?.nome}"?
                        </Text>
                        <Text variant="bodySmall" style={{ marginTop: 10 }}>
                            Esta ação não pode ser desfeita.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={fecharDialogExcluir} disabled={loading}>
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
    },
    titleList: {
        marginTop: 30,
        marginBottom: 10,
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 10,
    },
    buttonCancel: {
        marginTop: 5,
    },
    // 12. Novos estilos para o Card
    card: {
        marginHorizontal: 16, // Espaço nas laterais
        marginVertical: 8,  // Espaço entre os cards
        elevation: 4, // Sombra
    },
    imagePlaceholder: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Um fundo leve
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
    // (Removido 'iconButtonContainer' pois agora usamos Card.Actions)
    deleteItemName: {
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
        fontSize: 16
    }
});
