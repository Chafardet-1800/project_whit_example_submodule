import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  /**
   * Variable que contiene la url del gateway
   */
  gatewayUrl: string;

  constructor(private http: HttpClient) {

    // Seteamos el la url base
    this.gatewayUrl = environment.CC_GATEWAY_URL;

  }

  /**
   * Envía el form de depósito
   * @param SendData
   * @returns
   */
  postDeposit(SendData: any) {
    const formData = new FormData();

    //* Agrego todos los valores a formData
    Object.entries(SendData).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    return this.http.post(this.gatewayUrl + '/v2/operation/add/bank', formData, {
      headers: new HttpHeaders(),
      observe: 'response',
    });
  }

  /**
   *
   * @param Api listado de retiros
   * @returns
   */
  getWithdrawsList(withdrawFilter?: {search: string,
    limit: string,
    page: string,
    startDate: string,
    endDate: string,
    amountStart: any,
    amountEnd: any,
    idWithdrawStatus: string,
    idWithdrawCurrency: string}
  ): Observable<any> {

    let params: any = {}

    //*Solamente agrego un parámetro a params si viene con un valor
    for( const [key, value] of Object.entries(withdrawFilter as any)){
      if(value) {
        Object.assign(params, {[key]: value})
      }
    }

    return this.http.get('http://172.16.4.100:4001' + '/v1/operation/withdraws', {
      params,
    });

  }
}
