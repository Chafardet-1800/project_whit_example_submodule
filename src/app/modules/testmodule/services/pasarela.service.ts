import { HttpClient, HttpContext, HttpContextToken, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USE_SPINNER } from 'commun/src/app/data/utils/models/utils.model';


@Injectable({
  providedIn: 'root'
})
export class PasarelaService {

  constructor(
    private http: HttpClient
  ) { }

  //? Operaciones

  /**
   * Obtiene el listado de bancos
   * @param idCurrency
   * @returns
   */
  getBanksList(idCurrency: number): Observable<any> {
    let params = {
      idCurrency,
    };
    return this.http.get<any>('http://172.16.4.100:4005' + '/v1/list/bank/', {
      params,
      headers: new HttpHeaders(),
      observe: 'response',
    });
  }

  /**
   * @param returnForm Api para enviar devolucion de pago
   * @privileges 'cmer-refund'
   */
  returnPayment(returnForm: any) {
    return this.http.post<any>(
      'http://172.16.4.100:4005' + '/v1/operation/refund/bank_mobile',
      returnForm
    );
  }

  /**
   * API para enviar devolución de pago a órdenes inactivas
   * @param returnForm
   * @returns
   */
  returnPaymentInactiveOrder(returnForm: any) {
    return this.http.post<any>(
      'http://172.16.4.100:4005' + '/v1/operation/refund',
      returnForm
    )
  }

  //? Reportes

  /**
   * API de listado de tipos de status
   * @returns
   */
  listMobilePaymentsStatus() {
    return this.http.get('http://172.16.4.100:4005' + '/v1/list/bank_mobile/statuses');
  }

  // lista de bancos dentro del sistema
  listBanks(idCurrency: number): Observable<any> {
    let params = {
      idCurrency,
    };
    return this.http.get<any>('http://172.16.4.100:4005' + '/v1/list/bank/', {
      params,
      headers: new HttpHeaders(),
      observe: 'response',
    });
  }

  /**
   *
   * @returns Api listado de status
   */
  listStatus(tagTypeStatus: string): Observable<any> {
    let params = {
      tagTypeStatus,
    };
    return this.http.get('http://172.16.4.100:4005' + '/v1/list/status', {
      params,
    });
  }

  /**
   *
   * @returns Api listado de tipos de pago
   */
  listPaymentTypes(): Observable<any> {
    return this.http.get('http://172.16.4.100:4005' + '/v1/list/types_payment');
  }

  /**
   * API de listado de pagos móviles
   * @privilege 'cfiat_list_bank_mobiles'
   * @returns
   */
  listBankMobiles(searchParams?: {limit: number, page: number | string, startDate?: string, endDate?: string,idStatus?: string, idTypeTx?: string,idIssuingBank?: string, idReceivingBank?: string, issuingPhone?: string, receivingPhone?: string, transactionNumber: string}) {

    let params: any = {}

    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }

