import { Directive, Injectable, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../services/common/common.service';

@Directive({
  selector: '[decimalNumber]',
  providers: [CommonService]
})
@Injectable()
export class DecimalNumberDirective {
  @Output() onChange = new EventEmitter();
  @Input("useFixed") useFixed: boolean = false;
  constructor(private element: ElementRef, private commonService: CommonService) { }
  ngOnInit() {
    this.element.nativeElement.addEventListener("input", (event) => {
      console.log("this.commonService.validateNumber(event.target.value)", this.commonService.validateNumber(event.target.value));
      event.target.value = this.commonService.validateNumber(event.target.value);
      this.onChange.emit(event.target.value);
    });
    this.element.nativeElement.addEventListener("blur", (event) => {
      if (event.target.value && event.target.value !== "NaN") {
        console.log("parseFloat(event.target.value)", event.target.value);
        console.log("parseFloat(event.target.value)", parseFloat(event.target.value));
        if (this.useFixed) {
          if (parseFloat(event.target.value) !== NaN) event.target.value = parseFloat(event.target.value).toFixed(2);
        }
      } else {
        event.target.value = (this.useFixed) ? "0.00" : "0";
      }
      console.log("event.target.value", event.target.value);
      this.onChange.emit(event.target.value);
    });
  }

  ValidateMoney(event: any) {
    let value = Number(event.target.value);
    if (!value && event.target.value !== "") return "";
    if (value < 0) return 0;
  }

}
