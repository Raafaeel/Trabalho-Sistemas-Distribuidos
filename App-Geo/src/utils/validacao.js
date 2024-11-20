export function validarCampos(
    tipo,
    valor1,
    valor2,
    codigo,
    dataHora,
    emCasa
  ) {
    const erros = {};
  
    if (!codigo) erros.codigo = 'Código é obrigatório.';
    if (!dataHora) erros.dataHora = 'Data e hora são obrigatórios.';
    if (tipo === undefined) erros.tipo = 'Tipo é obrigatório.';
    if (valor1 === undefined || valor1 <= 0) erros.valor1 = 'Valor 1 é obrigatório e deve ser maior que 0.';
    if (tipo !== 3 && (valor2 === undefined || valor2 <= 0)) erros.valor2 = 'Valor 2 é obrigatório e deve ser maior que 0.';
    if (emCasa === undefined) erros.emCasa = 'Em Casa é obrigatório.';
  
    const validaValor = (valor, min, max, nome) => {
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
  