    return this.http.get('http://172.16.4.100:4005' + '/v1/operation/bank_mobiles',{
      headers: new HttpHeaders(),
      observe: 'response',
      params
    },);
  }

  /**
   * @description    :obtener las devoluciones de un usuario (ya sean fallidas o no)
   * @privileges 'cmer-payment_refunds'
   * @param {Boolean} refunds - indica si se quiere solo las devoluciones
   * @param {ObjectId} idOrder (opcional) - identificador de la orden que se desea ver los pagos
   * @param {ObjectId} idPaymentType (opcional) - tipo de devolucion (por sobrepago o completa/sin orden)
   * @param {String} tagStatus (opcional) - status de la transaccion (Ej: STATUS_SUCCESFULL, STATUS_REJECTED)
   * @param {Number} limit (opcional) - limite
   * @param {Number} page (opcional) - pagina
   * @param {Date} startDate (opcional) - fecha donde empieza
   * @param {Date} endDate (opcional) - fecha donde termina
   */
  getRefunds(
    searchParams?: {limit: number | string, page: number | string, startDate?: string, endDate?: string,refunds?: boolean, idOrder?: string,tagStatus?: string, idPaymentType?: string, phoneNumber?: string}
  ) {
    let params: any = {}


    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }

    return this.http.get('http://172.16.4.100:4005' + '/v1/list/refunds', {
      params,
    });
  }

  /**
   * @description    :obtener la data para el metodo de pago tarjeta nacional
   * @privileges 'cmer-orders'
   * @param {ObjectId} idTypeOrder - identificador del tipo de orden
   * @param {String} tagStatus (opcional) - status de la transaccion (Ej: STATUS_ACTIVE, STATUS_PAID, STATUS_OVERPAID, etc)
   * @param {Number} limit (opcional) - limite
   * @param {Number} page (opcional) - pagina
   * @param {Date} startDate (opcional) - fecha donde empieza
   * @param {Date} endDate (opcional) - fecha donde termina
   */
  getOrders(searchParams?:{
    limit: number | string ,
    page: number | string,
    startDate?: string,
    endDate?: string,
    tagStatus?: string,
    idTypeOrder?: string,
    idOrder?: string}
  ) {
    let params: any = {}

    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }


    return this.http.get('http://172.16.4.100:4005' + '/v1/list/orders', {
      params,
      context: new HttpContext().set(USE_SPINNER, true)
    });
  }


  /**
   * @description    :obtener las devoluciones de un usuario (ya sean fallidas o no)
   * @privileges 'cmer-payment_attempts'
   * @param {Boolean} refunds - indica si se quiere solo las devoluciones
   * @param {ObjectId} idOrder (opcional) - identificador de la orden que se desea ver los pagos
   * @param {ObjectId} idPaymentType (opcional) - tipo de devolucion (por sobrepago o completa/sin orden)
   * @param {String} tagStatus (opcional) - status de la transaccion (Ej: STATUS_SUCCESFULL, STATUS_REJECTED)
   * @param {Number} limit (opcional) - limite
   * @param {Number} page (opcional) - pagina
   * @param {Date} startDate (opcional) - fecha donde empieza
   * @param {Date} endDate (opcional) - fecha donde termina
   */
  getTransactions(
    searchParams: {
      limit: number | string,
      page: number | string,
      startDate?: string,
      endDate?: string,
      refunds?: boolean,
      idOrder?: string | number,
      tagStatus?: string,
      idPaymentType?: string
    }
  ) {
    let params = {
      limit: searchParams.limit,
      page: searchParams.page,
    };

    if (searchParams.startDate) {
      Object.assign(params, { startDate: searchParams.startDate });
    }

    if (searchParams.endDate) {
      Object.assign(params, { endDate: searchParams.endDate });
    }
    if (searchParams.idOrder) {
      Object.assign(params, { idOrder: searchParams.idOrder });
    }
    if (searchParams.tagStatus) {
      Object.assign(params, { tagStatus: searchParams.tagStatus });
    }
    if (searchParams.idPaymentType) {
      Object.assign(params, { idPaymentType: searchParams.idPaymentType });
    }
    if (searchParams.refunds == true || searchParams.refunds == false) {
      Object.assign(params, { refunds: searchParams.refunds });
    }

    return this.http.get('http://172.16.4.100:4005' + '/v1/list/payments', {
      params,
    });
  }

  //? APIs de descargar excel

  /**
   * Obtiene el archivo excel de listado de pagos móviles
   * @param searchParams
   * @returns
   */
  getMobilePaymentsExcel(searchParams?: {limit: number, page: number | string, startDate?: string, endDate?: string,idStatus?: string, idTypeTx?: string,idIssuingBank?: string, idReceivingBank?: string, issuingPhone?: string, receivingPhone?: string, transactionNumber: string}){

    let params: any = {}

    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }

    return this.http.get('http://172.16.4.100:4005' + '/v1/operation/report/bank_mobiles',{
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json',
      observe: 'response',
      params
    });

  }

  /**
   * Obtiene el archivo excel de listado de órdenes
   * @param searchParams
   * @returns
   */
  getOrdersExcel(searchParams?:{
    limit: number | string ,
    page: number | string,
    startDate?: string,
    endDate?: string,
    tagStatus?: string,
    idTypeOrder?: string,
    idOrder?: string}){

    let params: any = {}

    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }

    return this.http.get(
      'http://172.16.4.100:4005' + '/v1/operation/merchant_report',
      {
        headers: new HttpHeaders(),
        responseType: 'blob' as 'json',
        params,
      }
    );
  }

  /**
   * Obtiene el archivo excel de listado de órdenes
   * @param searchParams
   * @returns
   */
  getRefundsExcel(searchParams?: {limit: number | string, page: number | string, startDate?: string, endDate?: string,refunds?: boolean, idOrder?: string,tagStatus?: string, idPaymentType?: string, phoneNumber?: string}){

    let params: any = {}

    if(searchParams){
      //*Solamente envío parámetros de búsqueda si tienen un valor
      Object.entries(searchParams as any).forEach(([key, value]) => {
        if(value){
          Object.assign(params, {[key]: value})
        }
      });
    }

    return this.http.get(
      'http://172.16.4.100:4005' + '/v1/operation/merchant_report_refunds',
      {
        headers: new HttpHeaders(),
        responseType: 'blob' as 'json',
        params,
      }
    );
  }

  //?Detalle de orden

  /**
   * Llama al API para revertir orden
   * @param idOrder - Identificador de orden
   * @param idDocumentType (opcional) - Identificador del tipo de documento
   * @param documentNumber (opcional) - Numero de identidad
   * @returns
   */
  revertOrder(idOrder: string, idDocumentType?: number, documentNumber?: number){
    const body = {
      idOrder
    }
    if(idDocumentType){
      Object.assign(body, {idDocumentType})
    }
    if(documentNumber){
      Object.assign(body, {documentNumber})
    }
    return this.http.post('http://172.16.4.100:4005' + '/v1/operation/merchant_refund_order', body)
  }
}
