import {
    Directive,
    ElementRef, Injectable
} from '@angular/core';

@Directive({
    selector: '[number]',
})
@Injectable()
export class numberDirective {
    lastValue:number = 1;
    constructor(private element: ElementRef) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener("keyup", (event) => {
            this.ValidateMoney(event);
        });
    }
  /*  ngAfterViewChecked () {
     //   console.log('value',this.element.nativeElement.value);
        this.ValidateMoney(this.element.nativeElement.value);
    }*/
    ValidateMoney(event: any) {
        let value = Number(event.target.value);
        if (!value) {
            event.target.value = this.lastValue;
            return;
        }
        if (value < 0) {
            event.target.value = 1;
        } 
        this.lastValue = Number(JSON.parse(JSON.stringify(event.target.value)));

    }

}