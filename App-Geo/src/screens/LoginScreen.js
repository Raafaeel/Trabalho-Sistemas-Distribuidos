import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../service/authService';

const LoginScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = async () => {
    try {
      const codigoUsuario = await login(usuario, senha);
      
      if (codigoUsuario) {
        await AsyncStorage.setItem('usuarioAutenticado', 'true');
        await AsyncStorage.setItem('codigoUsuario', codigoUsuario.toString());

        navigation.reset({
          index: 0,
          routes: [{ name: 'Dados' }],
        });

      } else {
        setErro('Credenciais inválidas.');
      }
    } catch (error) {
      setErro(error.message || 'Erro ao fazer login.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="gray"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="gray"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {erro ? <Text style={styles.errorText}>{erro}</Text> : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  title: {
    fontSize: 36,
    color: '#0040ff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    padding: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0040ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    fontSize: 14,
  },
});

export default LoginScreen;
