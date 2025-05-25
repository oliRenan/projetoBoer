import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Tela from './tela.js' ;
import TelaJogos from './screen/listar.js'
import Jogos from './screen/jogos.js'
import Reportar from './screen/reportar.js'
import CrudApi from './screen/crudApi.js'

function HomeScreen() {
    return (
        <Tela></Tela>
    );
}
 
function ListScreen() {
    return (
        <TelaJogos></TelaJogos>
    );
}
 
 
 
 
function PostScreen() {
    return (
    <Reportar></Reportar>
    );
}
 
function PostScreen2() {
    return (
    <Jogos></Jogos>
    );
}
 
function APIScreen() {
    return (
    <CrudApi/>
    );
}
 
const Tab = createBottomTabNavigator();
 
export default function Menu() {
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
                            case 'Listar':
                                iconName = 'bars'; //**/clipboard-list */
                                break;
                            case 'Jogos':
                                iconName = 'gamepad';
                                break;
                            case 'Reportar':
                                iconName = 'bug';
                                break;
                            case 'teste':
                                iconName = 'android';
                                break;
                            default:
                                iconName = 'bomb';
                                break;
                        }
                        return <Icon name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor :'#22f059',
                    tabBarIncactiveTintColor:'#777',
                    showLabel: true,
                })}
            >
                <Tab.Screen 
                    name="Home" 
                    component={HomeScreen} 
                />
                <Tab.Screen 
                    name="Listar" 
                    component={ListScreen} 
                />
                <Tab.Screen
                    name="Jogos"
                    component={PostScreen2}
                />
                <Tab.Screen
                    name="Reportar"
                    component={PostScreen}
                />
                <Tab.Screen 
                    name="teste"
                    component={APIScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconTabRound: {
        width: 60,
        height: 90,
        borderRadius: 30,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#9C27B0',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    }
});
