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
  const [erro, setErro] = useState("");
  const [codigoUsuario, setCodigoUsuario] = useState<number | null>(null);

  useEffect(() => {
    const codigo = localStorage.getItem('codigoUsuario');
    if (codigo) {
      setCodigoUsuario(Number(codigo));
    }
  }, []);

  useEffect(() => {
    console.log("Visivel:", visivel, "Codigo Usuario:", codigoUsuario);
  
    if (visivel === 'tabela' && codigoUsuario !== null) {
      const loadDados = async () => {
        try {
          const dadosCarregados = await fetchDados(codigoUsuario);
          console.log("Dados carregados:", dadosCarregados);
          
          if (dadosCarregados && dadosCarregados.length > 0) {
            setDados(dadosCarregados);
            setErro('');
          } else {
            setErro('Não há dados disponíveis para o usuário.');
          }
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
          setErro('Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.');
        }
      };
      loadDados();
    }
  }, [visivel, codigoUsuario]);
  

  function dadoSelecionado(dado: Dado) {
    setDado(dado);
    setVisivel('form');
  }

  function novoDado() {
    setDado(Dado.vazio());
    setVisivel("form");
  }

  async function dadoExcluido(dado: Dado) {
    const confirmacao = window.confirm("Tem certeza de que deseja excluir este dado?");
    
    if (confirmacao) {
      try {
        if (dado.seq !== null) {
          await excluirDados(dado.seq);
          setDados(prevDados => prevDados.filter(d => d.seq !== dado.seq));
        } else {
          console.error("dado.seq é null!");
        }
      } catch (error) {
        console.error("Erro ao excluir dado:", error);
        setErro('Erro ao excluir dado. Tente novamente.');
      }
    }
  }

  async function salvarDado(dado: Dado) {
    try {
      await cadastrarDados(dado);
      setVisivel("tabela");
    } catch (error) {
      console.error("Erro ao salvar dado:", error);
      setErro('Erro ao salvar dado. Tente novamente.');
    }
  }

  async function alterarDado(dado: Dado) {
    try {
      await atualizarDados(dado);
      setVisivel("tabela");
    } catch (error) {
      console.error("Erro ao atualizar dado:", error);
      setErro('Erro ao atualizar dado. Tente novamente.');
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
            {erro && <p className="mt-4 text-red-600 text-sm text-left">{erro}</p>}
          </>
        ) : (
          <FormularioDado
            dados={dado}
            dadosMudou={salvarOuAlterarDado}
            cancelado={() => setVisivel('tabela')}
            codigoUsuario={codigoUsuario}
          />
        )}
      </Layout>
    </div>
  );
}
