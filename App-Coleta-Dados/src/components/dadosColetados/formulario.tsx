import React, { useState } from "react";
import Entrada from "./entrada";
import Botao from "./botao";
import DadosColetados from "@/core/dadosColetados";

interface FormularioProps {
  dados: DadosColetados;
  dadosMudou?: (dados: DadosColetados) => void;
  cancelado?: () => void;
}

export default function Formulario(props: FormularioProps) {
  const seq = props.dados?.seq;
  const [codigo, setCodigo] = useState(props.dados?.codigoUsuario);
  const [dataHora, setDataHora] = useState<string>(new Date().toLocaleString('sv-SE').slice(0, 16));  // Data e hora local no formato correto
  const [tipo, setTipo] = useState(props.dados?.tipo);
  const [valor1, setValor1] = useState(props.dados?.valor1);
  const [valor2, setValor2] = useState(props.dados?.valor2);
  const [emCasa, setEmCasa] = useState<boolean>(false);

  const [mostrarAviso, setMostrarAviso] = useState(false);

  const validarCampos = () => {
    if (tipo === 1) {
      if (valor1 < 0 || valor1 > 300 || valor2 < 0 || valor2 > 300) {
        setMostrarAviso(true);
        return false;
      }
      if (!(valor1 >= 110 && valor1 <= 129) || !(valor2 >= 70 && valor2 <= 84)) {
        setMostrarAviso(true);
        return false;
      }
    } else if (tipo === 2) {
      if (valor1 < 0 || valor1 > 100 || valor2 < 0 || valor2 > 200) {
        setMostrarAviso(true);
        return false;
      }
      if (!(valor1 >= 95 && valor1 <= 100) || !(valor2 >= 50 && valor2 <= 100)) {
        setMostrarAviso(true);
        return false;
      }
    } else if (tipo === 3) {
      if (valor1 < 30 || valor1 > 45) {
        setMostrarAviso(true);
        return false;
      }
      if (!(valor1 >= 36.0 && valor1 <= 37.5)) {
        setMostrarAviso(true);
        return false;
      }
      if (valor2 !== undefined) {
        setMostrarAviso(true);
        return false;
      }
    }

    if (!codigo || !dataHora || tipo === undefined || valor1 === undefined || valor2 === undefined || emCasa === undefined) {
      setMostrarAviso(true);
      return false;
    }

    setMostrarAviso(false);
    return true;
  };

  const handleSalvarClick = () => {
    if (validarCampos()) {
      setMostrarAviso(false);
      props.dadosMudou?.(new DadosColetados(seq, codigo, dataHora, tipo, valor1, valor2, emCasa));
    }
  };

  const handleEmCasaChange = (checked: boolean) => {
    setEmCasa(checked);
  };

  return (
    <div>
      {seq ? (
        <Entrada texto="Seq" valor={seq} somenteLeitura />
      ) : null}
      <Entrada texto="Código" valor={codigo} onChange={setCodigo} somenteLeitura />

      <Entrada texto="Data e Hora" valor={dataHora} tipo="datetime-local" somenteLeitura />

      <Entrada
        texto="Tipo"
        valor={tipo}
        onChange={setTipo}
        tipo="select"
        opcoes={[
          { label: 'Pressão Arterial', value: 1 },
          { label: 'SPO2', value: 2 },
          { label: 'Temperatura Corporal', value: 3 },
        ]}
      />

      <div className="flex flex-wrap space-x-4 w-full">
        <Entrada texto="Valor 1" valor={valor1} onChange={setValor1} tipo="number" />
        <Entrada
          texto="Valor 2"
          valor={tipo === 3 ? 0 : valor2}
          onChange={tipo === 3 ? () => {} : setValor2}
          tipo="number"
          somenteLeitura={tipo === 3}
        />
        <Entrada
          texto="Em Casa"
          tipo="checkbox"
          valor={emCasa}
          onChange={handleEmCasaChange}
        />
      </div>

      <div className="flex justify-end mt-5">
        {mostrarAviso && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded mr-3">
            Preencha todos os campos corretamente antes de salvar.
          </div>
        )}
        <Botao
          className="mr-3"
          cor="bg-blue-600"
          onClick={handleSalvarClick}
        >
          {seq ? "Alterar" : "Salvar"}
        </Botao>
        <Botao
          cor="bg-gray-500"
          onClick={props.cancelado}
        >
          Cancelar
        </Botao>
      </div>
    </div>
  );
}