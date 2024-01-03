import {
  AbstractControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

/**
 * Valida la mayoria de edad del usuario
 * @param control
 * @returns
 */
export function is18YO(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // Creo un arreglo con cada parte de la fecha separandolo por los "/"
    let parts: any = control.value.split('/');

    // Fecha que se ingreso en el formato correcto
    let SelDate = new Date(parts[2], parts[1] - 1, parts[0]);

    // Fecha de hoy
    let PastDate = new Date();

    // Cambiamos la fecha de hoy a la de hoy pero hace 18 años
    PastDate.setFullYear(PastDate.getFullYear() - 18);

    // Si la fecha ingresada es mayor que la fecha de hace 18 años
    if (!(SelDate <= PastDate)) {

      // Retornamos el fallo
      return { is18YO: true };

    };

  };

  // Retornamos el fallo
  return null;

}

/**
 * Valida que contenga al menos un numero
 * @param control
 * @returns
 */
export function matchNum(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que no tenga nignun numero o que las letras que tenga sean de las monedas permitidas
    if (
      !control.value.match(/\d/) ||
      control.value.substr(1, 4) === ' BT' ||
      control.value.substr(1, 3) === ' B' ||
      control.value.substr(1, 4) === ' PT' ||
      control.value.substr(1, 8) === ' USD IN' ||
      control.value.substr(1, 8) === ' USD NA' ||
      control.value.substr(1, 4) === ' EU'
    ) {

      // Retornamos el fallo
      return { num: true };

    };

  };

  // Retornamos el fallo
  return null;

}

/**
 * Valida que contenga al menos un caracter especial
 * @param control
 * @returns
 */
export function matchEspec(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga al menos un caracter especial de los indicados
    if (
      !control.value.match(
        /\!|\@|\#|\?|\$|\%|\^|\&|\*|\(|\)|\_|\-|\[|\]|\{|\}|\=|\+|\;|\'|\`|\.|\||\\|\<|\>|\~|\"|\:|\//
      )
    ) {

      // Retornamos el fallo
      return { espec: true };

    };

  };

  // Retornamos el fallo
  return null;

}

/**
 * Valida que no contenga dos caracteres
 * @param control
 * @returns
 */
