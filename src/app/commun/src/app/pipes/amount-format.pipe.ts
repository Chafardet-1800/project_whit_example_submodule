import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cmm_p_amount_format' })

/**
 * Montos en formato usuario 123.456,78
 */
export class CmmAmountFormatPipe implements PipeTransform {

  /**
   * @description Formateo de montos para su correcta separacion de miles y decimales
   * @param amount Monto que se quere formatear
   * @param decimals numero de decimales deseados
   * @example 6543.21 => 6.543,21
   * @returns
   */
  transform(amount: number, decimals?: number): string {

    // Si no se indica un numero de decimales
    if (!decimals) {

      // Se colocan 2 por defecto
      decimals = 2;

    }

    // El monto indicado como texto
    const newAmount = amount.toString();

    // Indicamos el separador de decimales
    const decimalSeparator = ',';

    // Indicamos el separador de miles
    const ThousandsSeparator  = '.';

    // En esta variable se guardara el texto fomateado
    let result = '';

    // Monto formateado con comas
    let formartedAmount = '';

    // Variable que contiene el numero de puntos encontrados en el monto
    let pointFound: boolean = false;

    // Variable que indica el numero de decimales encontrados
    let decimalsFound = 0;

    // Iteramos por cada uno de los caracteres del monto
    for (let i = 0; i < newAmount.length; i++) {

      // Solo si el caracter del monto es un numero o un punto
      if (newAmount.charAt(i).match(/\.|\d/)) {

        // En caso de que el caracter no sea un punto y no se haya alcanzado el limite de decimales
        // o no se haya encontrado el punto
        if (!pointFound || (newAmount.charAt(i) != '.' && decimalsFound < decimals)) {


          // Si se encontro un punto
          if (pointFound) {

            // Agrego un decimal a la cuenta
            decimalsFound++;

          }

          // Si el caracter es el punto que se buscaba
          if (newAmount.charAt(i) == '.') {

            // Ingresamos una coma al monto formateado que estamos haciendo
            formartedAmount += ',';

          }

          // Si el caracter es un numero
          else {

            // Lo agregamos el monto formateado que estamos haciendo
            formartedAmount += newAmount.charAt(i);

          }
        }

        // Si el caracter es un punto
        if (newAmount.charAt(i) == '.') {

          // Indicamos que se encontro el punto
          pointFound = true;

        }
      }

    }

    // Separamos el monto formateado por el separador en 2 partes, enteros y decimales
    const parts = formartedAmount.split(decimalSeparator);

    // Guardamos los enteros del monto
    const integers = parts[0];

    // Cantidad de numeros que tiene la parte entera
    let numbers = integers.length;

    // Iteramos por cada uno de los numero que hay en la parte entera
    for (let a = 0; a < integers.length; a++) {

      // Restamos uno a la cantidad de numeros
      numbers -= 1;

      // Agregamos el caracter indicado al resultado final
      result += integers.charAt(a);

      // Si se cumplen las condiciones
      if (numbers % 3 == 0 && numbers != 0) {

        // Agregamos el separador de miles al resultado final
        result += ThousandsSeparator;

      }

    }

    // Si Hay 2 partes, la entera y decimal
    if (parts.length > 1) {

      // Agregamos el separador de decimales y la parte decimal
      result += decimalSeparator + parts[1];

    }

    // Retornamos el resultado final del todo este proceso
    return result;

  }
}
