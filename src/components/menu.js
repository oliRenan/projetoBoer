import * as React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'; //
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screen/HomeScreen.js';
import ProfileScreen from './screen/ProfileScreen.js';
import CadastroScreen from './screen/CadastroScreen.js'; // 1. IMPORTAR A TELA NOVA

const Tab = createBottomTabNavigator();

export default function Menu({ setUser, theme }) {

    const navigationTheme = {
        ...DefaultTheme, 
        colors: {
            ...DefaultTheme.colors,
            primary: theme.colors.primary, 
            background: theme.colors.background, 
            card: theme.colors.surface, 
            text: theme.colors.text,
            notification: theme.colors.primary,
        },
    }; //

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        // 2. ADICIONAR O ÍCONE DE CADASTRO
                        if (route.name === 'Home') {
                            iconName = 'home';
                        } else if (route.name === 'Perfil') {
                            iconName = 'user';
                        } else if (route.name === 'Cadastro') {
                            iconName = 'plus-square'; // Ícone de "adicionar"
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.primary, 
                    tabBarInactiveTintColor: '#888',
                    headerShown: false,
                    tabBarStyle: { 
                        backgroundColor: theme.colors.surface,
                        borderTopColor: theme.colors.outline, 
                    }
                })}
            >
                {/* 3. HomeScreen AGORA USA 'component' (não precisa mais de 'setUser') */}
                <Tab.Screen name="Home" component={HomeScreen} />
                
                {/* 4. ADICIONAR A NOVA TELA DE CADASTRO */}
                <Tab.Screen name="Cadastro" component={CadastroScreen} />

                {/* Perfil continua igual, pois precisa de 'setUser' para o logout */}
                <Tab.Screen name="Perfil">
                  {(props) => <ProfileScreen {...props} setUser={setUser} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
    );
}
