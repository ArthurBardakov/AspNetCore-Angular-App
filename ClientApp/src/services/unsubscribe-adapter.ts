import { OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

// TODO: Add Angular decorator.
export class UnsubscribeOnDestroyAdapter implements OnDestroy {

    subs = new SubSink();

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
