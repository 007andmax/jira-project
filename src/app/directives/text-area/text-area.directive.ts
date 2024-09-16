import { Directive, OnInit, ElementRef, Injectable, Input, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
var $ = require("jquery");
@Directive({
  selector: '[appTextArea]'
})
export class TextAreaDirective implements OnInit {

  cloned: HTMLTextAreaElement;
  lines: number = 1;
  height: number = 0;
  @Input() lineHeight = false;
  @Input() limit;
  @Input() default;
  @Input() minHeight;
  @Input() maxLines;
  @Output() onPast = new EventEmitter<any>();
  block: boolean = false;
  ctrlDown: boolean = false;
  keyCode = null;
  ruler = document.getElementById('ruler');
  constructor(private element: ElementRef, public cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (!this.maxLines) this.maxLines = 5;
    if (this.minHeight) this.element.nativeElement.style.minHeight = this.minHeight + "px";


    this.element.nativeElement.addEventListener('input', function () {
      // Reset the height to auto to calculate the new height
      this.style.height = 'auto';

      // Get the scroll height and set the new height accordingly
      let computedStyle = getComputedStyle(this);
      console.log("computedStyle.paddingTop", computedStyle.paddingTop);
      const newHeight = this.scrollHeight + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

      // Set height, but limit it to the maximum height
      if (newHeight <= 200) {
        this.style.height = `${newHeight}px`;
      } else {
        this.style.height = `${200}px`;
        this.style.overflowY = 'scroll';  // Show scrollbar when max height is reached
      }
    });
  }
  ngDoCheck() {
    if (this.element.nativeElement.value !== "" && !this.block) {
      this.element.nativeElement.style.height = 'auto';

      // Get the scroll height and set the new height accordingly
      let computedStyle = getComputedStyle(this.element.nativeElement);
      console.log("computedStyle.paddingTop", computedStyle.paddingTop);
      const newHeight = this.element.nativeElement.scrollHeight + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

      // Set height, but limit it to the maximum height
      if (newHeight <= 200) {
        this.element.nativeElement.style.height = `${newHeight}px`;
      } else {
        this.element.nativeElement.style.height = `${200}px`;
        this.element.nativeElement.style.overflowY = 'scroll';  // Show scrollbar when max height is reached
      }
      this.block = true;
    }
    /*  if (this.element.nativeElement.value === "") {
        this.element.nativeElement.setAttribute("rows", (this.default) ? this.default : 1);
      } else {
        this.lines = this.getNumberOfLines(this.element.nativeElement.value);
        console.log("this.lines", this.element.nativeElement.value.split('\n').length);
        if (this.lines <= this.maxLines) {
          this.element.nativeElement.setAttribute("rows", (this.default && this.default > this.lines) ? this.default : this.lines + 1);
        } else {
          this.element.nativeElement.setAttribute("rows", this.maxLines);
        }
      }
      this.getMaxCharsPerLine();*/
  }
  getMaxCharsPerLine() {
    // Set ruler text to "W" as it's usually the widest character in a monospace font
    this.ruler.textContent = 'W'.repeat(1000);

    // Measure how many 'W's fit in the textarea width
    const textareaWidth = this.element.nativeElement.clientWidth;
    const textWidth = this.ruler.offsetWidth / 1000; // average width of one "W" character

    // Calculate max characters per line
    const maxChars = Math.floor(textareaWidth / textWidth);


    // Display the result
    if (maxChars > 0) console.log("maxChars", maxChars);
  }
  private getNumberOfLines(str) {
    if (this.lineHeight) {
      let lineHeight = parseInt($('.qt-editable-input').css('lineHeight'));
      var vs = this.element.nativeElement.scrollHeight > this.element.nativeElement.clientHeight;
      return vs ? Math.ceil(this.element.nativeElement.scrollHeight / lineHeight) : this.lines;
    }
    if (str) {
      return str.split(/\r\n|\r|\n/).length;
    }
    return 1;
  }

}
