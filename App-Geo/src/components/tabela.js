import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Tabela(props) {
  const renderHeader = () => (
    <View style={styles.header}>
      {['Seq', 'Código', 'Data e Hora', 'Tipo', 'Valor 1', 'Valor 2', 'Em Casa'].map((title) => (
        <Text key={title} style={styles.headerText}>{title}</Text>
      ))}
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.seq}</Text>
      <Text style={styles.cell}>{item.codigo}</Text>
      <Text style={styles.cellDataHora}>{new Date(item.dataHora).toLocaleString()}</Text>
      <Text style={styles.cell}>{item.tipo}</Text>
      <Text style={styles.cell}>{item.valor1}</Text>
      <Text style={styles.cell}>{item.valor2}</Text>
      <Text style={styles.cell}>{item.emCasa ? 'Sim' : 'Não'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        {renderHeader()}
        <FlatList
          data={props.dados}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.seq)}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  table: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#4F87D3',
    paddingVertical: 20,
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },

  cellDataHora: {
    flex: 2,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
});
