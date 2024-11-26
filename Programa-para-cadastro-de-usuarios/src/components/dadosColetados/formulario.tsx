import React, { useState } from "react";
import Entrada from "./entrada";
import Botao from "./botao";
import DadosColetados from "@/core/dadosColetados";
import { validarCampos } from "@/utils/validarCampos";

interface FormularioProps {
  dados: DadosColetados;
  dadosMudou?: (dados: DadosColetados) => void;
  cancelado?: () => void;
  codigoUsuario: number;
}

export default function FormularioDado(props: FormularioProps) {
  const seq = props.dados?.seq;
  const [codigo, setCodigo] = useState<number>(props.codigoUsuario);

  const [dataHora, setDataHora] = useState<string>(() => {
    if (!seq) {
      const now = new Date();
      return now.toISOString().slice(0, 19);
    } else {
      return props.dados?.dataHora || "";
    }
  });
  
  const [tipo, setTipo] = useState(props.dados?.Tipo || 1);
  const [valor1, setValor1] = useState(props.dados?.Valor1);
  const [valor2, setValor2] = useState(props.dados?.Valor2);
  const [emCasa, setEmCasa] = useState<boolean>(props.dados?.EmCasa || false);
  const [erros, setErros] = useState<any>({});

  const handleSalvarClick = () => {
    const now = new Date();
    const dataHoraAtual = now.toISOString().slice(0, 19);
    setDataHora(dataHoraAtual);

    const validationErrors = validarCampos(tipo, valor1, valor2, codigo, dataHoraAtual, emCasa);
    
    if (validationErrors) {
      setErros(validationErrors);
    } else {
      setErros({});
      
      console.log({
        seq, codigo, dataHora: dataHoraAtual, tipo, valor1, valor2, emCasa
      });
      
      const dadosParaSalvar = seq 
        ? new DadosColetados(seq, codigo, dataHoraAtual, tipo, valor1, valor2, emCasa) 
        : new DadosColetados(null, codigo, dataHoraAtual, tipo, valor1, valor2, emCasa);
  
      props.dadosMudou?.(dadosParaSalvar);
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
      <Entrada
        texto="Código"
        valor={codigo}
        somenteLeitura
        erro={erros.codigo}
      />

      <Entrada
        texto="Data e Hora"
        valor={dataHora}
        somenteLeitura
        erro={erros.dataHora}
      />

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
        <Entrada texto="Valor 1" valor={valor1} onChange={setValor1} tipo="number" erro={erros.valor1} />

        <Entrada
          texto="Valor 2"
          valor={tipo === 3 ? 0 : valor2}
          onChange={tipo === 3 ? () => { } : setValor2}
          tipo="number"
          somenteLeitura={tipo === 3}
          erro={erros.valor2}
        />

        <Entrada
          texto="Em Casa"
          tipo="checkbox"
          valor={emCasa}
          onChange={handleEmCasaChange}
          erro={erros.emCasa}
        />
      </div>

      <div className="flex justify-end mt-5">
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
