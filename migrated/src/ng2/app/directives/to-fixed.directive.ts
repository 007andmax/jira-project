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
  ngDoCheck() {
    if (this.blockCheck) return;
    let value = this.element.nativeElement.value;
    this.element.nativeElement.value = parseFloat(value).toFixed(this.count);
  }
}
