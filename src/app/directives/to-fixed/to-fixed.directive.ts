import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appToFixed]'
})
export class ToFixedDirective {
  @Input("count") count: number = 2;
  blockCheck = false;
  constructor(private element: ElementRef) { }
  ngOnInit() {

    this.element.nativeElement.addEventListener("focus", (event) => {
      this.blockCheck = true;
    });

    this.element.nativeElement.addEventListener("blur", (event) => {
      this.blockCheck = false;
    });
  }
  ngAfterViewInit() {
    this.parseValue();
  }
  ngDoCheck() {
    if (this.blockCheck) return;
    this.parseValue();
  }
  parseValue() {
    let value = this.element.nativeElement.value;
    if (!Number.isNaN(parseFloat(value))) this.element.nativeElement.value = parseFloat(value).toFixed(this.count);
  }
}
