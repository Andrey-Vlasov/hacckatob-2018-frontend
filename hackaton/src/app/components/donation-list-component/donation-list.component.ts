import { Component, OnInit } from '@angular/core';
import { HybrisOccService } from '../../services/hybris-occ.service';
import { Observable } from 'rxjs';

@Component({
    templateUrl: 'donation-list.component.html',
    selector: 'app-donation-list'
})
export class DonationListComponent implements OnInit {
    donations: any;

    constructor(private hybrisOcc: HybrisOccService) {}

    ngOnInit() {
        this.hybrisOcc.getDonationData().subscribe((resp) => {
            this.donations = Object.keys(resp).map((key) =>  {
            return {country: key, donation: resp[key]};
        });
        });
    }
}
