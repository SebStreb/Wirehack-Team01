import { Component, OnChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  otherLocation: string;
  housingType = 'HOUSE,APARTMENT';
  rentOrBuy = 'FOR_SALE';
  maxPrice: number;
  minBedroom = 1;
  maxDuration = 40;
  houses: any[] = [];
  lat = 50.8063939;
  lng = 4.3151967;

  work_lat = 50.8063939;
  work_lng = 4.3151967;

  @ViewChild('results') ResultsProp: ElementRef;

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
  center(house: any) {
    this.lat = house.GeoPoint.latitude;
    this.lng = house.GeoPoint.longitude;
  }

  search() {
    this.immoWebService
      .getCenter(this.workLocation)
      .subscribe((results: any) => {
        console.log('center is', results);
        this.work_lat = results[0];
        this.work_lng = results[1];
      });
    this.immoWebService
      .getAll(
        this.workLocation,
        this.otherLocation,
        this.maxDuration,
        this.housingType,
        this.rentOrBuy,
        this.maxPrice,
        this.minBedroom
      )
      .subscribe((results: any) => {
        this.houses = results.map((item: any) => {
          return {
            Id: item.id,
            PropertyType: item.property.type,
            LocationType: item.transaction.type,
            City: item.property.location.address.locality,
            PostalCode: item.property.location.address.postalCode,
            Bedrooms: item.bedrooms,
            Size: item.surface,
            Price: item.price,
            Duration: item.travelDuration.driving,
            Image: item.media.pictures.baseUrl + item.media.pictures.items[0].relativeUrl.large,
            Info: item.description,
            GeoPoint: item.property.location.geoPoint
          };
        });
        console.log(results);
      }, error => {
        console.error('error loading', error);
      }, () => {
        this.ResultsProp.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
