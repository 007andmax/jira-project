import { Directive, ElementRef, Injectable } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';

@Directive({
    selector: '[appInteger]',
    providers: [CommonService],
    standalone: true
})
@Injectable()
export class IntegerDirective {

  lastValue: number = 1;
  constructor(private element: ElementRef, private commonService: CommonService) { }
  ngOnInit() {

    this.element.nativeElement.addEventListener("input", (event) => {
      event.target.value = event.target.value != '' ? this.commonService.validateNumber(event.target.value, 'integer') : '';
    });
    this.element.nativeElement.addEventListener("blur", (event) => {
      if (event.target.value) {
        event.target.value = parseInt(event.target.value)
      } else {
        event.target.value = 0;
      }
    });
  }

}
