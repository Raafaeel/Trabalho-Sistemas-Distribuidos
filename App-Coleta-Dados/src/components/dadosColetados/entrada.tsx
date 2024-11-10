import React from "react";

interface EntradaProps {
  tipo?: 'text' | 'number' | 'date' | "datetime-local" | "checkbox" | "select";
  texto: string;
  valor: any;
  somenteLeitura?: boolean;
  onChange?: (valor: any) => void;
  opcoes?: { label: string; value: number }[];
}

export default function Entrada(props: EntradaProps) {
  return (
    <div className="flex flex-col mt-3">
      <label className="mb-2 text-lg font-semibold">{props.texto}</label>

      {props.tipo === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={props.valor}
            onChange={(e) => props.onChange?.(e.target.checked)}
            className="hidden"
            disabled={props.somenteLeitura}
          />
          <div
            className={`w-6 h-6 border-2 border-blue-500 rounded-full flex items-center justify-center mr-2 relative cursor-pointer ${props.somenteLeitura ? 'cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!props.somenteLeitura) {
                props.onChange?.(!props.valor);
              }
            }}
          >
            <div className={`w-4 h-4 rounded-full bg-blue-500 transition-all transform ${props.valor ? 'scale-100' : 'scale-0'}`} />
          </div>
          <label className="text-gray-700">{props.texto}</label>
        </div>
      ) : props.tipo === 'select' && props.opcoes ? (
        <select
          value={props.valor}
          onChange={(e) => props.onChange?.(Number(e.target.value))}  // Converte para número
          className={`border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2 transition-all ${props.somenteLeitura ? 'bg-gray-200 cursor-not-allowed' : 'bg-white focus:bg-white'}`}
          disabled={props.somenteLeitura}
        >
          {props.opcoes.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={props.tipo ?? 'text'}
          value={props.valor}
          onChange={(e) => {
            if (!props.somenteLeitura) {
              const valor = props.tipo === 'number' ? Number(e.target.value) : e.target.value;
              props.onChange?.(valor);
            }
          }}
          readOnly={props.somenteLeitura}
          className={`border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2 transition-all ${props.somenteLeitura ? 'bg-gray-200 cursor-not-allowed' : 'bg-white focus:bg-white'}`}
        />
      )}
    </div>
  );
}
