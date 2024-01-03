import {
  HttpContext,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { authTokenVariable } from '../data/constants/local-storage-variables';
import { CmmAlertModalModel, CmmAlertToastrModel } from '../data/dialogs/models/dialogs.model';
import { USE_SPINNER } from '../data/utils/models/utils.model';
import { setSpinner } from '../data/utils/reducer/utils.actions';
import version from '../environments/package.json';
import { CmmDataService } from '../services/data.service';
import { CmmDialogService } from '../services/dialogs.service';
import { CmmTimerSessionService } from '../services/timer-session.service';

@Injectable({
  providedIn: 'root',
})
export class CmmHttpInterceptor implements HttpInterceptor {

  /**
   * Varaible que contiene la version en la que se encuentra el proyecto
   */
  environmentVersion = environment.CC_VERSION;

  /**
   * Varaible que contiene la version del commun en la que tiene el proyecto
   */
  cmmVersion = version.version;

  /**
   * Variable que contiene el nombre del proyecto
   */
  projectInitials = 'f-bus';

  //? Manejo de spinner

  /**
   * Peticiones iniciadas
   */
  initiatedRequests: number = 0

  /**
   * Peticiones terminadas
   */
  finishedRequests: number = 0

  constructor(
    private dataService: CmmDataService,
    public dialogService: CmmDialogService,
    public timerSession: CmmTimerSessionService,
    private store: Store
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Guardamos el token de la session
    const token: string | null = sessionStorage.getItem(authTokenVariable);

    //* Aumento el contador de requests
    this.initiatedRequests++

    //* Verifico si la petición requiere o no un spinner
    if(this.isSpinnerRequired(request.context)) {

      //* Activo el spinner y aumento el contador
      this.activateSpinner()

    }

    // Si hay token lo seteamos
    if (token != '' && token != null && token != undefined && token != 'N/A') {

      // Seteamos el token en el header de las peticiones
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
          httpReq: 'string',
        },
      });

      // Seteamos la version del proyecto en el header de las peticiones
      request = request.clone({
        headers: request.headers.set(
          `${this.projectInitials}-v`,
          this.environmentVersion
        ),
      });

      // Seteamos la version del proyecto cmm en el header de las peticiones
      request = request.clone({
        headers: request.headers.set(`cmm-v`, String(this.cmmVersion)),
      });

    }

    // Si hay un token de seguridad
    if (token) {

      // Detenemos el tiempo de session
      this.timerSession.CmmStopTimerObservable();

      // Inciamos el tiempo de session desde cero
      this.timerSession.CmmSessionTimer();

    }

    // Peticiones
    return next.handle(request).pipe(

      // Manejamos todas las peticiones hasta que se nos indique detenernos
      takeUntil(this.dataService.CmmOnCancelPendingRequests()),

      finalize( () =>{

        //* Incremento el contador de requests finalizados
        this.finishedRequests++

        //* Verifico si todas las peticiones se terminaron
        if(this.initiatedRequests == this.finishedRequests) {

          //* Desactivo el spinner
          this.deactivateSpinner()

        }}
      ),

      // Revisamos la respuesta de la peticion
      map((event: any) => {

        try {

          // Guardamos el body de la respuesta
          const myBody = event.body;

          // Solo si el body existe
          if (myBody) {

            // En caso de que la respuesta tenga un token
            if (myBody.hasOwnProperty('token') && myBody.token) {

              // Seteo el nuevo token
              sessionStorage.setItem(authTokenVariable, myBody.token);

            }

          }

        }

        catch (error) {}

        return event;

      }),

      // Manejamos el error en caso de ser necesario
      catchError((error: HttpErrorResponse) => {

        // Si el error es de una peticion de un archivo
        if (this.isBlobError(error)) {

          // Ejecutamos la funcion para arreglar el error recibido a un formato manejable
          this.parseErrorBlob(error).subscribe({

            // Accedemos el error
            error: (newErrorObj) => {

              // Guardamos el error original en un formato especifico
              let newHTTPErrorResponse: HttpErrorResponse = error;

              // Manejamos los casos segun la razon del fallo
              this.processBlobError(newHTTPErrorResponse, newErrorObj);

            },

          });

        }

        // Si el error es de una peticion comun
        else {

          // Manejamos los casos segun la razon del fallo
          this.processError(error);

        }

        // Retorna el error
        return throwError(error);
      })

    );

  }

  //?Lógica de manejo de errores

  /**
   * Procesa la información de la respuesta del API
   * @param error
   */
  processError(responseAPI: HttpErrorResponse) {

    // Error en el Server o No autorizado o Session expirada
    if (responseAPI.status === 0 || responseAPI.status === 401) {

      // Cerramos la session
      this.timerSession.CmmCloseSession();

      //Cierra todos los diálogos luego de que se cierran todos los procesos de salida.
      this.dialogService.CmmCloseAllDialogs();

      // Armamos la data de la alerta
      const messagesData: CmmAlertModalModel = {
        title: responseAPI.error.message
                ? responseAPI.error.message
                : 'No se ha podido procesar su solicitud, revise su conexión a internet.',
        text: responseAPI.error.trackingCode,
        giftData: '',
        typeIcon: 'error',
        showCancelButton: false,
        showConfirmButton: true,
        cancelButtonText: '',
        confirmButtonText: 'Aceptar',
      }

      // Abrimos la alerta con el mensaje
      this.dialogService.CmmAlertModal(messagesData);

    }

    // Otros errores
    else {

      // Armamos la data de la alerta
      const messagesData: CmmAlertToastrModel = {
        typeIcon: 'error',
        text: responseAPI.error.message,
        errorText: ' (' + responseAPI.error.trackingCode + ')'
      }

      // Abrimos la alerta con el mensaje
      this.dialogService.CmmAlertToastr(messagesData);

    }
  }

  /**
   * Procesa la información de respuesta si el API es tipo Blob
   * @param responseAPI
   * @param newErrorObj
   */
  processBlobError(responseAPI: HttpErrorResponse, newErrorObj: any) {

    // Error en el Server o No autorizado o Session expirada
    if (responseAPI.status === 0 || responseAPI.status === 401) {

      // Cerramos la session
      this.timerSession.CmmCloseSession();

      //Cierra todos los diálogos luego de que se cierran todos los procesos de salida.
      this.dialogService.CmmCloseAllDialogs();

      // Armamos la data de la alerta
      const messagesData: CmmAlertModalModel = {
        title: newErrorObj.message
                ? newErrorObj.message
                : 'No se ha podido procesar su solicitud, revise su conexión a internet.',
        text: newErrorObj.trackingCode,
        giftData: '',
        typeIcon: 'error',
        showCancelButton: false,
        showConfirmButton: true,
        cancelButtonText: '',
        confirmButtonText: 'Aceptar',
      }

      // Abrimos la alerta con el mensaje
      this.dialogService.CmmAlertModal(messagesData);

    }

    // Otros errores
    else {

      // Armamos la data de la alerta
      const messagesData: CmmAlertToastrModel = {
        typeIcon: 'error',
        text: newErrorObj.message,
        errorText: ' (' + newErrorObj.trackingCode + ')'
      }

      // Abrimos la alerta con el mensaje
      this.dialogService.CmmAlertToastr(messagesData);

    }
  }

  /**
   * Detecta si la respuesta de una petición es de tipo Blob
   * @param err error que se quiere probar si es del tipo blob
   * @returns True o false segunsea el caso
   */
  isBlobError(err: any): Boolean {
    return (
      err instanceof HttpErrorResponse &&
      err.error instanceof Blob &&
      err.error.type === 'application/json'
    );
  }

  /**
   * Parsea la respuesta de error de la petición tipo Blob
   * @param err
   * @returns
   */
  parseErrorBlob(err: HttpErrorResponse): Observable<any> {

    // Creamos esta variable que va a tener guardar la respuesta de la peticion del archivo
    const reader: FileReader = new FileReader();

    // Creamos un observable que va a obtener el error de la peticion
    const obs = new Observable((observer: any) => {

      // Cuando se termina de leer el archivo, ene ste caso sabemos que va a ser con el error
      reader.onloadend = (e) => {

        // Seteo en el error del observable el resultado de leer el archivo, en este caso un error
        observer.error(JSON.parse(reader.result as any));

        // Indico que ya se completo la funcionalidad el observable
        observer.complete();

      };

    });

    // Seleccino y leo el error de la respuesta indicada
    reader.readAsText(err.error);

    // Retornamos el resultado que armamos del observable hecho
    return obs;

  }

  //? Manejo de spinner

  /**
   * Retorna si la petición requiere o no spinner
   * @param headers
   */
  isSpinnerRequired(requestContext: HttpContext) {
    //* Obtengo el context que me indica si uso o no el spinner y retorno su valor
    return requestContext.get(USE_SPINNER)
  }

  /**
   * Activa el spinner
   */
  activateSpinner() {
    //* Pongo el spinner activado
    this.store.dispatch(new setSpinner(true))

  }

  /**
   * Desactiva el spinner
   */
  deactivateSpinner() {
    this.store.dispatch(new setSpinner(false))
  }

}
