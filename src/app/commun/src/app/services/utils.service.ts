import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CmmUtilsService {
  /**
   * Variable que contiene la url del gateway
   */
  gatewayUrl: string;

  constructor(private http: HttpClient) {

    //*Tomo la url de del environment del proyecto. Todos deberían tener la variable "CC_GATEWAY_URL"
    this.gatewayUrl = environment.CC_GATEWAY_URL;

  }

  /**
   *
   * @returns Api listado de monedas
   */
  CmmGetCurrenciesList(): Observable<any> {
    return this.http.get(this.gatewayUrl + '/v1/list/currencies');
  }

  /**
   *
   * @returns Api listado de paises
   */
  CmmGetCountriesList(): Observable<any> {
    return this.http.get(this.gatewayUrl + '/v1/list/countries');
  }

  /**
   *
   * @returns Api listado de generos
   */
  CmmGetGendersList(): Observable<any> {
    return this.http.get(this.gatewayUrl + '/v1/list/gender');
  }

  /**
   *
   * @returns Api listado de bancos
   */
  CmmGetBanksList(idCurrency: string | number): Observable<any> {

    return this.http.get(this.gatewayUrl + '/v1/list/bank', {
      params:{
        idCurrency
      }
    });

  }
}
