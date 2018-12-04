import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HybrisOccService {
    constructor(private http: HttpClient) {}
    getDonationData(): Observable<any> {
        // return this.http.get('https://donation-map-stage.sa-hackathon-08.cluster.extend.sap.cx/');
        return of({'US': 100,
        'CA': 50,
        'RU': 50,
        'BR': 25,
        'AU': 40,
        'FR': 80,
        'SY': 67,
        'BG': 30,
    'ZeroAdjustment': 0});
    }
}
