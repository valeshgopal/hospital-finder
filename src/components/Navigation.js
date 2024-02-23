import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import { useUser } from '../context/user';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { user } = useUser()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'Home' : 'Login'}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Home' component={Home} />
    </Stack.Navigator>
  );
};

export default Navigation;
