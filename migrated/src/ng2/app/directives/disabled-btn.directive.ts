import { Directive, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDisabledBtn]',
  exportAs: 'disabled'
})
export class DisabledBtnDirective {
  block: boolean = false;
  @Output() onClick = new EventEmitter<any>();
  constructor(private elRef: ElementRef) { }

  public setDisabled(data) {
    this.block = data;
  }
  @HostListener('click', ['$event'])
  clickout(event) {
    if (!this.block) this.onClick.emit(null);

  }
}
