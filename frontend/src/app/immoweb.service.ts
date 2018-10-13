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

  getAll(userLocation: string, maxWait: number): Observable<any> {
    return <Observable<any>>(
      this.httpClient.get(`http://localhost:3000/get-location?input=${userLocation}&max=${maxWait}`)
    );
  }
}
