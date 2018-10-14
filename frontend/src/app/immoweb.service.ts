import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/*
export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}
*/

@Injectable()
export class ImmoWebService {
  constructor(private httpClient: HttpClient) {}

  getAll(
    userLocation: string,
    otherLocation: string,
    maxWait: number,
    houseOrApp: string,
    rentOrBuy: string,
    minBed: number,
    maxPrice: number
  ): Observable<any> {
    return <Observable<any>>(
      this.httpClient.get(
        `http://localhost:3000/get-location?input=${userLocation}&otherLoc=${otherLocation}&max=${maxWait}&houseApp=${houseOrApp}&rentBuy=${rentOrBuy}&minBed=${minBed}&maxPrice=${maxPrice}`
      )
    );
  }

  getCenter(userLocation: string): Observable<any> {
    return <Observable<any>>this.httpClient.get(`http://localhost:3000/get-coordinates?input=${userLocation}`);
  }
}
