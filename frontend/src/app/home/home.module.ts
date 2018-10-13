import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';
import { FormsModule } from '@angular/forms';
import { ImmoWebService } from '@app/immoweb.service';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, FormsModule, SharedModule, HomeRoutingModule,
  AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD9QGDDHiiVSUMpH3ZbwhAI6w_AAK_rJMY'
    })],
  declarations: [HomeComponent],
  providers: [QuoteService, ImmoWebService]
})
export class HomeModule {}