export function match3Char(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga solo 3 carateres
    if (control.value.toLowerCase().match(/(.)\1\1/)) {

      // Retornamos el fallo
      return { threeChar: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que contenga al menos una minuscula
 * @param control
 * @returns
 */
export function matchMinus(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga alguno caracter alfabetico contando la ñ en minuscula
    if (!control.value.match(/[a-z\u00f1]/)) {

      // Retornamos el fallo
      return { minus: true };

    };

  };


  // No retornamos nada
  return null;

}

/**
 * Valida que contenga al menos una mayuscula
 * @param control
 * @returns
 */
export function matchMayus(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga alguno caracter alfabetico contando la Ñ en Mayuscula
    if (!control.value.match(/[A-Z\u00d1]/)) {

      // Retornamos el fallo
      return { mayus: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * validar que no contenga acentos
 * @param control
 * @returns
 */
export function matchAccent(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga caracteres alfaveticos con acentos
    if (control.value.match(/[à-ü]|[À-Ü]/)) {

      // Retornamos el fallo
      return { accent: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que no tenga espacios en blanco
 * @param control
 * @returns
 */
export function hasSpaces(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga al menos un espacio en blanco
    if (control.value.match(/\s/)) {

      // Retornamos el fallo
      return { spaces: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que la contraseña y la confirmacion de la contraseña sean iguales
 * @param control
 * @returns
 */
export function replaceFormat(control: AbstractControl) {

  // Guardamos el valor del control que se quiere validar
  let value = control.value;

  // Si el valor no es nulo
  if (value != null) {

    // Quitamso los puntos que pueda tener
    value.toString().replace('.', ''); ///    1000,001


    // Remplazamos las comas por los puntos
    value.toString().replace(',', '.'); ///    1000.001

  }

  // En caso de que el valor sea igual o menor que cero o sea nulo
  if (value <= 0 || value == null) {

    // Retornamos la fallo
    return { wrongFormat: true };

  }

  // No retornamos nada
  return null;

}

/**
 * Valida que el nombre de usuario no tenga mas de 1 caracter especia
 * @param control
 * @returns
 */
export function tooManySpcChar(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // Guardamos el valor del control que se quiere validar
    let value = control.value;

    // hacemos un arreglo con cada caracter del valor
    value.split('');

    // Creamos esta avariabel donde se gardara la cantidad de caracteres especiales
    let count = 0;

    // Itero por cada uno de caracteres del valor
    for (let i = 0; i < value.length; i++) {

      // Si el caracter que estamos viendo es uno de los indicados
      if (value[i].match(/[_.-]/)) {

        // Aumento el contador
        count++;

      };

      // Si la cuenta es mayor que 1
      if (count > 1) {

        // Retornamos la fallo
        return { manyChar: true };

      };

    };

  }

  // No retornamos nada
  return null;

}

/**
 * Valida que tenga al menos una letra
 * @param control
 * @returns
 */
export function mustHaveLetter(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor no tenga letras
    if (!control.value.match(/[a-zñA-ZÑ]/)) {

      // Retornamos la fallo
      return { letters: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que tenga UNa letra o un numero al inicio
 * @param control
 * @returns
 */
export function mustHaveLetterBegin(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor no tenga letras o numeros al inicio
    if (!control.value.match(/^(?![._-])[A-ZÑa-zñ\d][A-ZÑa-zñ\d\-._]*$/)) {

      // Retornamos la fallo
      return { specialCharBegin: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que tenga una letra o un numero al inicio
 * @param control
 * @returns
 */
export function charConsecutive(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor no tenga letras o numeros al inicio
    if (!control.value.match(/^(?!.*[\-._]{2})/)) {

      // Retornamos la fallo
      return { specialCharConsecutive: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que solo tenga numeros
 * @param control
 * @returns
 */
export function mustHaveNumbers(control: AbstractControl) {

  // Evaluo que la informacion a validar sea un string
  if (typeof control.value == 'string') {

    // En caso de que el valor tenga algo ams que no sea numeros
    if (!control.value.match(/^[0-9]+$/)) {

      // Retornamos la fallo
      return { numbers: true };

    };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que solo tenga numeros
 * @param validOptions Array de opciones validas
 * @returns
 */
export function autocompleteValidator(validOptions: any) {

  return (control: AbstractControl): { [key: string]: any } | null => {

    // Si El valor que se ingreso se encuentra en el listado indicado
    if (validOptions.indexOf(String(control.value)) !== -1) {

      // No retornamos nada
      return null; /* valid option selected */

    }

    // En otro caso retornamos la fallo
    return { valueNotExist: true };

  };

}

/**
 * Valida que solo tenga numeros
 * @param controlName Nombre del control que se quiere verificar
 * @param matchingControlName Control que se quiere verificar
 * @returns
 */
export function MustMatch(controlName: string, matchingControlName: string) {

  return (formGroup: FormGroup) => {

    // Guardamos un control con el nombre indicado
    const control = formGroup.controls[controlName];

    // Guardamos el control que se nos dio
    const matchingControl = formGroup.controls[matchingControlName];

    // Si en el control que se nos dio hay un error y no es el de esta validacion
    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {

      // No retornamos nada
      return;

    };

    // Si el valor del control que creamos es distinto al control ingresado
    if (control.value !== matchingControl.value) {

      // Seteamos el error
      matchingControl.setErrors({ mustMatch: true });

    }

    // Si el valor del control que creamos es igual al control ingresado
    else {

      // No le ponemos error
      matchingControl.setErrors(null);

    };

  };

}

/**
 * Valida si tiene el minimo de caracteres necesarios
 * @param minLength numero minimo de caracteres deseados
 * @returns
 */
export function minChars(minLength: number):ValidatorFn {

  return (control: AbstractControl): { [key: string]: any } | null =>{

    // Si el valor es menor que el minimo deseado
    if(control.value?.length < minLength){

      // Retornamos la fallo
      return {minLength: true}

    };

    // No retornamos nada
    return null

  }

}

/**
 * Valida si el usuario tiene los fondos suficientes
 * @param Balance Monto total en la cuenta del usuario
 * @param comissionQuantity comission que se va a cobrar (Ej: 0.1)
 * @param currency Moneda en la que se va a realizar la transaccion
 * @returns
 */
export function balanceValidator(
  Balance: any,
  comissionQuantity: any,
  currency: any,
) {
  return (control: AbstractControl): { [key: string]: any } | null => {

    // Guardamos el separador de miles con el que vamos a trabajar
    let currencyMils = new RegExp(`[\.]`, 'g');

    // Guardamos el valor que se nos ingreso
    let amount = control.value;

    // En caso de que el monto sea una variable de tipo string
    if (typeof amount == 'string') {

      // Eliminamos todos los puntos
      amount = control.value.replace(currencyMils, '');

      // Remplazamos las comas por puntos
      amount = amount.replaceAll(',', '.');

      // Gardamos el monto modificado como una variable de tipo numero
      amount = Number(amount);

    };

    // Variable para guardar los decimales
    let decimal;

    // Variabe para guardar la comission
    let comission;

    // Si la moneda que s enos indico es bitcoin
    if (currency == 3) {

      // Fijamos un numero de 8 decimales
      decimal = 8;

      // Calculamos la comision total segun lo que se nos indica
      comission = amount * comissionQuantity;

    }

    // Si la moneda indicada es cualquier otra distinta a 3
    else {

      // Fijamos un numero de 2 decimales
      decimal = 2;

      // Calculamos la comision total segun lo que se nos indica
      comission = amount * comissionQuantity;

    };

    // Calcualmos el total segun el balance que se nos indico que tiene el usuario y el monto con su comission
    const Total = Balance - amount - comission;

    // Si el total es mayor o igual que 0
    if (Number(Total.toFixed(decimal)) >= 0) {

      // No retornamos nada
      return null;

    };

    // En caulquier otro caso retornamos la fallo
    return { notEnoughFunds: true };

  };

}

/**
 * Valida si el monto es valido en bitcoins
 * @param control
 * @returns
 */
export function minimumValueBTC(control: AbstractControl) {

  // Guardamos el separador de miles con el que vamos a trabajar
  let currencyMils = new RegExp(`[\.]`, 'g');

  // Guardamos el valor que se nos ingreso
  let amount = control.value;

  // En caso de que el monto sea una variable de tipo string
  if (typeof amount == 'string') {

    // Eliminamos todos los puntos
    amount = control.value.replace(currencyMils, '');

    // Remplazamos las comas por puntos
    amount = amount.replaceAll(',', '.');

    // Gardamos el monto modificado como una variable de tipo numero
    amount = Number(amount);

  };

  // Si el monto es menor que el minimo permitido
  if (amount - 0.002 < 0) {

    // Retornamos la falla
    return { minimunValue: true };

  };

  // No retornamos nada
  return null;

}

/**
 * Valida que el monto debe cumplir con el minimo
 * @param control
 * @returns
 */
export function minimumValue(control: AbstractControl) {

  // Guardamos el separador de miles con el que vamos a trabajar
  let currencyMils = new RegExp(`[\.]`, 'g');

  // Guardamos el valor que se nos ingreso
  let amount = control.value;

  // En caso de que el monto sea una variable de tipo string
  if (typeof amount == 'string') {

    // Eliminamos todos los puntos
    amount = control.value.replace(currencyMils, '');

    // Remplazamos las comas por puntos
    amount = amount.replaceAll(',', '.');

    // Gardamos el monto modificado como una variable de tipo numero
    amount = Number(amount);

  };

  // Si el monto es menor que el minimo permitido
  if (amount == 0) {

    // Retornamos la falla
    return { minimunValue: true };

  };

  // No retornamos nada
  return null;

}

/**
 * Validadores normalmente usados en la contraseña
 */
export const passwordValidators: Validators[] = [
  Validators.required,
  Validators.maxLength(16),
  minChars(8),
  matchMinus,
  matchMayus,
  hasSpaces,
  matchNum,
  matchEspec,
  match3Char,
  matchAccent
]

//? Validators del input-file

/**
 * Validator para el tamaño del archivo
 * @param size tamaño permitido para el archivo (En mb)
 * @returns
 */
export function fileSize(size: number):ValidatorFn {

  // Guardamos tamaño maximo permitido
  let max_mb_size = size * 1024 * 1024;

  return (control: AbstractControl): { [key: string]: any } | null =>{

    // Si el archivo en cuestion pesa mas de lo acceptable
    if(control.value?.size > max_mb_size){

      // Retornamos la falla
      return {maxFileSize: true}

    };

    // En caulquier otro caso retornamos nada
    return null

  }

}

/**
 * Validator para el tipo de archivo del input
 * @param fileTypes tipos de extensión permitidas para el archivo
 * @example fileType('x-zip-compressed', 'jpeg')
 * @returns
 */
export function fileType(...fileTypes: string[]){
  return (control: AbstractControl): { [key: string]: any } | null => {

    //Obtengo la extensión o tipo de archivo del archivo
    let extension = control.value?.type?.split('/')[1];

    // Si la extensión no existe dentro de las extensiones válidas
    if(extension && !fileTypes.includes(extension)){

      // Retornamos la falla
      return {fileType: true}

    }

    return null

  }

}

//? Validators del input-select

/**
 * Validator que verifica que el valor escrito en el input-select coincida con una de las opciones seleccionadas
 * @param currentList Lista
 * @param optionKey
 * @returns
 */
export function validOption(currentList: any[], optionKey: string) {

  return (control: AbstractControl): { [key: string]: any } | null =>{

    // Obtengo el valor del input
    let currentValue = control.value?.toLowerCase();

    // Creo un arreglo en donde vamos a colocar las opciones de la lista suministrada
    let validOptions: string[] = [];

    // Itero por cada una de las opciones de la lista
    currentList.forEach(option => {

      // Lleno el listado con las opciones que pueden llegar a coincidir con el valor correcto
      validOptions.push(option[optionKey]?.toLowerCase());

    });

    // Si el valor ingresado existe dentro de este listado es porque es una opción válida
    if(currentValue && !validOptions.includes(currentValue)){

      // Retornamos la falla
      return {incorrectOption: true}

    };

    // No retornamos nada
    return null

  }

}
