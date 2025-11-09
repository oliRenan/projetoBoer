import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from './screen/HomeScreen.js';
import ProfileScreen from './screen/ProfileScreen.js';

const Tab = createBottomTabNavigator();

export default function Menu({ setUser }) { // Recebe 'setUser'
    return (
        <NavigationContainer>
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
                    tabBarActiveTintColor: '#22f059',
                    tabBarInactiveTintColor: '#777',
                    headerShown: false,
                })}
            >
                
                <Tab.Screen name="Home">
                  {(props) => <HomeScreen {...props} setUser={setUser} />}
                </Tab.Screen>
                
                {/* CORREÇÃO AQUI: Passar setUser para o ProfileScreen também */}
                <Tab.Screen name="Perfil">
                  {(props) => <ProfileScreen {...props} setUser={setUser} />}
                </Tab.Screen>

            </Tab.Navigator>
        </NavigationContainer>
    );
}
