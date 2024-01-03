import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cmm_p_sanitize_amount_format',
})
export class CmmSanitizeAmountFormatPipe implements PipeTransform {

  /**
   * @description Formatea los montos en formato para backend
   * @param amount Monto a formatear
   * @example 12.000,89 => 12000.89
   */
  transform(amount: string | any): number | undefined {

    // Si no se indica ningun monto no se hace nada
    if (!amount) {
      return;
    }

    // Guardamos el monto como string
    let val = amount.toString();

    // Seteamos el separador de mil
    let currencyMils = new RegExp(`[\.]`, 'g');

    // Retonamos el monto sin los separadores de miles y con punto en lugar de coma
    return val.replace(currencyMils, '').replace(',', '.');

  }
}
