/**
 * Este archivo contiene las variables exportadas con los mensajes de error que se van a usar en los inputs
 */
export const CmmErrorMessagesObject = {
  required: 'Este campo no puede estar vacío.',
  minLength: 'Este campo debe tener mínimo $ caracteres.',
  maxLength: 'Este campo debe tener máximo $ caracteres.',
  incorrectPattern: 'Debe introducir un $ válido',
  allowedValues: 'Este campo solo puede tener $',
  notAllowedValues: 'Este campo no puede tener $',
  incorrectOption: 'Debe seleccionar una opción válida',
  incorrectEmail: 'Debe introducir un correo electrónico válido.',
  mustHaveLetter: 'Este campo debe tener al menos una letra.',
  especialChar: 'Este campo solo puede tener un caracter especial.',
  serverMsg: '',
  minimunValue: 'Debe introducir una cantidad mayor a 0.',
  matchPassword: 'Las contraseñas deben ser iguales',
  maxFileSize: 'Debe seleccionar un archivo que pese máximo $',
  fileType: 'El tipo de archivo es incorrecto',
  matDatepickerFilter: 'La fecha seleccionada es inválida'
};

/**
 * Esta variable va a ser el simbolo a remplazar en todos los componentes para poner el minimo y maximo
 */
export const CmmReplaceStringIndicator = '$';
