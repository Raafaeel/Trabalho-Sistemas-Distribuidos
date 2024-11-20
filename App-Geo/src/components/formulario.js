import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validarCampos } from "../utils/validacao";
import Dados from "../core/dados";
import { calcularDistancia } from "../utils/distance";
import { getUserDetails } from "../service/authService";
import { getCurrentLocation } from "../utils/location";

export default function FormularioDado({ dado = {}, onSalvar, onCancelar }) {
  const [codigo, setCodigo] = useState(dado.codigoUsuario || "");
  const [seq, setSeq] = useState(dado.seq || null);
  const [dataHora, setDataHora] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19);
  });

  const [tipo, setTipo] = useState(() => (dado.tipo ? parseInt(dado.tipo, 10) : 0));
  const [valor1, setValor1] = useState(String(dado.valor1 || "0"));
  const [valor2, setValor2] = useState(String(dado.valor2 || "0"));
  const [emCasa, setEmCasa] = useState(dado.emCasa || false);
  const [erros, setErros] = useState({});

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const obterCodigoUsuario = async () => {
    try {
      const codigoUsuario = await AsyncStorage.getItem("codigoUsuario");
      if (codigoUsuario) {
        setCodigo(codigoUsuario);
      }
    } catch (error) {
      console.error("Erro ao obter código de usuário:", error);
    }
  };

  const verificarEmCasa = async () => {
    try {
      const { latitude: latDB, longitude: lonDB } = await getUserDetails();
      const { latitude: latAtual, longitude: lonAtual } = await getCurrentLocation();

      setLatitude(latAtual);
      setLongitude(lonAtual);

      const distancia = calcularDistancia(latDB, lonDB, latAtual, lonAtual);
      const raioProximidade = 10;

      setEmCasa(distancia <= raioProximidade);
    } catch (error) {
      console.error("Erro ao verificar localização:", error);
    }
  };

  useEffect(() => {
    obterCodigoUsuario();
    verificarEmCasa();
  }, []);

  const salvar = () => {
    const errosTemp = validarCampos(tipo, valor1, valor2, codigo, dataHora, emCasa);

    if (errosTemp) {
      setErros(errosTemp);
      return;
    }

    const novoDado = new Dados(
      null,
      parseInt(codigo, 10),
      dataHora,
      tipo,
      parseFloat(valor1),
      tipo !== 3 ? parseFloat(valor2) : null,
      emCasa
    );

    if (onSalvar) {
      onSalvar(novoDado);
    } else {
      console.error("Função onSalvar não foi fornecida corretamente");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Código do Usuário</Text>
            <TextInput style={styles.input} value={codigo} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data e Hora</Text>
            <TextInput style={styles.input} value={dataHora} editable={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo</Text>
            <Picker
              selectedValue={tipo}
              style={styles.picker}
              onValueChange={(valor) => {
                const tipoNum = parseInt(valor, 10);
                setTipo(tipoNum);
                if (tipoNum === 3) setValor2("0");
              }}
            >
              <Picker.Item label="Selecione o Tipo" value={0} />
              <Picker.Item label="Pressão Arterial" value={1} />
              <Picker.Item label="SPO2" value={2} />
              <Picker.Item label="Temperatura Corporal" value={3} />
            </Picker>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor 1</Text>
            <TextInput
              style={styles.input}
              value={valor1}
              onChangeText={setValor1}
              keyboardType="numeric"
            />
            {erros.valor1 && <Text style={styles.error}>{erros.valor1}</Text>}
          </View>

          {tipo !== 3 && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor 2</Text>
              <TextInput
                style={styles.input}
                value={valor2}
                onChangeText={setValor2}
                keyboardType="numeric"
              />
              {erros.valor2 && <Text style={styles.error}>{erros.valor2}</Text>}
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Em Casa</Text>
            <TextInput
              style={styles.input}
              value={emCasa ? "Sim" : "Não"}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Latitude Atual</Text>
            <Text style={styles.input}>
              {latitude !== null ? latitude : "Carregando..."}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Longitude Atual</Text>
            <Text style={styles.input}>
              {longitude !== null ? longitude : "Carregando..."}
            </Text>
          </View>

          <View style={styles.buttons}>
            <Button title="Salvar" onPress={salvar} />
            <Button title="Cancelar" onPress={onCancelar} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    padding: 16,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  buttons: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});
