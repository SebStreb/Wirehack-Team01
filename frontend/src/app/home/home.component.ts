import { Component, OnChanges, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';
import { ImmoWebService } from '@app/immoweb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {
  quote: string;
  isLoading: boolean;
  workLocation: string;
  maxDuration = 40;
  houses: any[];

  constructor(private quoteService: QuoteService, private immoWebService: ImmoWebService) {}

  ngOnInit() {
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

  ngOnChanges() {
    this.houses = [
      {
        Type: 'Bungalow',
        City: 'Wolkrange',
        PostalCode: 6780,
        Bedrooms: 2,
        Size: 173,
        Price: 260000,
        Duration: 20,
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
        Bedrooms: 3,
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
    this.ngOnInit();
  }

  getSuggestions() {
    this.quoteService.getLocationSuggestions(encodeURI(this.workLocation)).subscribe(result => {
      console.log(result);
    });
  }

  search() {
    this.immoWebService.getAll(this.workLocation, this.maxDuration).subscribe((results: any) => {
      this.houses = results.map((item: any) => {
        return {
          Type: item.property.type,
          City: item.property.location.address.locality,
          PostalCode: item.property.location.address.postalCode,
          Bedrooms: item.property.bedroom.count,
          Size: 178,
          Price: 160000,
          Duration: item.travelDuration,
          Image: item.media.pictures.baseUrl + item.media.pictures.items[0].relativeUrl.large,
          Info: ''
        };
      });
      console.log(results);
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
    duration = (duration - (duration % 60)) / 60;
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

  getDurationCategory(duration: number) {
    if (duration <= this.maxDuration * 0.5) {
      return 'Good';
    } else if (duration <= this.maxDuration) {
      return 'Ok';
    } else {
      return 'Bad';
    }
  }
}
