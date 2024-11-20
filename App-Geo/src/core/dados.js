import { stringParaEntradaDeData } from "../utils/converters";

export default class Dados {
  constructor(seq, codigo, dataHora, Tipo, Valor1, Valor2, EmCasa) {
    this.seq = seq;
    this.codigo = codigo;
    this.dataHora = dataHora;
    this.Tipo = Tipo;
    this.Valor1 = Valor1;
    this.Valor2 = Valor2;
    this.EmCasa = EmCasa;
  }

  static vazio() {
    return new Dados(null, 0, stringParaEntradaDeData(""), 0, 0.0, 0.0, false);
  }
}