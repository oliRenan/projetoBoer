import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    Image, 
    FlatList, // Importar FlatList
    Dimensions, // Importar Dimensions
    SafeAreaView
} from 'react-native';
import { 
    Button, 
    Title, 
    Text, 
    useTheme, 
    Card, // Importar Card
    ActivityIndicator, 
    IconButton 
} from 'react-native-paper';
// 1. REMOVER 'signOut' e 'auth'
// import { signOut } from 'firebase/auth';
// import { auth } from '../../services/connectionFirebase';

// 2. IMPORTAR O DATABASE
import { database } from '../../services/connectionFirebase';
import { ref, query, orderByChild, limitToLast, onValue } from "firebase/database";

// Pegar a largura da tela para o carrossel
const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7; // Card terá 70% da largura
const SPACING = (width - ITEM_WIDTH) / 2; // Espaçamento para centralizar

// 3. 'setUser' NÃO É MAIS NECESSÁRIO, 'navigation' é recebido
export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    
    // 4. Estados para o Carrossel
    const [loading, setLoading] = useState(true);
    const [ultimasFrutas, setUltimasFrutas] = useState([]);

    // 5. useEffect para buscar os 3 últimos itens
    useEffect(() => {
        setLoading(true);
        const dbRef = ref(database, 'frutas'); // Buscar em 'frutas'
        // Ordena por 'criadoEm' e pega os 3 últimos
        const q = query(dbRef, orderByChild('criadoEm'), limitToLast(3));

        const unsubscribe = onValue(q, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itensArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Firebase retorna em ordem (antigo -> novo), então revertemos
                setUltimasFrutas(itensArray.reverse()); 
            } else {
                setUltimasFrutas([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 6. Função para navegar para a tela de Cadastro
    const irParaCadastro = () => {
        navigation.navigate('Cadastro');
    };

    // 7. Componente para renderizar cada Card do Carrossel
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
                        <IconButton icon="food-apple" size={60} iconColor={colors.primary} />
                    </View>
                )}
                <Card.Title
                    title={item.nome}
                    titleStyle={{ fontWeight: 'bold', color: colors.primary }}
                    subtitle={precoFormatado}
                    subtitleStyle={{ fontSize: 16 }}
                />
            </Card>
        );
    };

    return (
        // SafeAreaView para evitar que o conteúdo fique atrás da status bar
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            
            <View style={styles.header}>
                <Title style={[styles.title, { color: colors.onBackground }]}>Bem-vindo ao FrutApp!</Title>
                <Text variant="bodyLarge" style={[styles.subtext, { color: colors.onSurfaceVariant }]}>
                    Seu catálogo de frutas digital.
                </Text>
            </View>

            {/* 8. Seção do Carrossel */}
            <View style={styles.carouselContainer}>
                <Title style={[styles.carouselTitle, { color: colors.onBackground }]}>Últimas Adições</Title>
                {loading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{height: 250}} />
                ) : ultimasFrutas.length === 0 ? (
                    <Text style={styles.emptyCarousel}>Nenhuma fruta cadastrada ainda.</Text>
                ) : (
                    <FlatList
                        data={ultimasFrutas}
                        renderItem={renderCarouselItem}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: SPACING }}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        snapToInterval={ITEM_WIDTH + 10} // Largura + margem
                        style={styles.flatList}
                    />
                )}
            </View>
            
            {/* 9. Botão de "Call to Action" */}
            <Button
                mode="contained"
                onPress={irParaCadastro}
                style={[styles.button, { backgroundColor: colors.primary }]} 
                textColor={colors.onPrimary} 
                icon="plus"
            >
                Adicionar ou Ver Todas
            </Button>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Começar do topo
        alignItems: 'center',
        paddingTop: 40, // Espaço do topo
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtext: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 8,
    },
    // 10. Estilos do Carrossel
    carouselContainer: {
        height: 300, // Altura fixa para o carrossel
        width: '100%',
        marginBottom: 20,
    },
    carouselTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 15,
    },
    emptyCarousel: {
        textAlign: 'center',
        marginTop: 50,
        fontStyle: 'italic',
    },
    flatList: {
        flexGrow: 0,
    },
    card: {
        width: ITEM_WIDTH,
        marginHorizontal: 5,
        elevation: 4,
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardImage: {
        height: 150, // Altura da imagem
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    // Fim Estilos Carrossel
    button: {
        marginTop: 10,
        width: '90%', 
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
    }
});
