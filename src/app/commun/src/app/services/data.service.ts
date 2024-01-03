'use strict';

import { DatePipe } from '@angular/common';
import { HostListener, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, timer } from 'rxjs';
import { repeat, takeUntil } from 'rxjs/operators';
import { authTokenVariable, privilegesVariable } from '../data/constants/local-storage-variables';
import { CmmActionListModel, CmmSideNavModel } from '../data/privileges/models/privileges.models';
import { CmmStatusDictionaryModel, CmmStatusModel, CmmStatusTypeGroupsModel } from '../data/tables/models/tables.model';

@Injectable()
export class CmmDataService {

  /**
   * Para abortar todas las solicitudes de red
   */
  private pendingHTTPRequests$ = new Subject<void>();

  /**
   * Variable que sirve de temporizador
   */
  timeLeft: number | any;

  /**
   * Variable que indica si mostrar o no el contador del tiempo
   */
  showTimer: boolean = false;

  /**
   * Variable usada para indicar cuanto tiempo queda en el contador
   */
  subscribeTimer: number = 0;

  /**
   * Variable que sirve para detener el contador
   */
  private readonly _stop = new Subject<void>();

  /**
   * Variable que sirve para indicar cuando empezar el proceso del contador
   */
  private readonly _start = new Subject<void>();

  //? Lógica de eventos entre ventanas

  /**
   * Mensaje recibido de la ventana padre
   */
  $receivedMessage: BehaviorSubject<any> = new BehaviorSubject(null)

  /**
   * Listener de mensajes en la ventana para manejo de acciones del wigget
   */
  @HostListener('window:message', ['$event'])
  onWindowMessage(event: any) {

    // Se setea el mensaje que se oyo en la variable indicada
    this.$receivedMessage.next(event.data);

    // Se crea un observable del mensaje
    this.$receivedMessage.asObservable();

  }


  constructor(
    private date: DatePipe,
    private router: Router
  ) {}

  //? Lógica de formateo de data

