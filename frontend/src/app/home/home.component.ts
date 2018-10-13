import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  quote: string;
  isLoading: boolean;
  workLocation: string;
  maxDuration: number;
  houses: any[];

  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    this.houses = [
      {
        Type: 'Bungalow',
        City: 'Wolkrange',
        PostalCode: 6780,
        Bedrooms: 2,
        Size: 173,
        Price: 260000,
        Info:
          "LORRAINE : Province de Luxembourg 6780 WOLKRANGE Jolie maison d'habitation de plain-pied 3 façades " +
          '(2 chambres), avec caves, abris de jardin, ...'
      },
      {
        Type: 'Farmhouse',
        City: 'Ruddervoorde',
        PostalCode: 8020,
        Bedsrooms: 3,
        Size: 19000,
        Price: 1190000,
        Info:
          'Oostduinkerke – Zeer ruime boerderij met grote stal. Bel Eric, ook op zon-en feestdagen, ' +
          '0475/82.11.11, of bezoek bureel BROKER Leopold II laan ...'
      }
    ];
    console.log(this.houses);
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  getSuggestions() {
    console.log(this.workLocation);
    this.quoteService.getLocationSuggestions(this.workLocation).subscribe(result => {
      console.log(result);
    });
  }
}
