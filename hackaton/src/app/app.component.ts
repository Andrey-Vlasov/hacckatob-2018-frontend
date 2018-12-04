import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Kyma hackaton';
  locations = [{ geoPoint: {latitude: 45, longitude: -74} }];
}
