import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[validateEmpty]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: EmptyValidator, multi: true}
  ]
})

export class EmptyValidator implements Validator {

    validate(c: AbstractControl): { [key: string]: any } {
        if (c.value !== null) {
            const str = String(c.value);

            if (str !== '' && str.trim().length === 0) {
                return { validateEmpty: true };
            }
        }
        return null;
    }
}
