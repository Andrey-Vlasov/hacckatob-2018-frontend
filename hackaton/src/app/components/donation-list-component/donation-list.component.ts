import { Component, OnInit } from '@angular/core';
import { HybrisOccService } from '../../services/hybris-occ.service';
import { Observable } from 'rxjs';

@Component({
    templateUrl: 'donation-list.component.html',
    selector: 'app-donation-list',
    styleUrls: ['donation-list.component.scss']
})
export class DonationListComponent implements OnInit {
    donations: any;
    total: number;

    constructor(private hybrisOcc: HybrisOccService) {}

    ngOnInit() {
        this.hybrisOcc.getDonationData().subscribe((resp) => {
            this.donations = Object.keys(resp).filter((key => !isNaN(resp[key]))).map((key) =>  {
            return {country: key, donation: Number(resp[key])};
        });

        this. total = this.donations.map(el => el.donation).reduce((prev, curr) => prev + curr);
        });
    }
}
