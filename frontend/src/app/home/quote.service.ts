import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const routes = {
  quote: (c: RandomQuoteContext) => `/jokes/random?category=${c.category}`
};

export interface RandomQuoteContext {
  // The quote's category: 'dev', 'explicit'...
  category: string;
}

@Injectable()
export class QuoteService {
  constructor(private httpClient: HttpClient) {}

  getRandomQuote(context: RandomQuoteContext): Observable<string> {
    return this.httpClient
      .cache()
      .get(routes.quote(context))
      .pipe(
        map((body: any) => body.value),
        catchError(() => of('Error, could not load joke :-('))
      );
  }

  getLocationSuggestions(userLocation: string): Observable<any> {
    return <Observable<any>>(
      this.httpClient.get(
        'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' +
          userLocation +
          '&inputtype=textquery&fields=formatted_address,geometry&key=AIzaSyBeJaZEr-xsTYyCoTISYxy1GrTN86dbouM'
      )
    );
  }
}
