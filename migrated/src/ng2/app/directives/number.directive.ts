import {
    Directive,
    ElementRef, Injectable, Input
} from '@angular/core';
import { Validators } from '@angular/forms';
import { CommonService } from '../services/common/common.service';

@Directive({
    selector: '[number]',
    providers: [CommonService]
})
@Injectable()
export class numberDirective {
    lastValue: number = 1;
    @Input("money") money: boolean = false;
    constructor(private element: ElementRef, private commonService: CommonService) { }
    ngOnInit() {

        this.element.nativeElement.addEventListener("input", (event) => {
            event.target.value = this.commonService.validateNumber(event.target.value);
        });
        if (this.money) {
            this.element.nativeElement.addEventListener("blur", (event) => {
                if (event.target.value) event.target.value = parseFloat(event.target.value).toFixed(2);
            });
        }

    }

    ValidateMoney(event: any) {
        let value = Number(event.target.value);
        if (!value && event.target.value !== "") {
            event.target.value = this.lastValue;
            return;
        }
        if (value < 0) {
            event.target.value = 1;
        }
        if (event.target.value !== "") {
            this.lastValue = Number(JSON.parse(JSON.stringify(event.target.value)));
        } else {
            this.lastValue = 1;
        }

    }

}