import { stringParaEntradaDeData } from "@/utils/converters"

export default class DadosColetados {
  seq: number | null;
  codigo: number;
  dataHora: string;
  Tipo: number;
  Valor1: number;
  Valor2: number;
  EmCasa: boolean;

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
    this.codigo = codigoUsuario;
    this.dataHora = dataHora;
    this.Tipo = tipo;
    this.Valor1 = valor1;
    this.Valor2 = valor2;
    this.EmCasa = emCasa !== undefined ? emCasa : false;

  }

  static vazio(): DadosColetados {
    return new DadosColetados(null, 0, stringParaEntradaDeData(""), 0, 0.0, 0.0, false);
  }
}
