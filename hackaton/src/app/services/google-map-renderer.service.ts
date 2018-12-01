/// <reference types="@types/googlemaps" />
import { ExternalJsFileLoader } from './external-js-file-loader.service';
import { Injectable } from '@angular/core';

const GOOGLE_MAP_API_URL = 'https://maps.googleapis.com/maps/api/js';
const GOOGLE_API_KEY = 'AIzaSyB7KXTrhIgBrBMNNVHWVWVyHfWcV_2Qe0Q'; // past the key here
const DEFAULT_SCALE = 4;
const SELECTED_MARKER_SCALE = 16;
const censusMax = -Number.MAX_VALUE;
const censusMin = Number.MAX_VALUE;

const colors = [0, 255 , 0];

@Injectable()
export class GoogleMapRendererService {
  private googleMap: google.maps.Map = null;
  private markers: google.maps.Marker[];

  constructor(
    private externalJsFileLoader: ExternalJsFileLoader
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
    selectMarkerHandler?: Function
  ): void {
    if (this.googleMap === null) {
          this.externalJsFileLoader.load(
            GOOGLE_MAP_API_URL,
            { key: GOOGLE_API_KEY },
            () => {
              this.initMap(mapElement, this.defineMapCenter(locations));
              if (selectMarkerHandler) {
                this.createMarkers(locations, selectMarkerHandler);
              } else {
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
      40,
      -100);
  }

  private initMap(
    mapElement: HTMLElement,
    mapCenter: google.maps.LatLng
  ): void {
    let complexStyle1: google.maps.MapTypeStyle;
    complexStyle1 = {
      stylers: [{visibility: 'off', color: '#fcfcfc'}],
      featureType: 'landscape',
      elementType: 'geometry'
    };

    let complexStyle2: google.maps.MapTypeStyle;
    complexStyle2 = {
      stylers: [{visibility: 'off', color: '#bfd4ff'}],
      featureType: 'water',
      elementType: 'geometry'
    };

    const mapProp = {
      center: mapCenter,
      zoom: DEFAULT_SCALE
    };

    this.googleMap = new google.maps.Map(mapElement, mapProp);
    this.googleMap.data.loadGeoJson('https://raw.githubusercontent.com/mapbox/geojson-vt-cpp/master/data/countries.geojson', { idPropertyName: 'STATE' });
    this.googleMap.data.setStyle((feature) => {

      colors[0] += 5;
      colors[1] -= 5;

     return {
     fillColor: 'RGB(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ')',
     strokeColor: 'RGB(' + colors[0] + ',' + colors[1] + ',' + colors[2] + ')',
     strokeWeight: 0,
     // draggable: true,
     fillOpacity: 0.5
    };
  });

    console.log(this.googleMap);
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
}
