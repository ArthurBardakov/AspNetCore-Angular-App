import { Directive, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[max]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: MaxValidator, multi: true}
  ]
})

export class MaxValidator implements Validator {

    constructor(@Attribute('max') public maxValue: any) {
        this.maxValue = Number(this.maxValue);
    }

    validate(c: AbstractControl): { [key: string]: any } {
        const currentValue = Number(c.value);

        if (currentValue > this.maxValue) {
            return { max: true };
        }

        return null;
    }
}
