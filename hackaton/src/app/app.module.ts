import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map-component/google-map.component';
import { GoogleMapRendererService } from './services/google-map-renderer.service';
import { ExternalJsFileLoader } from './services/external-js-file-loader.service';
import { HybrisOccService } from './services/hybris-occ.service';
import { LinearColorGradient } from './services/linear-color-gradient.service';
import { HttpClientModule } from '@angular/common/http';
import { GoogleChartComponent } from './components/google-chart-component/google-chart.component';
import { DonationListComponent } from './components/donation-list-component/donation-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    GoogleChartComponent,
    DonationListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [GoogleMapRendererService, ExternalJsFileLoader, HybrisOccService, LinearColorGradient],
  bootstrap: [AppComponent]
})
export class AppModule { }
