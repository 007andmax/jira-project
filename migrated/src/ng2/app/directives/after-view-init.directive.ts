import { Directive, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appAfterViewInit]'
})
export class AfterViewInitDirective {
  @Output() onInit = new EventEmitter<any>();
  constructor() { }
  ngAfterViewInit() {
    this.onInit.emit(null);
  }
}
