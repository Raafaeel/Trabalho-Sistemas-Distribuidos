import { stringParaEntradaDeData } from "@/utils/converters"

export default class DadosColetados {
  seq: number | null;
  codigoUsuario: number;
  dataHora: string;
  tipo: number;
  valor1: number;
  valor2: number;
  emCasa: boolean;

  constructor(
    seq: number | null,
    codigoUsuario: number,
    dataHora: string,
    tipo: number,
    valor1: number,
    valor2: number,
    emCasa: boolean
  ) {
    this.seq = seq;
    this.codigoUsuario = codigoUsuario;
    this.dataHora = dataHora;
    this.tipo = tipo;
    this.valor1 = valor1;
    this.valor2 = valor2;
    this.emCasa = emCasa;
  }

  static vazio(): DadosColetados {
    return new DadosColetados(null, 0, stringParaEntradaDeData(""), 0, 0.0, 0.0, false);
  }
}
