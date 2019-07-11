import {
    Directive,
    ElementRef, Injectable
} from '@angular/core';

@Directive({
    selector: '[number]',
})
@Injectable()
export class numberDirective {

    constructor(private element: ElementRef) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener("keyup", (event) => {
            this.ValidateMoney(event);
        });
    }
    ValidateMoney(event: any) {
        let value = Number(event.target.value);
        if (!value) {
            event.target.value = "";
        }
        if (value < 0) {
            event.target.value = 1;
        }

    }

}