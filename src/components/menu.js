import * as React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screen/HomeScreen.js';
import ProfileScreen from './screen/ProfileScreen.js';

const Tab = createBottomTabNavigator();

export default function Menu({ setUser, theme }) {

    const navigationTheme = {
        ...DarkTheme, 
        colors: {
            ...DarkTheme.colors,
            primary: theme.colors.primary, 
            background: theme.colors.background, 
            card: theme.colors.surface, 
            text: theme.colors.text,
            notification: theme.colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case 'Home':
                                iconName = 'home';
                                break;
                            case 'Perfil':
                                iconName = 'user';
                                break;
                            default:
                                iconName = 'bomb';
                                break;
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: theme.colors.accent, // Ciano
                    tabBarInactiveTintColor: '#777',
                    headerShown: false,
                    tabBarStyle: { 
                        backgroundColor: theme.colors.surface, 
                        borderTopColor: theme.colors.surface, 
                    }
                })}
            >
                
                <Tab.Screen name="Home">
                  {(props) => <HomeScreen {...props} setUser={setUser} />}
                </Tab.Screen>
                
                <Tab.Screen name="Perfil">
                  {(props) => <ProfileScreen {...props} setUser={setUser} />}
                </Tab.Screen>

            </Tab.Navigator>
        </NavigationContainer>
    );
}
