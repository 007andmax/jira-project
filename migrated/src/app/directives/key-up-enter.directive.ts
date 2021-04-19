import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appKeyUpEnter]'
})
export class KeyUpEnterDirective {
  @Output() onChange = new EventEmitter<any>();
  constructor(private element: ElementRef) { }
  ngOnInit() {
    this.element.nativeElement.addEventListener("keyup", (event) => {
      if (event.keyCode === 13) this.onChange.emit(event);

    });

  }
}
