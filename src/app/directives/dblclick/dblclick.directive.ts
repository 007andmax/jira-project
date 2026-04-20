import { Directive, HostListener, ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Directive({
    selector: '[appDoubleClick]',
    standalone: true,
})
export class DblclickDirective {
  @Output() doubleClick = new EventEmitter<void>();

  @HostListener('dblclick', ['$event'])
  onDoubleClick(event: Event): void {
    this.doubleClick.emit();
  }
}
