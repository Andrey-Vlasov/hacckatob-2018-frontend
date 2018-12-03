import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GoogleMapComponent } from './components/google-map-component/google-map.component';
import { GoogleMapRendererService } from './services/google-map-renderer.service';
import { ExternalJsFileLoader } from './services/external-js-file-loader.service';
import { HybrisOccService } from './services/hybris-occ.service';
import { LinearColorGradient } from './services/linear-color-gradient.service';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GoogleMapRendererService, ExternalJsFileLoader, HybrisOccService, LinearColorGradient],
  bootstrap: [AppComponent]
})
export class AppModule { }