  /**
   * Funcion para tranformar un texto a formato base64
   * @param str Texto a transformar
   * @returns Texto en formato base64
   */
  CmmB64EncodeUnicode(str: string) {

    return window.btoa(

      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {

        return String.fromCharCode(parseInt(p1, 16));

      })

    );

  }

  /**
   * Funcion para tranformar un texto del formato base64 a formato normal
   * @param str Texto en base64 a transformar
   * @returns Texto en formato normal
   */
  CmmB64DecodeUnicode(str: string) {

    return decodeURIComponent(

      Array.prototype.map.call(window.atob(str), function (c) {

          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);

        })
        .join('')

    );

  }

  // transforma el formato de decimales con coma y separadores de miles (El que viene del input-amount) a un formato sin separadores y punto por coma

  //? Lógica de formateo de montos

  /**
   * Transforma los montos en formato para backend
   * @param amount
   * @example 12.000,89 => 12000.89
   * @returns
   */
  CmmAmountBackendFormat(amount: String) {

    // En caso de que el monto tenga algun punto
    if (amount.match(/([.])/)) {

      // Separo el monto por la parte entera y la decimal
      let numSplit = amount.split('.');

      // Si la parte entera tiene menos de 3 numeros
      if (numSplit[1].length < 3) {

        // Unimos las dos partes del monto separandolas con una coma
        amount = numSplit.join(',');

      }

      // Si la parte entera tiene mas de 3 numeros
      else {

        // Unimos las dos partes del monto sin separacion
        amount = numSplit.join('');

      }

    }

    // Separamos el monto por cada coma que tenga
    let number = amount.split(',');

    // Retornamos el monto unido por un punto y con 2 numero de decimal si no los tiene
    return parseFloat(number.join('.')).toFixed(2);

  }

  /**
   * Servicio de formateo de datos para su correcta separacion de miles y decimales
   * @param amount Monto que se quere formatear
   * @param currency Moneda segun la que se va a hacer el formateo
   * @example 6543.21 => 6.543,21
   * @returns
   */
  CmmAmountUserFormat(amount: any, currency?: string) {

    // Gurdamos el monto a transformar
    let twoDecimalsNumber = amount;

    // si el monto tiene uno o mas puntos
    if (amount.toString().indexOf('.') > 0) {

      // Guardamos el monto sin los puntos como separador
      twoDecimalsNumber = amount
        .toString()
        .slice(0, amount.toString().indexOf('.') + 3);

    }

    // Manejamos distintos tipos de caso d ela respuesta de currency
    switch (currency) {

      // En caso de bitcoin
      case '3':
      case 'BTC':

        // Retornamos el monto con un formato de 8 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        }).format(amount);

        break;

      // En caso de euros
      case '5':
      case 'EUR':

        // Retornamos el monto con un formato de 8 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);

        break;

      case '1':

        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);

        break;

      // En caso de dolares
      case '6':
      case 'USD':

        // Retornamos el monto con un formato de 2 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(twoDecimalsNumber);

        break;

      // En caso de bolivares
      case '2':
      case 'BS':

        // Retornamos el monto con un formato de 2 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(twoDecimalsNumber);

        break;

      // En caso de petros
      case '4':
      case 'PTR':

        // Retornamos el monto con un formato de 8 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 8,
          maximumFractionDigits: 8,
        }).format(amount);

        break;

      // En cualquier caso que no se indique una moneda
      default:

        // Retornamos el monto con un formato de 2 cifras decimales
        return new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);

        break;
    }
  }

  //*! Verificar estado de la sesión para redirigir fuera de la pagina (Revisar, puede servirnos)
  /**
   * Chequea si el usuario está logueado realmente
   * @returns
   */
  CmmCheckLoginState() {

    //  si NO esta logeado, lo mando a login
    if (!sessionStorage.getItem(authTokenVariable)) {
      this.router.navigate(['auth']);
      return false;
    }

    // si esta logeado, es decir en el ls tiene loggedin true y Auth con su token
    else {

      // Si tiene auth y tiene authTempPassword
      if (
        sessionStorage.getItem(authTokenVariable) != '' &&
        sessionStorage.getItem('AuthTempPassword')
      ) {

        // Lo mando a cambiar password
        this.router.navigate(['/profile/security/updatepassword']);

        return false;

      }

      // Si tiene auth y tiene authTempUser
      else if (
        sessionStorage.getItem(authTokenVariable) != '' &&
        sessionStorage.getItem('AuthTempUser')
      ) {

        // Lo mando a cambiar user
        this.router.navigate(['/profile/security/updateuser']);

        return false;

      }

    }

    return true;

  }

  /////////////////////////////////////////////////////////////
  ///////////// FUNCION DE TEMPORIZADOR

  //? Lógica de temporizadores
  /**
   * Funcion para iniciar el temporizador de la session
   */
  CmmStartSessionTimer(): any {

    // Marcamos el inicio del proceso
    this._start.next();

  }

  /**
   * Funcion para  detener el temporizador
   */
  CmmStopSessionTimer(): any {

    // Indicamos que no debe mostrarse el temporizador
    this.showTimer = false;

    // Coloco el tiempo del temporizador en cero
    this.subscribeTimer = 0;

    // Termino el proceso del temporizador
    this._stop.next();

  }

  /**
   * Funcion para setear el tiempo del temporizador
   * @param timeLeft
   */
  CmmObservableTimer(timeLeft: number) {

    // Colocamos el tiempo indicado como tiempo limite
    this.timeLeft = timeLeft;

    // Indicamos que se debe mostrar el temporizador
    this.showTimer = true;

    // Inicio el timer para que me incremente un numero cada segundo
    const source = timer(1000, 1000);

    // Me subscribo al proceso para poder realizar la funcion
    const abc = source.pipe(

      // El proceso continuara hasat que se indique el final del proceso
      takeUntil(this._stop),

      // no inicio el proceso hasta que de me indique
      repeat({ delay: () => this._start })

    ).subscribe( (val) => {

      // Coloco el tiempo calculado en el temporizador
      this.subscribeTimer = this.timeLeft - val;

      // Si el tiempo calculado es cero
      if (this.subscribeTimer == 0) {

        // Detengo el proceso
        abc.unsubscribe();

        // Indico que no se muestre el temporizador
        this.showTimer = false;

      }

    });

  }

  //? Lógica de formateo de fechas

  /**
   * Formatea la fecha en cualquier formato
   * @param currentDate Fecha que estoy pasando
   * @param dateFormat Formato en el que se retornará la fecha
   * @param currentDateInvalidFormat Indica si la fecha viene en formato DD/MM/YYYY que es un formato inválido para trabajar
   * @kind dmy (Día, mes, año)
   * @kind mdy (mes, día, año)
   * @kind ymd (año, mes, día)
   * @kind dmyh (Día, mes, año, hora)
   * @kind mdyh (mes, día, año, hora)
   * @example  let date: any = '2023-05-24T20:37:32.040Z'

    date = new Date()

    console.log(this.dataService.cmmFormatDate(date, 'mdyh'))

    //* Como poner fecha con un mes menos

    date = new Date()

    let newDate: any = new Date(date.getFullYear(),date.getMonth()-1,date.getDate())

    console.log(this.dataService.cmmFormatDate(newDate, 'dmyh'))
   * @returns
   */
  cmmFormatDate(currentDate: string, dateFormat?: 'dmy' | 'mdy' | 'ymd' | 'dmyh' | 'mdyh', currentDateInvalidFormat?: boolean) {

    //* Verifico si la fecha viene en el formato Number/Number/Number o formato corto
    if(String(currentDate).includes('/')) {

      //* Separo todas las partes de la fecha
      let dateParts = currentDate.split('/')

      //* Verifico que la fecha venga en formato YYYY/MM/DD o MM/DD/YYYY
      if(Number(dateParts[0]) > 12 || currentDateInvalidFormat) {

        //* En caso de que nos hayan pasado una fecha en formato DD/MM/YYYY la convierto a formato YYYY/MM/DD para que se pueda convertir en una fecha válida
        currentDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
      }

    }

    //* Obtengo todas las partes de la fecha
    
    let date = new Date(currentDate)

    let day = JSON.stringify(date.getDate())
    let month = JSON.stringify(date.getMonth() + 1);
    let year = JSON.stringify(date.getFullYear())

    //* Añado '0' al día o mes en caso de que no lo tenga
    
    if (day.length == 1) {
      day = '0' + day;
    }

    if (month.length == 1) {
      month = '0' + month;
    }

    //* Array que contiene las partes de la fecha
    let dateArray: any[] = []

    //* Fecha que se retornará finalmente
    let newDate: any

    //* Acomodo las partes de la fecha dependiendo del formato escogido
    switch (dateFormat) {
      case 'dmy':
        //* Junto todas las partes de la fecha en el array
        dateArray = [day,month,year]
        break;
      case 'mdy':
        //* Junto todas las partes de la fecha en el array
        dateArray = [month,day,year]
        break;
      case 'ymd':
        //* Junto todas las partes de la fecha en el array
        dateArray = [year, month,day]
        break;
      case 'dmyh':
        //* Transformo la fecha directamente y obtengo la hora
        newDate = this.date.transform(date, 'dd/MM/yyyy HH:mm a','ES');
        //* Junto todas las partes de la fecha en el array
        break;
      case 'mdyh':
        //* Transformo la fecha directamente y obtengo la hora
        newDate = this.date.transform(date, 'MM/dd/yyyy HH:mm a');
        break;
      default:
        //* Junto todas las partes de la fecha en el array
        dateArray = [day,month,year]
    }

    //* Si la fecha no requiere hora la retorno como array
    if(dateFormat != 'dmyh' && dateFormat != 'mdyh') {
      newDate = [...dateArray].join('/')
    }

    //* Retorno la fecha transformada
    return newDate
  }

  //? Lógica de evaluación de acciones

  /**
   * Servicio para ver si se tiene o no el privilegio
   * @param key Key de la accion que se quiere buscar
   * @returns Un booleano dependiendo de si tiene o no la accion indicada
   */
  CmmVerificationPrivileges(key: string) {

    //* Lógica para que no hagan falta privilegios en caso de que me los estén pasando
    if (key) {

      try {

        // Retornamos false en caso de que no tenga privilegios en el ls
        if (!sessionStorage.getItem(privilegesVariable)) {
          return false;
        }

        // retornamos false en caso de que los privilegios en ls no sean validos
        if (
          !sessionStorage.getItem(privilegesVariable)!.length ||
          sessionStorage.getItem(privilegesVariable) == 'undefined' ||
          sessionStorage.getItem(privilegesVariable) == ''
        ) {
          return false;
        }

        // Guardamos arreglo de modulos del usuarios que se encuentra en el Ss
        const privilegesModules: CmmSideNavModel[] = JSON.parse(sessionStorage.getItem(privilegesVariable)!);

        // Creamos esta variable en la que vamos a guardar las acciones del usuario
        let currentActions: CmmActionListModel[] = [];

        // Itero por cada uno de los modulos del usuario
        privilegesModules.forEach(privilege => {

          // Guardo las acciones de cada modulo en la variable indicada
          currentActions.push(...privilege.actions);

        });

        // Retornamos true o false dependiendo de si el usuario tiene el requerimiento que se nos indico
        return currentActions.filter(action => action.key == key).length > 0

      }

      // Si hay algun error al momento de evaluar las acciones o modulos retorno false
      catch (error) {
        return false
      }

    }

    // Si no se indica ninguna accion retorno false
    else {
      return false
    }

  }

  /////////////////////////////////////////////////////////////
  ///////////// FUNCIONES PARA CANCELAR SOLICITUDES DE RED

  //? Lógica de cancelación de APIs

  /**
   * Funcion para cancelar calquier api que este en proceso
   */
  CmmCancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  /**
   * Funcion que retorna el observable que indica cuando cancelar todos los procesos
   */
  CmmOnCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  //? Lógica de errores de input y formulario

  /**
   * Setea el mensaje de error de API en los formControls correspondientes
   * @param errorObject Es el objeto que contiene los errores de cada campo o formControl
   * @param form Es el form al que le vamos a asignar los errores
   */
  CmmSetFormApiError(errorObject: any, form: FormGroup) {

    //* Si no hay objeto de error, no hago nada
    if(!errorObject) {
      return
    }

    // Itero por cada uno de los mensajes de error que se indiquen
    for( const [key, value] of Object.entries(errorObject)) {

      // Guardo el mensaje de error
      let error: any = value

      // Seteo el error en el Formulario que se nos indico con el mensaje que habiamos guardado
      form.controls[key]?.setErrors({'apiError': true, message: error.message})

    }
  }

  //? Lógica de tipos de estatus con color

  /**
   * Setea el objeto de status para ser evaluado en las acciones de la tabla
   * @param nameStatus Nombre de estatus que estoy pasando para que sea evaluado
   * @param statusDictionary Grupo de estatus en el que defino a qué tipo de estatus están asociados los estatus que pase
   * @param altStatusName Nombre alternativo del estatus en caso de que se quiera mostrar diferente en la tabla
   * @param useStatusGroup Indica si cada objeto de @statusDictionary será un grupo de estatus o si será uno solo
   * @returns
   */
  CmmSetStatusType(nameStatus: string, statusDictionary: any[], altStatusName?: string, useStatusGroup?: boolean): CmmStatusModel | void{
    let currentStatusType = ''

    //*Si la modalidad es de grupos de estatus, entonces emparejo los estatus de forma distinta
    if(useStatusGroup){

      //* Obtengo el tipo de status que tengo
      (statusDictionary as CmmStatusTypeGroupsModel[]).forEach(statusGroup => {

        //* Iterramos por cada uno de los estatus
        statusGroup.statusGroup.forEach(statusName => {

          //*Si consigo el estatus que acabo de pasar en el grupo, lo asigno al tipo de estatus del grupo
          if(statusName == nameStatus){
            currentStatusType = statusGroup.statusType
          }

        })
      })
    }

    //* En caso de que solo sea un estatus por objeto
    else {

      //* Obtengo el tipo de status que tengo
      (statusDictionary as CmmStatusDictionaryModel[]).forEach(status => {

        //*Si consigo el estatus que acabo de pasar en el grupo, lo asigno al tipo de estatus del grupo
        if(status.statusName == nameStatus){
          currentStatusType = status.statusType
        }

      })
    }

    //* Retorno un objeto de estatus dependiendo del tipo que tenga
    switch (currentStatusType) {

      case 'success':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#14c6a4', imgClass: 'bg-confirmed' };

      case 'warning':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#fdc713', imgClass: 'bg-pending'};

      case 'error':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#ff0000', imgClass: 'bg-rejected' };

      case 'info':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#03a9f4', imgClass: 'bg-confirmed' };

      case 'info_alt':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#03a9f4', imgClass: 'bg-missing' };

      case 'neutral':
        return { text: altStatusName? altStatusName:nameStatus, badge: '#444444', imgClass: '' };

      default:
        return { text: altStatusName? altStatusName:nameStatus, badge: '#03a9f4', imgClass: 'bg-missing' };

    }

  }

  //? Lógica de eventos entre ventanas

  /**
   * Envía mensajes personalizados a la ventana padre
   * @param type Indica qué tipo de mensaje es
   * @param data La data que se enviará en el mensaje
   */
  CmmPostMessage(type: string, data?: any) {

    // Creamos la variable que tiene el mensaje con el tipo indicado
    let message = {
      type
    };

    // en caso de que se haya mandado una data
    if(data) {

      // Le asigno al mensaje que se quiere enviar la data suministrada
      Object.assign(message, data);

    };

    // Mandamos el mensaje usando la funcion de la ventana
    window.parent.postMessage(message,'*');

  }
}
