/// <reference types="@types/googlemaps" />
import { ExternalJsFileLoader } from './external-js-file-loader.service';
import { Injectable } from '@angular/core';
import { HybrisOccService } from './hybris-occ.service';
import { LinearColorGradient } from './linear-color-gradient.service';
import { Color } from '../models/color';

const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/js';
// const GOOGLE_API_KEY = ''; // past the key here
const DEFAULT_SCALE = 2;
const SELECTED_MARKER_SCALE = 16;
const DEFAULT_LATITUDE = 30;
const DEFAULT_LONGITUDE = 0;

const getCountryISO2 = require('country-iso-3-to-2');

const colors = [0, 255 , 0];

@Injectable()
export class GoogleMapRendererService {
  private googleMap: google.maps.Map = null;
  private markers: google.maps.Marker[];
  private countries;

  private minimumDon;
  private maximumDon;

  constructor(
    private externalJsFileLoader: ExternalJsFileLoader,
    private hybrisOccService: HybrisOccService,
    private linearColorGradient: LinearColorGradient
  ) {}

  /**
   * Renders google map on the given element and draws markers on it.
   * If map already exists it will use an existing map otherwise it will create one
   * @param mapElement HTML element inside of which the map will be displayed
   * @param locations array containign geo data to be displayed on the map
   * @param selectMarkerHandler function to handle whenever a marker on a map is clicked
   */
  renderMap(
    mapElement: HTMLElement,
    locations: any[],
    selectMarkerHandler?: Function,
    geoDataUrl?: string
  ): void {
    if (this.googleMap === null) {
          this.externalJsFileLoader.load(
            GOOGLE_MAP_API_URL,
            { key: GOOGLE_API_KEY },
            () => {
              this.initMap(mapElement, this.defineMapCenter(locations), geoDataUrl);
              if (locations.length !== 0) {
                this.createMarkers(locations);
              }
            }
          );
    } else {
      this.setMapOnAllMarkers(null);
      if (selectMarkerHandler) {
        this.createMarkers(locations, selectMarkerHandler);
      } else {
        this.createMarkers(locations);
      }
      this.googleMap.setCenter(this.defineMapCenter(locations));
      this.googleMap.setZoom(DEFAULT_SCALE);
    }
  }

  /**
   * Centers the map to the given point
   * @param latitute latitude of the new center
   * @param longitude longitude of the new center
   */
  centerMap(latitute: number, longitude: number): void {
    this.googleMap.panTo({ lat: latitute, lng: longitude });
    this.googleMap.setZoom(SELECTED_MARKER_SCALE);
  }

  /**
   * Defines and returns {@link google.maps.LatLng} representing a point where the map will be centered
   * @param locations list of locations
   */
  private defineMapCenter(locations: any[]): google.maps.LatLng {
    return new google.maps.LatLng(
      DEFAULT_LATITUDE,
      DEFAULT_LONGITUDE);
  }

  private async initMap(
    mapElement: HTMLElement,
    mapCenter: google.maps.LatLng,
    geoDataUrl: string
  ) {

    

    let mapOpt: google.maps.MapTypeStyle[];

    mapOpt = [
    /* {
       featureType: 'water',
       elementType: 'labels',
       stylers: [{visibility: 'on'}]
     },
     {featureType: 'landscape',
    elementType: 'all',
  stylers: [{visibility: 'off'}]}*/
    ];

    const mapProp: google.maps.MapOptions = {
      center: mapCenter,
      zoom: DEFAULT_SCALE,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      // draggable: false,
      // zoomControl: false,
      styles: mapOpt,
      streetViewControl: false,
      mapTypeControl: false,
      backgroundColor: 'black'
    };

    const label = document.createElement('div');
    label.id = 'data-label';
    document.body.appendChild(label);


    this.googleMap = new google.maps.Map(mapElement, mapProp);

    if (geoDataUrl) {
      this.googleMap.data.loadGeoJson(geoDataUrl);
    }

    const triangleCoords: google.maps.LatLngLiteral[] = [
      {lat: 25.774, lng: -80.190},
      {lat: 18.466, lng: -66.118},
      {lat: 32.321, lng: -64.757}
    ];

    this.googleMap.data.add({geometry: new google.maps.Data.Polygon([triangleCoords])} );

    const countries = this.hybrisOccService.getDonationData();

    await countries.toPromise().then(resp => {console.log(resp); this.countries = resp; });

    this.findMinimumMaximumValues(this.countries);

    this.googleMap.data.setStyle((feature) => {
      const anyFeature: any = feature;
      const donation = this.countries[getCountryISO2(anyFeature.m)];

      let outLineweight: number;
      let zindex: number;
      if (feature.getProperty('state') === 'hover') {
        outLineweight = 2;
        zindex = 2;
      } else {
        outLineweight = 0;
        zindex = 1;
      }

      let color: Color;
      if (donation && !isNaN(donation)) {
      color = this.linearColorGradient.getColorsForGivenIntencity(this.minimumDon,
        this.maximumDon,
        donation);
      } else {
        return {
          visible: true,
          draggable: true
        };
      }

      console.log(color);
     return {
     fillColor: 'RGB(' + color.red + ',' + color.green + ',' + color.blue + ')',
     strokeWeight: outLineweight,
     fillOpacity: color.opac,
     // zIndex: zindex
     visible: true,
     zIndex: -1
    };
  });

  this.googleMap.data.addListener('mouseover', (e) => {
    console.log(e.feature);
    e.feature.setProperty('state', 'hover');
    const label_ = document.getElementById('data-label');
    label_.innerHTML = e.feature.getProperty('name') + ': ' + this.countries[getCountryISO2(e.feature.m)];
  });

  this.googleMap.data.addListener('mouseout', (e) => {
    e.feature.setProperty('state', 'ok');
  });
  }

  /**
   * Erases the current map's markers and create a new one based on the given locations
   * @param locations array of locations to be displayed on the map
   * @param selectMarkerHandler function to handle whenever a marker on a map is clicked
   */
  private createMarkers(
    locations: any[],
    selectMarkerHandler?: Function
  ): void {
    this.markers = [];
    locations.forEach((element, index) => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          element.geoPoint.latitude,
          element.geoPoint.longitude
        ),
        label: index + 1 + ''
      });
      this.markers.push(marker);
      marker.setMap(this.googleMap);
      marker.addListener('mouseover', function() {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      });
      marker.addListener('mouseout', function() {
        marker.setAnimation(null);
      });
      if (selectMarkerHandler) {
        marker.addListener('click', function() {
          selectMarkerHandler(index);
        });
      }
    });
  }

  private setMapOnAllMarkers(map: google.maps.Map): void {
    this.markers.forEach(marker => marker.setMap(map));
  }

  private findMinimumMaximumValues(countries) {
    this.minimumDon = Number.MAX_VALUE;
    this.maximumDon = Number.MIN_VALUE;

    Object.keys(countries).forEach((key) => {
      if (countries[key] > this.maximumDon && !isNaN(countries[key])) {
        this.maximumDon = countries[key];
      }
      if (countries[key] < this.minimumDon && !isNaN(countries[key])) {
        this.minimumDon = countries[key];
      }
    });
  }
}
