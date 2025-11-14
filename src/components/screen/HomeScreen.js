import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    FlatList, // 1. Importar FlatList
    Dimensions, // 2. Importar Dimensions
    Linking 
} from 'react-native';
import { 
    Button, 
    Title, 
    Text, 
    useTheme, 
    Card, // 3. Importar Card
    ActivityIndicator, // 4. Importar ActivityIndicator
    IconButton 
} from 'react-native-paper';

// 5. Importar o Firebase
import { database } from '../../services/connectionFirebase';
import { ref, query, orderByChild, limitToLast, onValue } from "firebase/database";

// 6. Pegar a largura da tela para o carrossel
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75; // Cada card terá 75% da largura da tela
const SPACING = (width - ITEM_WIDTH) / 2; // Espaçamento para centralizar o card

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();

    // 7. Estados para o Carrossel
    const [loading, setLoading] = useState(true);
    const [ultimosTenis, setUltimosTenis] = useState([]);

    // 8. useEffect para buscar os dados do Firebase
    useEffect(() => {
        setLoading(true);
        const dbRef = ref(database, 'tenis');
        // Cria a query: ordena por 'criadoEm' e pega os últimos 3
        const q = query(dbRef, orderByChild('criadoEm'), limitToLast(3));

        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itensArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Os itens vêm em ordem (antigo -> novo), então revertemos
                setUltimosTenis(itensArray.reverse()); 
            } else {
                setUltimosTenis([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            Toast.show({ type: 'error', text1: "Erro", text2: "Não foi possível carregar os tênis." });
            setLoading(false);
        });

        // Limpa o 'listener' ao desmontar
        return () => unsubscribe();
    }, []);


    const irParaCadastro = () => {
        navigation.navigate('Cadastro');
    };

    // 9. Componente para renderizar cada Card do Carrossel
    const renderCarouselItem = ({ item }) => {
        const precoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(item.preco || 0);

        return (
            <Card style={[styles.card, { backgroundColor: colors.surface }]}>
                {item.imageUrl ? (
                    <Card.Cover source={{ uri: item.imageUrl }} style={styles.cardImage} />
                ) : (
                    <View style={[styles.cardImage, styles.imagePlaceholder]}>
                        <IconButton icon="shoe-sneaker" size={60} iconColor={colors.accent} />
                        <Text variant="bodySmall">Sem imagem</Text>
                    </View>
                )}
                <Card.Title
                    title={item.nome}
                    titleStyle={{ fontWeight: 'bold' }}
                    subtitle={precoFormatado}
                    subtitleStyle={{ fontSize: 16, color: colors.primary }}
                />
            </Card>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            
            <Image 
                style={styles.logo} 
                source={require('../../../assets/logoo.png')} 
            />
            <Title style={[styles.title, { color: colors.primary }]}>Meu Catálogo de Tênis</Title>
            
            <Text variant="bodyLarge" style={styles.subtext}>
                Gerencie sua coleção de forma fácil e moderna.
            </Text>

            {/* 10. Seção do Carrossel */}
            <View style={styles.carouselContainer}>
                <Title style={styles.carouselTitle}>Últimos Cadastros</Title>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{height: 280}} />
                ) : ultimosTenis.length === 0 ? (
                    <Text style={styles.emptyCarousel}>Nenhum tênis cadastrado ainda.</Text>
                ) : (
                    <FlatList
                        data={ultimosTenis}
                        renderItem={renderCarouselItem}
                        keyExtractor={item => item.id}
                        horizontal // <-- A mágica do Carrossel
                        pagingEnabled // <-- Faz "snap" por item
                        showsHorizontalScrollIndicator={false}
                        // Estilo para centralizar o item ativo
                        contentContainerStyle={{ paddingHorizontal: SPACING }}
                        // Garante que o item pare no centro
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={ITEM_WIDTH + 10} // Largura do item + margin
                        style={styles.flatList}
                    />
                )}
            </View>
            
            <Button
                mode="contained"
                onPress={irParaCadastro}
                style={[styles.button, { backgroundColor: colors.accent }]} 
                textColor={colors.background}
                icon="plus-circle"
            >
                Adicionar ou Ver Todos
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20, // Padding vertical
    },
    logo: {
        width: 100, // Logo menor
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 24, // Título menor
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20, // Menos margem
    },
    // 11. Estilos do Carrossel
    carouselContainer: {
        height: 320, // Altura fixa para o carrossel
        width: '100%',
        marginBottom: 20,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 10,
    },
    emptyCarousel: {
        textAlign: 'center',
        marginTop: 50,
        fontStyle: 'italic',
    },
    flatList: {
        flexGrow: 0, // Impede que o FlatList tente ocupar todo o espaço
    },
    card: {
        width: ITEM_WIDTH,
        marginHorizontal: 5, // Espaçamento entre os cards
        elevation: 5,
        borderRadius: 12,
        overflow: 'hidden', // Garante que a imagem não vaze
    },
    cardImage: {
        height: 180, // Altura fixa para a imagem
    },
    imagePlaceholder: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    // Fim dos estilos do Carrossel
    button: {
        width: '90%', 
        borderRadius: 8,
        paddingVertical: 4,
    }
});
