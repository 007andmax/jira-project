import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appClickOtside]',
  exportAs: 'click'
})
export class ClickOtsideDirective {
  @Input() init: boolean = false;
  @Input() class: string = "";
  @Output() onOutSide = new EventEmitter<any>();
  constructor(private eRef: ElementRef) { }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.init) return;
    if ($(event.target).parents(this.class).length != 0) return;
    this.onOutSide.emit(true);
  }
  public setInit(data) {
    this.init = data;
  }
  public getInit() {
    return this.init;
  }
}
