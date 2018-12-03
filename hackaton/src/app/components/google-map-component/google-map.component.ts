import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { GoogleMapRendererService } from '../../services/google-map-renderer.service';


@Component({
  selector: 'app-store-finder-map',
  template: '<div #mapElement class="map"></div>',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnChanges, OnInit {
  @ViewChild('mapElement')
  mapElement: ElementRef;
  @Input()
  locations: any[] = [];
  @Input()
  geoDataUrl: string;
  @Output()
  selectedStoreItem: EventEmitter<number> = new EventEmitter();

  constructor(private googleMapRendererService: GoogleMapRendererService) {}

  ngOnInit(): void {
    this.ngOnChanges(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
   // if (changes.locations && this.locations) {
     console.log('google map component onChanges');
      this.googleMapRendererService.renderMap(
        this.mapElement.nativeElement,
        this.locations,
        markerIndex => {
          this.selectStoreItemClickHandle(markerIndex);
        },
        this.geoDataUrl
      );
   // }
  }

  /**
   * Sets the center of the map to the given location
   * @param latitude latitude of the new center
   * @param longitude longitude of the new center
   */
  centerMap(latitude: number, longitude: number): void {
    this.googleMapRendererService.centerMap(latitude, longitude);
  }

  private selectStoreItemClickHandle(markerIndex: number) {
    this.selectedStoreItem.emit(markerIndex);
  }
}
