import { ImmowebService } from './../immoweb.service';
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

  constructor(private quoteService: QuoteService, private immowebService: ImmowebService) {}

  ngOnInit() {
    this.houses = [
      {
        Type: 'Bungalow',
        City: 'Wolkrange',
        PostalCode: 6780,
        Bedrooms: 2,
        Size: 173,
        Price: 260000,
        Duration: 30,
        Image: '../../assets/housie1.jpg',
        Info:
          "LORRAINE : Province de Luxembourg 6780 WOLKRANGE Jolie maison d'habitation de plain-pied 3 façades " +
          "(2 chambres), avec caves, abris de jardin, terrasse, garage, parking à l'avant du bâtiment et un jardin " +
          "(OUEST) sur 9 ares et 26 centiares. Composition du bien : Rez-de-chaussée : hall d'entrée, WC séparé, " +
          'vestiaire, vaste séjour lumineux (salon et salle à manger) avec accès à la terrasse, cuisine équipée, 2 ' +
          'chambres, salle de bains (baignoire, meuble avec lavabo et un WC), buanderie et un garage (porte ' +
          'sectionnelle électrique, un emplacement voiture). Combles : un spacieux grenier partiellement aménagé ' +
          '(accès par un escalier escamotable). Sous-sol : chaufferie, coin douche et une réserve. Quelques ' +
          'renseignements complémentaires : Châssis en bois avec double vitrage, chauffage central au mazout ' +
          '(chaudière « Weishaupt » de 1995, cuve de 2.950 L), toiture en ardoises, volets, sols carrelés et ' +
          'tapis plain, compteur électrique simple horaire, ... Superficie habitable : +/- 173 m² Travaux de ' +
          'rafraichissements à prévoir ! Cette maison est située dans un quartier calme dans le charmant village ' +
          "de Wolkrange et à proximité de la ville d'Arlon, des commerces/supermarchés, restaurants, écoles, " +
          'médecins/pharmacies, banques, autoroutes E411/E25, et de nombreuses activités. Année de construction : ' +
          '1974 Certificat PEB : CLASSE E û 393 kWh/m² R.C : 832 € Prix demandé : 260.000 €'
      },
      {
        Type: 'Farmhouse',
        City: 'Ruddervoorde',
        PostalCode: 8020,
        Bedsrooms: 3,
        Size: 19000,
        Price: 1190000,
        Duration: 65,
        Image: '../../assets/housie2.jpg',
        Info:
          'Oostduinkerke – Zeer ruime boerderij met grote stal. Bel Eric, ook op zon-en feestdagen, ' +
          '0475/82.11.11, of bezoek bureel BROKER Leopold II laan 83a OOSTDUINKERKE, recht tegenover "De Mikke” ' +
          'met ruime parking.'
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
    // this.immowebService.getAll('location', 20).subscribe((results: any) => this.houses = results);
    this.quoteService.getLocationSuggestions(this.workLocation).subscribe(result => {
      console.log(result);
    });
  }

  getPriceString(price: number) {
    let priceString = '' + (price % 1000);
    while (price >= 1000) {
      if (price % 1000 < 10) {
        priceString = '00' + priceString;
      } else if (price % 1000 < 100) {
        priceString = '0' + priceString;
      }
      price = (price - (price % 1000)) / 1000;
      priceString = (price % 1000) + '.' + priceString;
    }
    return priceString;
  }

  getDurationString(duration: number) {
    let durationString = '~ ';
    if (duration < 60) {
      durationString += duration + 'm';
    } else {
      durationString += (duration - (duration % 60)) / 60 + 'h';
      if (duration % 60 < 10) {
        durationString += '0' + (duration % 60);
      } else {
        durationString += duration % 60;
      }
    }
    return durationString;
  }
}
