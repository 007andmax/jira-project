import { Directive, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Directive({
    selector: '[appClickOtside]',
    exportAs: 'click',
    standalone: true
})
export class ClickOutsideDirective {
  @Input() init: boolean = false;
  @Input() classParent: string = "";
  @Output() onOutSide = new EventEmitter<any>();
  constructor(private eRef: ElementRef) { }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.init) return;
    if ($(event.target).parents(this.classParent).length != 0) return;
    this.onOutSide.emit(event);
  }
  public setInit(data) {
    this.init = data;
  }
  public getInit() {
    return this.init;
  }
}
