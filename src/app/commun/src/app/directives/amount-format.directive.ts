import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[cmm-di-amount-format]',
})

/**
 * Montos en formato usuario 123.456,78
 */
export class CmmAmountFormatDirective implements OnInit {

  /**
   * Input para indicar el maximo de caracteres posibles, contando los puntos y comas
   */
  @Input() maxAmout = 20;

  /**
   * Input para indicar si el input va a manejar decimales o no
   */
  @Input() decimal = true;

  /**
   * Input para indicar cual es el separador decimal que se desea usar
   */
  @Input() decimalSeparator = ',';

  /**
   * Input para indicar bajo que unidad monetaria funcionaria el monto indicado
   */
  @Input() currency: string = 'BS';

  /**
   * Input para indicar si se alcanzo el limite de un porcentaje
   */
  @Input() limitPercentage: boolean = false;

  /**
   * Regex utilizado por esta directiva. Acepta numeros, el separador de decimales indicado y las iniciales de la modenda indicada
   */
  regexStr = `[^0-9${this.decimalSeparator}]*$`;

  /**
   * Variable que guarda el separador de miles que se desea utilizar
   */
  currencyMils = new RegExp(`[\.]`, 'g');

  /**
   * Variable que guarda el texto correctamente foramteado
   */
  formatedValue: string = '';

  /**
   * Variable que indica si el texto del formualrio ya tienen el punto decimal
   */
  private hasDecimalPoint = true;

  /**
   * Variable indica si el texto ya alcanzo el maximo de decimales
   */
  private maxDecimals: boolean = false;

  /**
   * Variable que indica si se desea borrando un caracter del valor ingresado
   */
  private deleteFormat: boolean = false;

