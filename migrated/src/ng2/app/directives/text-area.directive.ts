import { Directive, OnInit, ElementRef, Injectable, Input, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTextArea]'
})
export class TextAreaDirective implements OnInit, OnDestroy {

  cloned: HTMLTextAreaElement;
  lines: number = 1;
  height: number = 0;
  @Input() limit;
  @Input() minHeight;
  @Output() onPast = new EventEmitter<any>();
  block: boolean = false;
  ctrlDown: boolean = false;
  keyCode = null;
  constructor(private element: ElementRef, public cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.minHeight) this.element.nativeElement.style.minHeight = this.minHeight + "px";
    this.element.nativeElement.style.visibility = 'visible';
    this.element.nativeElement.style.display= 'block';
    this.element.nativeElement.parentNode.style.position = 'relative';
    /* this.element.nativeElement.addEventListener('keydown', this.limitLines, false);
     this.element.nativeElement.addEventListener('keypress', this.limitLines, false);*/
   // this.element.nativeElement.addEventListener('keyup', this.onKeyUp, false);
   this.element.nativeElement.addEventListener('keyup', this.onKeyUp, false);
    /* this.element.nativeElement.addEventListener('cut', this.setNumberOfLines, false);
     this.element.nativeElement.addEventListener('paste', this.limitPaste, false);
     this.element.nativeElement.addEventListener('input', this.onUpdate, false);*/



    //   this.onCheckReset();
  }
  ngDoCheck() {

  }
  public onKeyUp = (e) => {
    
    this.lines = this.getNumberOfLines(this.element.nativeElement.value);
    if (e.keyCode == 13 && this.lines <= 5) {
        this.element.nativeElement.setAttribute("rows",this.lines);
    }
    if (e.keyCode == 8) {
      this.element.nativeElement.setAttribute("rows",this.lines);
    }
  }
  private getNumberOfLines(str) {
    if (str) {
      return str.split(/\r\n|\r|\n/).length;
    }
    return 1;
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy ------------");
    /* this.element.nativeElement.removeEventListener('keydown', this.limitLines, false);
     this.element.nativeElement.removeEventListener('keyup', this.setNumberOfLines, false);
     this.element.nativeElement.removeEventListener('cut', this.setNumberOfLines, false);
     this.element.nativeElement.removeEventListener('paste', this.limitPaste, false);
     this.element.nativeElement.removeEventListener('input', this.onUpdate, false);*/

  }
  //attr.$set("ngTrim", "false");



}
