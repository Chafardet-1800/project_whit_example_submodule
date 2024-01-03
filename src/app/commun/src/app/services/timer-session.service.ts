import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject, takeUntil, timer } from 'rxjs';
// import { modulesFilterClear } from '../../core/reducer/module.actions';
import { authExpirationTime } from '../data/constants/local-storage-variables';
import { clearPrivileges } from '../data/privileges/reducer/privileges.actions';
import { setSpinner } from '../data/utils/reducer/utils.actions';
import { CmmDataService } from './data.service';
import { CmmDialogService } from './dialogs.service';

@Injectable()
export class CmmTimerSessionService {

  /**
   * Variable que guarda el tiempo de session que queda
   */
  subscribeTimerSession: number = 0;

  /**
   * Variable que indica el final del tiempo de seccion
   */
  private readonly stopTimer = new Subject<void>();

  /**
   * Variable que guarda el tiempo de session con el que se quiere iniciar
   */
  timeLeft!: number

  /**
   * Indica si la sesión se expiró
   */
  sessionExpired: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(
    private router: Router,
    private dialogService: CmmDialogService,
    private dataService: CmmDataService,
    private store: Store
  ) {}

  //? Lógica del timer de sesión

  /**
   * Da la señal de detener el timer de sesión
   */
  CmmStopTimerObservable(){
    this.stopTimer.next()
  }

  /**
   * Inicia el primer contador de sesión
   */
  CmmInitiateFirstTimer(){
    this.CmmSessionTimer()
  }

  /**
   * Timer que va restandole al tiempo de sesión hasta que se termina
   */
  CmmSessionTimer(){

    //*Verifico que se haya seteado un tiempo para setear el tiempo guardado
    let storedExpirationTime = sessionStorage.getItem(authExpirationTime) ? Number(this.dataService.CmmB64DecodeUnicode(sessionStorage.getItem(authExpirationTime)!)): null

    //*En el caso de que el se haya obtenido un tiempo de expiracion
    if(storedExpirationTime && !isNaN(storedExpirationTime)){

      //*Seteamos el tiempo indicado
      this.timeLeft = storedExpirationTime;

    }

    //*En el caso de que no se nos diera un tiempo de expiracion
    else {

      //*Seteamos por defecto 150 segundos
      this.timeLeft = 150;

    }

    //*Creo el observable que se encarga de contar cada segundo
    const counter = timer(1000, 1000);

    //*Me suscribo al contador y le voy restando la cuenta al tiempo de expiración
    const counterObservable = counter
      .pipe(
        takeUntil(this.stopTimer),
      )
      .subscribe((val) => {

        //*Setamos el tiempo que quede segun el contador
        this.subscribeTimerSession = this.timeLeft - val;

        //*Si el tiempo de seccion llega a cero
        if (this.subscribeTimerSession == 0) {

          //*Me desubscribo del contador para finalizar la seccion
          counterObservable.unsubscribe();

          //*Doy la señal de que la sesión expiró
          this.sessionExpired.next(true);

        }

        //*Si el tiempo no se acabado retonamos el observable del estado de la seccion
        return this.sessionExpired.asObservable();

      });
  }

  /**
   * Se encarga de hacer la limpieza de variables de navegador para cerrar la sesión adecuadamente
   */
  CmmCloseSession(){

    // Elimino los módulos y acciones guardadas
    this.store.dispatch(new clearPrivileges());

    // Elimino los módulos de reducer generales
    // this.store.dispatch(new modulesFilterClear());

    // Cierro todos los procesos y las peticiones pendientes
    this.dataService.CmmCancelPendingRequests();

    // Cierra todos los diálogos luego de que se cierran todos los procesos de salida.
    this.dialogService.CmmCloseAllDialogs();

    // Limpio los storage del navegador
    localStorage.clear();
    sessionStorage.clear();

    // Reseteo las variables del CmmSessionTimer
    this.CmmStopTimerObservable();

    // Indico que la session se expiro
    this.sessionExpired.next(false);

    // Detengo el spinner en caso de que este puesto
    this.store.dispatch(new setSpinner(false));

    // Redirigo al login
    this.router.navigate(['auth/login']);

  }

  ngOnDestroy(): void {

    // Cerramos todos los dialogos
    this.dialogService.CmmCloseAllDialogs();

  }
}
