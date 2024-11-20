import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import DadosScreen from './src/screens/DadosScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [codigoUsuario, setCodigoUsuario] = useState(null);

  const checkAuthStatus = async () => {
    const codigo = await AsyncStorage.getItem('codigoUsuario');
    
    if (codigo) {
      setCodigoUsuario(codigo);
    } else {
      setCodigoUsuario(null);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={codigoUsuario ? 'Dados' : 'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dados" component={DadosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
