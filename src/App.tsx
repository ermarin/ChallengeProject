/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'Login'}
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#0080ff',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold'
          },
        }}
      >
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={'Home'}
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
