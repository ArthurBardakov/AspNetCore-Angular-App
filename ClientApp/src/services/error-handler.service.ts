import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

@Injectable()
export class ErrorHandlerService {

    public SetServerErrors(errObj: any, model: any, form: NgForm): void {
        const props = Object.keys(model);
        let upCaseProp: string;
        let errVal: string;

        props.forEach(p => {
            if (errObj.errors !== undefined) {
                upCaseProp = p[0].toUpperCase() + p.slice(1, p.length);
                errVal = errObj.errors[upCaseProp];

                if (errVal !== undefined) {
                    if (form.controls[p] !== undefined) {
                        form.controls[p].setErrors({server: errVal});
                    } else {
                        form.control.setErrors({server: errVal});
                    }
                }
            } else if (errObj.error === 'invalid_grant') {
                form.controls.password.setErrors({server: ['Invalid password!']});
            } else {
                form.control.setErrors({server: ['Some server error occured, try again later, please!']});
            }
        });
    }
}
