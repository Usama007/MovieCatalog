import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen';
import Config from 'react-native-config';
import DetailScreen from '../screens/detailScreen';
import { Button, Text, TouchableOpacity } from 'react-native';
import WatchListScreen from '../screens/watchListScreen';

const Stack = createNativeStackNavigator();
Config.API_KEY = 'cd890f94a756b1518a2a17617a5b430e';
const Route = ({navigation}) => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" options={{
                    title: 'MOVIE CATALOG'   }} component={HomeScreen} />
                <Stack.Screen name="Detail" options={{ title: 'DETAIL' }} component={DetailScreen} />
                <Stack.Screen name="WatchList" options={{ title: 'Watchlist' }} component={WatchListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Route