  /**
   * Arreglo de las teclas no alfanumericas a tener en cuenta, no aparecen aqui o esta comentado no funciona
   */
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    // 'ArrowLeft',
    // 'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  constructor(
    public el: ElementRef,
    public renderer: Renderer2
  ) {}

  ngOnInit(): void {

    // La iniciar la directiva lo primero es formatear el valor del input en el que se usa
    this.format(this.el.nativeElement.value);

  }

  /**
   * Listener que se activa cuando se presiona una tecla que produce un caracter
   * @param event valor ingresado
   * @returns
   */
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {

    // Retorna true o false si la tecla que se presiona corresponde a las opciones aceptadas por el regrex
    return new RegExp(this.regexStr).test(event.key);

  }

  /**
   * Listener que se activa cuando se pega un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('paste', ['$event']) onPaste(event: KeyboardEvent) {

    // Cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se copia un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('copy', ['$event']) blockCopy(event: KeyboardEvent) {

    // Cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se corta un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('cut', ['$event']) blockCut(event: KeyboardEvent) {

    // Cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se preciona el click del mouse sobre el input en cuestion
   * @param event valor ingresado
   */
  @HostListener('mousedown', ['$event']) onMouseDown(event: KeyboardEvent) {

    // Cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se mueve el mouse sobre el input en cuestion
   * @param event valor ingresado
   */
  @HostListener('mousemove', ['$event']) onMousemove(event: MouseEvent) {

    // Cancelamos la accion
    event.preventDefault();

  }


  /**
   * Listener que se activa cuando se soltar un dato que se arrastra desde otro sitio al input en cuestion
   */
  @HostListener('drop', ['$event']) drop() {
    return false;
  }

  /**
   * Listener que se activa cuando se presiona una tecla
   * @param event Valor ingresado
   * @returns
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): any {

    // Si se alcanzo el limite de porcentaje y se preciona algun otro numero
    if (
      this.limitPercentage &&
      event.key != '.' &&
      event.key != ',' &&
      event.key != 'Backspace'
    ) {

      // Cancelamos la accion
      event.preventDefault();

    };

    // Si se esta presinando la tecla de punto o coma
    if (event.key == '.' || event.key == ',') {

      // Cancelamos la accion
      event.preventDefault();

      // Revisamos si hay alguna coma en el monto
      this.updateDecimalPoint(this.el.nativeElement.value);

      // En caso de que no haya coma en el monto y no se exceda
      if(
        !this.hasDecimalPoint &&
        (this.el.nativeElement.value).length < this.maxAmout
      ){

        // Agregamos el semaparador de decimales
        this.el.nativeElement.value += this.decimalSeparator;

      }

      // En cualquier otro caso nos detenemos aqui
      else {
        return
      }

    };

    // Si se esta presionando la tecla de eliminar
    if (event.key == 'Backspace') {

      // Indico que se desea eliminar un numero del monto
      this.deleteFormat = true;

    }

    // En cualquier otro caso
    else {

      // Indico que no se desea eliminar un numero del monto
      this.deleteFormat = false;

    };

    // si la cantidad de caracteres en el input supero el maximo y no se esta queriendo borrar
    if(
      (this.el.nativeElement.value).length > this.maxAmout &&
      !this.deleteFormat
    ){

      // Cancelamos la accion
      event.preventDefault();

      // Nos detenemos aqui
      return

    };

    // Formateamos  el monto ingresado en el input
    this.format(this.el.nativeElement.value, true, event.key);

    // Evaluamos si la tecla o conjunto de teclas presionadas son permitidas
    if (
      this.navigationKeys.indexOf(event.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (event.key === 'a' && event.ctrlKey === true) || // Allow: Ctrl+A
      (event.key === 'c' && event.ctrlKey === true) || // Allow: Ctrl+C
      // (event.key === 'v' && event.ctrlKey === true) || // Allow: Ctrl+V
      (event.key === 'x' && event.ctrlKey === true) || // Allow: Ctrl+X
      (event.key === 'a' && event.metaKey === true) || // Allow: Cmd+A (Mac)
      (event.key === 'c' && event.metaKey === true) || // Allow: Cmd+C (Mac)
      // (event.key === 'v' && event.metaKey === true) || // Allow: Cmd+V (Mac)
      (event.key === 'x' && event.metaKey === true) || // Allow: Cmd+X (Mac)
      (this.decimal && event.key === this.decimalSeparator && !this.hasDecimalPoint) // Allow: only one decimal point
    ) {

      // Dejamos que ocurra el evento sin ningun problema
      return;

    };

    // En cualquier otro caso, si la tecla presionada no es valida
    if (event.key === ' ' || isNaN(Number(event.key)) || this.maxDecimals) {

      // Cancelamos la accion
      event.preventDefault();

    };

  }

  /**
   * Funcion para aplicar el formato correcto al campo
   * @param val   El contenido del campo que se desea formatear
   * @param add   Indica si se debe agregar un caractermas paso de colocar los separadores
   * @param key   Caracter que se desea agregar al campo
   * @returns     El contenido del campo con el formato correcto
   */
  format(val: string, add: boolean = false, key: string = '') {

    // Valido si hay alguna informacion que validar
    if (!val) {

      // Si no, marco que no se ha alcanzado el limite de decimales y termino aqui
      this.maxDecimals = false;

      return;

    };

    // Valido si se esta ingresando un nuevo parametro al string y si es un numero, simepre que no se este borrando
    if(key === ' ' || isNaN(Number(key)) && !this.deleteFormat){
      return
    };

    // Quito todo espacio vacio en el string
    val = val.replace(' ', '');

    // separar el numero entre entero y decimal
    let parts = val.split(',');

    // Si se coloco una coma
    if (parts.length > 1) {

      // si hay decimales entonces limitarlos segun la moneda
      if (parts[1]) {

        // Si la moneda seleccionada es Bitcoin o petro y tiene 8 o mas decimales
        if (
          (this.currency == 'BTC' && parts[1].length >= 8) ||
          (this.currency == 'PTR' && parts[1].length >= 8)
        ) {

          // Indicamos que se alcanzo el maximo de decimales
          this.maxDecimals = true;

        }

        // Si la moneda seleccionada es bolivales, Euros o Dolares y tiene 2 o mas decimales
        else if (
          (this.currency == 'BS' && parts[1].length >= 2) ||
          (this.currency == 'EUR' && parts[1].length >= 2) ||
          (this.currency == 'USD' && parts[1].length >= 2)
        ) {

          // Indicamos que se alcanzo el maximo de decimales
          this.maxDecimals = true;

        }

        // En cualquier otro caso, si el numero de decimales no alcanzo un limite
        else {

          // Indicamos que todavia no se a alcanzado el maximo de decimales
          this.maxDecimals = false;

        };

      }

      // En cualquier otro caso, si no hay decimales
      else {

        // Colocamos la coma si el usuario la presiona
        parts[1] = ',';

      };

    };

    // limpiar la parte entera de los sparadores de miles
    let val2 = parts[0].replace(this.currencyMils, '');

    // Cantidad de caracteres en el input al momento que evalua
    let cifras = val2.replace(/[a-z\^$,.*+?=!:;\-_/]/gi, '').length;

    // Si no se ha colocado una coma
    if(parts.length == 1){

      // Si debo agegar una nueva cifra y no estoy borrando, lo hago
      cifras = add && !this.deleteFormat ? cifras +1 : this.deleteFormat ? cifras -1 : cifras;

    }

    // Variable tendra el resultado final con los separadores de miles
    let result = '';

    // Itero por cada caracter del string
    for (let a = 0; a < val2.length; a++) {

      // Reptamos uno al contador de cifras por cada vuelta
      cifras -= 1;

      // si es un numero lo ingreso en el sting
      if (!isNaN(parseInt(val2.charAt(a)))) {
        result += val2.charAt(a);
      };

      // Se coloca el punto cuando corresponde
      if (cifras % 3 == 0 && cifras != 0) {
        result += '.';
      };

    };


    //? Logica que arma y junta el monto formateado

    // En caso de que se haya puesto una coma pero no decimales
    if (parts[1] && parts[1] == ',') {

      // Guardo como valor formateado la parte entrera formateada con la coma de la parte decimal
      this.formatedValue = result + parts[1];

    }

    // En caso de que se haya puesto una coma y numero desimales
    else if (parts[1] && parts[1] != ',') {

      // Guardo como valor formateado la parte entrera formateada con la parte decimal separada por una coma
      this.formatedValue = result + ',' + parts[1].replace(/[a-z\^$,.*+?=!:;\-_/]/gi, '');

    }

    // En cualquier otro caso, si no se coloco ningun decimal o coma
    else {

      // Guardo como valor formateado la parte entrera formateada
      this.formatedValue = result;

    };

    // Remplazo el valor del input por el texto formateado
    this.renderer.setProperty(this.el.nativeElement, 'value', this.formatedValue);

  }

  /**
   * Funcion para determinar si en el montro indicado existe el caracter indicado como separador de decimal
   * @param val Monto que se quiere revisar
   */
  updateDecimalPoint(val: any): void {

    // Si se indico que se desea trabajar con decimales
    if (this.decimal) {

      // Buscamos en el monto el caracter indicado como separador de montos e indicamos si se enconrto uno o no
      this.hasDecimalPoint = val.indexOf(this.decimalSeparator) > -1;

    };

  }

}
