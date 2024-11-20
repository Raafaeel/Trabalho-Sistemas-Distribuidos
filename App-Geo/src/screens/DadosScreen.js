import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import TabelaDados from "../components/tabela";
import Dados from "../core/dados";
import { cadastrarDados, fetchDados } from "../service/dadosService";
import FormularioDado from "../components/formulario";
import { logout } from "../service/authService";

export default function DadosColetados({ navigation }) {
  const [dado, setDado] = useState(Dados.vazio());
  const [visivel, setVisivel] = useState('tabela');
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState(null);

  useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const codigo = await AsyncStorage.getItem('codigoUsuario');
        if (codigo) {
          setCodigoUsuario(Number(codigo));
        }
      } catch (error) {
        console.error('Erro ao recuperar o código do usuário:', error);
      }
    };

    verificarUsuario();
  }, []);

  useEffect(() => {
    if (visivel === 'tabela' && codigoUsuario !== null) {
      const loadDados = async () => {
        try {
          const dadosCarregados = await fetchDados(codigoUsuario);
          if (dadosCarregados && dadosCarregados.length > 0) {
            setDados(dadosCarregados);
            setErro('');
          } else {
            setErro('Não há dados disponíveis para o usuário.');
          }
        } catch (error) {
          setErro('Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.');
        }
      };
      loadDados();
    }
  }, [visivel, codigoUsuario]);

  function dadoSelecionado(dado) {
    setDado(dado);
    setVisivel('form');
  }

  function novoDado() {
    setDado(Dados.vazio());
    setVisivel('form');
  }

  async function salvarDado(dado) {
    try {
      await cadastrarDados(dado);
      setVisivel('tabela');
    } catch (error) {
      console.error("Erro ao salvar dado:", error);
      setErro('Erro ao salvar dado. Tente novamente.');
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Home');
    } catch (error) {
      console.error('Erro ao realizar logout', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Dados Coletados</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Logout" 
          color="#FF5733" 
          onPress={handleLogout} 
        />
      </View>

      {visivel === 'tabela' ? (
        <>
          <View style={styles.buttonContainer}>
            <Button 
              title="Novo Dado" 
              color="#4CAF50" 
              onPress={novoDado} 
            />
          </View>
          <View style={styles.tabelaContainer}>
            <TabelaDados
              dados={dados}
              dadosSelecionado={dadoSelecionado}
            />
          </View>
          {erro && <Text style={styles.errorText}>{erro}</Text>}
        </>
      ) : (
        <FormularioDado
          dado={dado}
          onSalvar={salvarDado}
          onCancelar={() => setVisivel('tabela')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  title: {
    fontSize: 24,
    color: '#0040ff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  tabelaContainer: {
    flex: 1,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginTop: 15,
    fontSize: 14,
  },
});
