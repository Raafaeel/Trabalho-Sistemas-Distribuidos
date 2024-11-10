import React from 'react';
import DadosColetados from '@/core/dadosColetados';
import { IconeEdicao, IconeLixo } from "../icones/tabela";

interface TabelaProps {
  dados: DadosColetados[];
  dadosSelecionado?: (dados: DadosColetados) => void;
  dadosExcluido?: (dados: DadosColetados) => void;
}

export default function Tabela(props: TabelaProps) {
  const exibirAcoes = props.dadosSelecionado || props.dadosExcluido;

  function renderHeader() {
    return (
      <tr>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Seq</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Código</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Data e Hora</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Tipo</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Valor 1</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Valor 2</th>
        <th className="text-left p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Em Casa</th>
        {exibirAcoes ? <th className="p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white">Ações</th> : null}
      </tr>
    );
  }

  function renderDados() {
    return props.dados?.map((dados, i) => (
      <tr key={dados.seq} className={`${i % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'} text-gray-800`}>
        <td className="text-left p-3">{dados.seq}</td>
        <td className="text-left p-3">{dados.codigoUsuario}</td>
        <td className="text-left p-3">{dados.dataHora.toLocaleString()}</td>
        <td className="text-left p-3">{dados.tipo}</td>
        <td className="text-left p-3">{dados.valor1}</td>
        <td className="text-left p-3">{dados.valor2}</td>
        <td className="text-center p-3">
          <input type="checkbox" checked={dados.emCasa} readOnly />
        </td>
        {exibirAcoes ? renderizarAcoes(dados) : null}
      </tr>
    ));
  }

  function renderizarAcoes(dados: DadosColetados) {
    return (
      <td className="flex justify-center">
        {props.dadosSelecionado ? (
          <button onClick={() => props.dadosSelecionado?.(dados)} className="flex justify-center items text-green-600 rounded-full p-2 m-1 hover:bg-gray-100">
            {IconeEdicao}
          </button>
        ) : null}
        {props.dadosExcluido ? (
          <button onClick={() => props.dadosExcluido?.(dados)} className="flex justify-center items text-red-600 rounded-full p-2 m-1 hover:bg-gray-100">
            {IconeLixo}
          </button>
        ) : null}
      </td>
    );
  }

  return (
    <table className="w-full rounded-xl overflow-hidden bg-blue-50">
      <thead className="text-gray-800 bg-gradient-to-r from-blue-400 to-blue-600">
        {renderHeader()}
      </thead>
      <tbody>
        {renderDados()}
      </tbody>
    </table>
  );
}
