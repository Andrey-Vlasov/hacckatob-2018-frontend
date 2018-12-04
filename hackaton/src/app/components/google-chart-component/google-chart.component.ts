import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ExternalJsFileLoader } from '../../services/external-js-file-loader.service';
import { HybrisOccService } from '../../services/hybris-occ.service';

@Component(
    {
        selector: 'app-google-chart',
        template: `<div #chartElement></div>`
    }
)
export class GoogleChartComponent implements OnInit {
    @ViewChild('chartElement')
    chartElement: ElementRef;

    constructor(private externalJsFileLoader: ExternalJsFileLoader,
                private occService: HybrisOccService) {}

    ngOnInit() {
        this.externalJsFileLoader.load('https://www.gstatic.com/charts/loader.js', {}, () => {
            google['charts']['load']('current', {
                'packages': ['geochart'],
                'mapsApiKey': 'AIzaSyDGMNEuMeZWr5OZHJ8E8TQkugKCF-moVxo'
            });

            this.occService.getDonationData().subscribe( (resp) => {

            google['charts']['setOnLoadCallback'](() => {

                const dataArray: any = [['Country', 'Donation']];

                Object.keys(resp).forEach((key) => {
                    if (!isNaN(resp[key])) {
                        dataArray.push([key, Number(resp[key])]);
                    }
                });

                console.log(dataArray);

                /*const data = google['visualization']['arrayToDataTable']([
                    ['Country', 'Donation'],
                    ['CA', 5490],
                    ['US', 493854]
                ]);*/

                const data = google['visualization']['arrayToDataTable'](dataArray);

                console.log(this.chartElement);
                const chart = new google['visualization']['GeoChart'](this.chartElement.nativeElement);
                chart.draw(data, {});
            });
            });
        });
    }
}
