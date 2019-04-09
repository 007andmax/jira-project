import { Directive, HostListener, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appRemoveFocus]'
})
export class RemoveFocusDirective {

  constructor(private elRef: ElementRef, private renderer: Renderer) { }

  @HostListener('click') onClick() {
    console.log('test');
    this.renderer.invokeElementMethod(this.elRef.nativeElement, 'blur', []);
  }

}
