interface Erros {
  codigo?: string;
  dataHora?: string;
  tipo?: string;
  valor1?: string;
  valor2?: string;
  emCasa?: string;
}

export function validarCampos(
  tipo: number | undefined,
  valor1: number | undefined,
  valor2: number | undefined,
  codigo: number | undefined,
  dataHora: string | undefined,
  emCasa: boolean | undefined
): Erros | null {
  const erros: Erros = {};

  if (!codigo) erros.codigo = 'Código é obrigatório.';
  if (!dataHora) erros.dataHora = 'Data e hora são obrigatórios.';
  if (tipo === undefined) erros.tipo = 'Tipo é obrigatório.';
  if (valor1 === undefined || valor1 <= 0) erros.valor1 = 'Valor 1 é obrigatório e deve ser maior que 0.';
  if (tipo !== 3 && (valor2 === undefined || valor2 <= 0)) erros.valor2 = 'Valor 2 é obrigatório e deve ser maior que 0.';
  if (emCasa === undefined) erros.emCasa = 'Em Casa é obrigatório.';

  const validaValor = (valor: number | undefined, min: number, max: number, nome: string) => {
    if (valor === undefined || valor < min || valor > max) {
      erros[nome] = `${nome} deve estar entre ${min} e ${max}.`;
    }
  };

  // Tipo 1 - Pressão Arterial
  if (tipo === 1) {
    validaValor(valor1, 0, 300, 'Valor 1');
    validaValor(valor2, 0, 300, 'Valor 2');
  } 
  // Tipo 2 - SPO2 e Frequência Cardíaca
  else if (tipo === 2) {
    validaValor(valor1, 0, 100, 'Valor 1');
    validaValor(valor2, 0, 200, 'Valor 2');
  } 
  // Tipo 3 - Temperatura Corporal
  else if (tipo === 3) {
    validaValor(valor1, 30, 45, 'Valor 1');
  }

  return Object.keys(erros).length > 0 ? erros : null;
}
