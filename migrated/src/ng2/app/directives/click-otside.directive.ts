import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appClickOtside]'
})
export class ClickOtsideDirective {
@Input() init:boolean = false;
  constructor(private eRef: ElementRef) { }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
     // this.text = "clicked inside";
    } 
  }
}
