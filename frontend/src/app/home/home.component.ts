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
  workLocation: string;
  housingType: string;
  rentOrBuy: string;
  maxPrice: number;
  minBedroom = 1;
  maxDuration = 40;
  houses: any[];

  constructor(private quoteService: QuoteService, private immoWebService: ImmoWebService) {}

  ngOnInit() {}

  ngOnChanges() {
    this.ngOnInit();
  }

  getSuggestions() {
    this.quoteService.getLocationSuggestions(encodeURI(this.workLocation)).subscribe(result => {
      console.log(result);
    });
  }

  search() {
    this.immoWebService
      .getAll(this.workLocation, this.maxDuration, this.housingType, this.rentOrBuy, this.maxPrice, this.minBedroom)
      .subscribe((results: any) => {
        this.houses = results.map((item: any) => {
          return {
            Type: item.property.type,
            City: item.property.location.address.locality,
            PostalCode: item.property.location.address.postalCode,
            Bedrooms: item.property.bedroom.count,
            Size: Math.round(Math.random() * 10000),
            Price: Math.round(Math.random() * 10000),
            Duration: item.travelDuration.driving,
            Image: item.media.pictures.baseUrl + item.media.pictures.items[0].relativeUrl.large,
            Info:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut ' +
              'labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ' +
              'ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
              'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa ' +
              'qui officia deserunt mollit anim id est laborum.'
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
