import { LinearColorGradient } from './linear-color-gradient.service';
import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

const defaultValues = [[0, 0],
                        [127, 127],
                        [15, 250],
                        [0, 0.8]];

const delta = 0.1;

fdescribe('LinearColorGradientService', () => {
    it('should calculate colors', () => {
        const service = new LinearColorGradient();
        service.allComponents = defaultValues;

        const colorValues = service.getColorsForGivenIntencity(-50, 300, 10);
        const expectedValues = {red: 0, green: 127, blue: 55.2, opac: 0.102};

        expect(Math.abs(colorValues.red - expectedValues.red)).toBeLessThan(delta);
        expect(Math.abs(colorValues.green - expectedValues.green)).toBeLessThan(delta);
        expect(Math.abs(colorValues.blue - expectedValues.blue)).toBeLessThan(delta);
        expect(Math.abs(colorValues.opac - expectedValues.opac)).toBeLessThan(delta);
    });
});
