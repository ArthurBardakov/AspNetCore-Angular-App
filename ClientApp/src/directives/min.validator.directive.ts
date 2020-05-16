import { Directive, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[min]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: MinValidator, multi: true}
  ]
})

export class MinValidator implements Validator {

    constructor(@Attribute('min') public minValue: any) {
        this.minValue = Number(this.minValue);
    }

    validate(c: AbstractControl): { [key: string]: any } {
        if (c.value !== null && c.value !== '') {
            const currentValue = Number(c.value);

            if (currentValue < this.minValue) {
                return { min: true };
            }
        }

        return null;
    }
}
