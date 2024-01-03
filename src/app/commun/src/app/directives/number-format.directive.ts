import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[cmm-di-number-format]',
})

/**
 * Solo numeros, ni comas ni puntos, 123456789
 */
export class CmmNumberFormatDirective implements OnInit {

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
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];

  /**
   * Regex utilizado por esta directiva. Acepta letras, mayusculas y minusculas, y numeros
   */
  regexStr = '^[0-9,]+$';

  /**
   * Indica si esta directiva tiene permiso de actuar
   */
  @Input() onlyNumber: boolean = true

  /**
   * Input para indicar si se quiere que se pueda copiar los datos del input
   */
  @Input() allowCopy: boolean = false;

  /**
   * Input para indicar si se quiere que se pueda cortar los datos del input
   */
  @Input() allowCut: boolean = false;

  /**
   * Input para indicar si se quiere que se pueda hacer click en el campo del input
   */
  @Input() allowClicWithMouse: boolean = false;

  constructor(
    public el: ElementRef,
    public renderer: Renderer2
  ) {}

  ngOnInit(): void {

    // La iniciar la directiva lo primero es formatear el valor del input en el que se usa
    this.format(this.el.nativeElement.value);

  }

  /**
   * Listener que se activa cuando se ingresa un dato al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('input', ['$event.target.value']) onInput(event: string) {

    // Formateamos el valor ingresado
    this.format(event);

  }

  /**
   * Listener que se activa cuando se presiona una tecla que produce un caracter
   * @param event valor ingresado
   * @returns
   */
  @HostListener('keypress', ['$event']) onKeyPress(event: any) {

    // En caso de que no se quiera implementar el formateo de la directiva nos detenemos aqui
    if(!this.onlyNumber){
      return
    }

    // Retorna true o false si la tecla que se presiona corresponde a las opciones aceptadas por el regrex
    return new RegExp(this.regexStr).test(event.key);

  }

  /**
   * Listener que se activa cuando se pega un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {

    // Guardamos el valor que se quiere pegar en el input
    let pasteValue = event.clipboardData?.getData('text/plain')

    // Si el valor no es un numero y esta activa la directiva
    if (pasteValue === ' ' || (isNaN(Number(pasteValue)) && this.onlyNumber)) {

      // Cancelamos la accion
      event.preventDefault();

    }

  }

  /**
   * Listener que se activa cuando se copia un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('copy', ['$event']) blockCopy(event: KeyboardEvent) {

    // Si esta permitido que se copie informacion del input, no hacemos nada
    if(this.allowCopy){
      return
    };

    // En cualquier otro caso cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se corta un dato desde el portapapeles al input en cuestion
   * @param event valor ingresado
   */
  @HostListener('cut', ['$event']) blockCut(event: KeyboardEvent) {

    // Si esta permitido que se corte informacion del input, no hacemos nada
    if(this.allowCut){
      return
    };

    // En cualquier otro caso cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se preciona el click del mouse sobre el input en cuestion
   * @param event valor ingresado
   */
  @HostListener('mousedown', ['$event']) onMouseDown(event: KeyboardEvent) {

    // Si esta permitido que se pueda hacer click en el campo del input, no hacemos nada
    if(this.allowClicWithMouse || this.allowCopy || this.allowCut){
      return
    };

    // En cualquier otro caso cancelamos la accion
    event.preventDefault();

  }

  /**
   * Listener que se activa cuando se mueve el mouse sobre el input en cuestion
   * @param event valor ingresado
   */
  @HostListener('mousemove', ['$event']) onMousemove(event: MouseEvent) {

    // Si esta permitido que se copie informacion del input, no hacemos nada
    if(this.allowCopy || this.allowCut){
      return
    };

    // En cualquier otro caso cancelamos la accion
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

    // En caso de que no se quiera implementar el formateo de la directiva nos detenemos aqui
    if(!this.onlyNumber){
      return
    };

    // Evaluamos si la tecla o conjunto de teclas presionadas son permitidas
    if (
      this.navigationKeys.indexOf(event.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (event.key === 'a' && event.ctrlKey === true) || // Allow: Ctrl+A
      (event.key === 'c' && event.ctrlKey === true) || // Allow: Ctrl+C
      (event.key === 'v' && event.ctrlKey === true) || // Allow: Ctrl+V
      (event.key === 'x' && event.ctrlKey === true) || // Allow: Ctrl+X
      (event.key === 'a' && event.metaKey === true) || // Allow: Cmd+A (Mac)
      (event.key === 'c' && event.metaKey === true) || // Allow: Cmd+C (Mac)
      // (event.key === 'v' && event.metaKey === true) || // Allow: Cmd+V (Mac)
      (event.key === 'x' && event.metaKey === true) // Allow: Cmd+X (Mac)
      // (event.key === '.') ||
      // (event.key === ',')
    ) {

      // Dejamos que ocurra el evento sin ningun problema
      return;

    };

    // En cualquier otro caso, si la tecla presionada no es valida
    if (event.key === ' ' || isNaN(Number(event.key))) {

      // Cancelamos la accion
      event.preventDefault();

    };

  }

  format(val: string) {

    // Si no es una valor valido nos detenemos
    if (!val) {
      return;
    }

    // Remplazo el valor del input por el texto formateado
    this.renderer.setProperty(this.el.nativeElement, 'value', val);

  }
}
