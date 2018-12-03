import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class HybrisOccService {
    getDonationData(): Observable<any> {
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
