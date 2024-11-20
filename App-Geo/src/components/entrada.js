import React from "react";
import { View, Text, TextInput, Picker, StyleSheet } from "react-native";

export default function Entrada({
  tipo,
  texto,
  valor,
  somenteLeitura,
  onChange,
  opcoes,
  erro,
}) {
  if (tipo === 'select' && opcoes) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{texto}</Text>
        <Picker
          selectedValue={valor}
          onValueChange={(itemValue) => onChange?.(itemValue)}
          enabled={!somenteLeitura}
          style={somenteLeitura ? styles.readOnly : styles.input}
        >
          {opcoes.map((opcao) => (
            <Picker.Item key={opcao.value} label={opcao.label} value={opcao.value} />
          ))}
        </Picker>
        {erro && <Text style={styles.error}>{erro}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{texto}</Text>
      <TextInput
        style={[styles.input, somenteLeitura && styles.readOnly]}
        value={valor ? valor.toString() : ''}
        onChangeText={(text) => {
          if (!somenteLeitura) {
            const value = tipo === 'number' ? (isNaN(text) ? NaN : Number(text)) : text;
            onChange?.(value);
          }
        }}
        editable={!somenteLeitura}
      />
      {erro && <Text style={styles.error}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  readOnly: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
