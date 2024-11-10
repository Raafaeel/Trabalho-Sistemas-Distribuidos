'use client'

import React, { useEffect, useState } from "react";
import Layout from "@/components/dadosColetados/layout";
import TabelaDados from "@/components/dadosColetados/tabela";
import Dado from "@/core/dadosColetados";
import Botao from "@/components/dadosColetados/botao";
import FormularioDado from "@/components/dadosColetados/formulario";
import { atualizarDados, cadastrarDados, excluirDados, fetchDados } from "@/service/dadosColetadosService"

export default function DadosColetados() {
  const [dado, setDado] = useState<Dado>(Dado.vazio());
  const [visivel, setVisivel] = useState<'tabela' | 'form'>('tabela');
  const [dados, setDados] = useState<Dado[]>([]);

  useEffect(() => {
    if (visivel === 'tabela') {
      const loadDados = async () => {
        try {
          const dadosCarregados = await fetchDados();
          setDados(dadosCarregados);
        } catch (error) {
          console.error("Erro ao buscar dados coletados:", error);
        }
      }
      loadDados();
    }
  }, [visivel]);

  function dadoSelecionado(dado: Dado) {
    setDado(dado);
    setVisivel('form');
  }

  function novoDado() {
    setDado(Dado.vazio());
    setVisivel("form");
  }

  async function dadoExcluido(dado: Dado) {
    const confirmacao =
      window.confirm("Tem certeza de que deseja excluir este dado?");
    if (confirmacao) {
      try {
        if (dado.seq !== null) {
          await excluirDados(dado.seq);
        } else {
          console.error("dadoID é null!");
        }
        setDados(prevDados => prevDados.filter(d => d.seq !== dado.seq));
      } catch (error) {
        console.error("Erro ao excluir dado:", error);
      }
    }
  }

  async function salvarDado(dado: Dado) {
    try {
      await cadastrarDados(dado);
      setVisivel("tabela");
    } catch (error) {
      console.error("Erro ao salvar dado:", error);
    }
  }

  async function alterarDado(dado: Dado) {
    try {
      await atualizarDados(dado);
      setVisivel("tabela");
    } catch (error) {
      console.error("Erro ao atualizar dado:", error);
    }
  }

  function salvarOuAlterarDado(dado: Dado) {
    if (dado.seq) {
      alterarDado(dado);
    } else {
      salvarDado(dado);
    }
  }

  return (
    <div className={`flex justify-center items-center h-screen bg-gradient-to-b from-gray-100 to-gray-300`}>
      <Layout titulo="Cadastro de Dados Coletados">
        {visivel === 'tabela' ? (
          <>
            <div className="flex justify-end">
              <Botao className="mb-4" cor="bg-blue-600"
                onClick={() => novoDado()}>
                Novo Dado
              </Botao>
            </div>
            <TabelaDados
              dados={dados}
              dadosSelecionado={dadoSelecionado}
              dadosExcluido={dadoExcluido}
            />
          </>
        ) : (
          <FormularioDado
            dados={dado}
            dadosMudou={salvarOuAlterarDado}
            cancelado={() => setVisivel('tabela')}
          />
        )}
      </Layout>
    </div>
  );
}
