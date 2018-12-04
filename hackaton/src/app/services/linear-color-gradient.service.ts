import { Color } from '../models/color';
import { Injectable } from '@angular/core';

const defaultValues = [[0, 0],
                        [200, 200],
                        [0, 0],
                        [0.4, 0.8]];

@Injectable()
export class LinearColorGradient {
   allComponents = defaultValues;

    public getColorsForGivenIntencity(minValue: number, maxValue: number, currentValue: number): Color {
        console.log(minValue, maxValue, currentValue);
        if (minValue === maxValue) {
            minValue *= 0.01;
        }

        const k: Array<number> = this.allComponents.map(bounds => (bounds[1] - bounds[0]) / (maxValue - minValue));
        const c: Array<number> = this.allComponents.map(bounds => bounds[0] - minValue * (bounds[1] - bounds[0]) / (maxValue - minValue));
        return {
            red: k[0] * currentValue + c[0],
            green: k[1] * currentValue + c[1],
            blue: k[2] * currentValue + c[2],
            opac: k[3] * currentValue + c[3]
        };
    }
}
