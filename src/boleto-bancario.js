import { modulo10, modulo11 } from './modulo';
import { convertToBoletoBancarioCodigoBarras } from './conversor';
import { clearMask } from './utils';

export function boletoBancarioCodigoBarras(codigo) {
  const cod = clearMask(codigo);
  if (!/^[0-9]{44}$/.test(cod)) return false;
  const DV = cod[4];
  const bloco = cod.substring(0, 4) + cod.substring(5);
  return modulo11(bloco) === Number(DV);
}

export function boletoBancarioLinhaDigitavel(codigo, validarBlocos = false) {
  const cod = clearMask(codigo);
  if (!/^[0-9]{47}$/.test(cod)) return false;
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
  let validBlocos;
  if (validarBlocos) {
    if (cod.length === 10) {
      const num = cod.substring(0, 9);
      const DV = cod.substring(9, 10);
      validBlocos = modulo10(num) === Number(DV);
    }

    if (cod.length === 20) {
      const num = cod.substring(10, 20);
      const DV = cod.substring(20, 21);
      validBlocos = modulo10(num) === Number(DV);
    }

    if (cod.length === 30) {
      const num = cod.substring(21, 31);
      const DV = cod.substring(31, 32);
      validBlocos = modulo10(num) === Number(DV);
    }

    if (cod.length === 47) {
      validBlocos = blocos.every(e => modulo10(e.num) === Number(e.DV))
       && boletoBancarioCodigoBarras(convertToBoletoBancarioCodigoBarras(cod));
    }
  } else {
    validBlocos = boletoBancarioCodigoBarras(convertToBoletoBancarioCodigoBarras(cod));
  }

  return validBlocos;
}

export function boletoBancario(codigo, validarBlocos = false) {
  const cod = clearMask(codigo);
  if (cod.length === 44) return boletoBancarioCodigoBarras(cod);
  return boletoBancarioLinhaDigitavel(codigo, validarBlocos);
}
