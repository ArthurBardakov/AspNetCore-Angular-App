import { Directive, Attribute, OnDestroy } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[userExists]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: UserExistenceValidator, multi: true}
  ]
})

export class UserExistenceValidator implements Validator, OnDestroy {

  private emailControlVal: string;
  private $destroyed = new Subject();

  constructor(@Attribute('userExists') public expectation: any,
              private apiService: ApiService) {
      this.expectation = this.expectation === 'true';
  }

  validate(form: FormGroup): { [key: string]: any } {
    const emailControl: AbstractControl = form.controls.email;

    if (emailControl) {
      if (emailControl.valid && emailControl.value !== this.emailControlVal) {
        this.emailControlVal = emailControl.value;
        this.apiService.UserExists(this.emailControlVal)
          .pipe(take(1), takeUntil(this.$destroyed))
          .subscribe(res => this.checkResponse(res, emailControl));
      }
    }

    return null;
  }

  private checkResponse(res: boolean, emailControl: AbstractControl): void {
    if (this.expectation === true) {

      if (res === false) {
        emailControl.setErrors({userExists: 'There is no such a user.'});
      }
    } else if (res === true) {
      emailControl.setErrors({userExists: 'A user with such an email already exists.'});
    }
  }

  ngOnDestroy(): void {
    this.$destroyed.unsubscribe();
  }
}
