import { Directive, OnInit, ElementRef, Injectable, Input, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, Output, EventEmitter, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTextArea]'
})
export class TextAreaDirective implements OnInit {

  cloned: HTMLTextAreaElement;
  lines: number = 1;
  height: number = 0;
  @Input() limit;
  @Input() minHeight;
  @Input() maxLines = 5;
  @Output() onPast = new EventEmitter<any>();
  block: boolean = false;
  ctrlDown: boolean = false;
  keyCode = null;
  constructor(private element: ElementRef, public cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (this.minHeight) this.element.nativeElement.style.minHeight = this.minHeight + "px";
    this.element.nativeElement.style.visibility = 'visible';
    this.element.nativeElement.style.display = 'block';
    this.element.nativeElement.parentNode.style.position = 'relative';
  }
  ngDoCheck() {

    if (this.element.nativeElement.value === "") {
      this.element.nativeElement.setAttribute("rows", 1);
    } else {
      this.lines = this.getNumberOfLines(this.element.nativeElement.value);
      if (this.lines <= this.maxLines) {
        this.element.nativeElement.setAttribute("rows", this.lines);
      }else {
        this.element.nativeElement.setAttribute("rows", (this.lines < 5) ? this.lines : 5);
      }
    }
  }

  private getNumberOfLines(str) {
    if (str) {
      return str.split(/\r\n|\r|\n/).length;
    }
    return 1;
  }

}
