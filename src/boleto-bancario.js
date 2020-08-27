import { modulo10, modulo11Bancario } from './modulo';
import { convertToBoletoBancarioCodigoBarras } from './conversor';
import { clearMask } from './utils';

export function boletoBancarioCodigoBarras(codigo) {
  const cod = clearMask(codigo);
  if (!/^[0-9]{44}$/.test(cod)) return false;
  const DV = cod[4];
  const bloco = cod.substring(0, 4) + cod.substring(5);
  return modulo11Bancario(bloco) === Number(DV);
}

export function boletoBancarioLinhaDigitavel(codigo, validarBlocos = false) {
  const cod = clearMask(codigo);
  const blocos = [
    {
      num: cod.substring(0, 9),
      DV: cod.substring(9, 10),
    },
    {
      num: cod.substring(10, 20),
      DV: cod.substring(20, 21),
    },
    {
      num: cod.substring(21, 31),
      DV: cod.substring(31, 32),
    },
  ];
  let validBlocos = true;
  if (validarBlocos) {
    const isFirstBlock = cod.length >= 10;
    const isSecondBlock = cod.length >= 21;
    const isThirdBlock = cod.length >= 32;
    const isFourthBlock = cod.length >= 50;
    if (isFirstBlock) {
      const num = cod.substring(0, 9);
      const DV = cod.substring(9, 10);
      validBlocos = modulo10(num) === Number(DV);
    }

    if (isSecondBlock) {
      const num = cod.substring(10, 20);
      const DV = cod.substring(20, 21);
      validBlocos = validBlocos && modulo10(num) === Number(DV);
    }

    if (isThirdBlock) {
      const num = cod.substring(21, 31);
      const DV = cod.substring(31, 32);
      validBlocos = validBlocos && modulo10(num) === Number(DV);
    }

    if (isFourthBlock) {
      validBlocos = blocos.every(e => modulo10(e.num) === Number(e.DV))
       && boletoBancarioCodigoBarras(convertToBoletoBancarioCodigoBarras(cod));
    }
  } else {
    if (!/^[0-9]{47}$/.test(cod)) return false;
    validBlocos = boletoBancarioCodigoBarras(convertToBoletoBancarioCodigoBarras(cod));
  }
  return validBlocos;
}

export function boletoBancario(codigo, validarBlocos = false) {
  const cod = clearMask(codigo);
  if (cod.length === 44 && !validarBlocos) return boletoBancarioCodigoBarras(cod);
  return boletoBancarioLinhaDigitavel(codigo, validarBlocos);
}
