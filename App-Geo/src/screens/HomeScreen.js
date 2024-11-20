import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { isAuthenticated } from '../service/authService';

const HomeScreen = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const loggedIn = await isAuthenticated();
    setIsLoggedIn(loggedIn);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeHeading}>
        Bem-vindo ao <Text style={styles.brandName}>Simulador de IoMT</Text>
      </Text>
      
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          if (isLoggedIn) {
            navigation.replace('Dados');
          } else {
            navigation.navigate('Login');
          }
        }}
      >
        <Text style={styles.dadosButtonText}>
          {isLoggedIn ? 'Ver Dados' : 'Login'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(240, 240, 240)',
    padding: 20,
  },
  welcomeHeading: {
    fontSize: 36,
    color: 'rgb(0, 0, 0)',
    marginBottom: 20,
    fontFamily: 'Open Sans, sans-serif',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  brandName: {
    fontSize: 56,
    color: '#0040ff',
    lineHeight: 56,
    fontFamily: 'Arial, sans-serif',
    letterSpacing: 2,
  },
  loginButton: {
    marginTop: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0040ff',
    borderRadius: 5,
  },
  dadosButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default HomeScreen;
