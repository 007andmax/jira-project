import { Directive, OnInit, ElementRef, Injectable, Input, ChangeDetectorRef, OnChanges, SimpleChanges, AfterContentChecked, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AppStateService } from 'src/app/states/app/app-state.service';
var $ = require("jquery");
@Directive({
  selector: '[appTextArea]'
})
export class TextAreaDirective implements OnInit {
  @Input() height = 'auto';
  @Input() checkScrollHeight = false;
  @Input() maxHeight;
  @Output() onPast = new EventEmitter<any>();
  block: boolean = false;
  constructor(private element: ElementRef, public cd: ChangeDetectorRef,
    private appStateService: AppStateService,
  ) {
  }

  ngOnInit() {

    this.element.nativeElement.addEventListener('input', () => {
      // Reset the height to auto to calculate the new height
      this.element.nativeElement.style.height = this.height;

      // Get the scroll height and set the new height accordingly
      let computedStyle = getComputedStyle(this.element.nativeElement);
      const newHeight = this.element.nativeElement.scrollHeight + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

      // Set height, but limit it to the maximum height
      if (newHeight <= this.maxHeight) {
        this.element.nativeElement.style.height = `${newHeight}px`;
      } else {
        this.element.nativeElement.style.height = `${this.maxHeight}px`;
        this.element.nativeElement.style.overflowY = 'scroll';  // Show scrollbar when max height is reached
      }
    });
  }
  ngDoCheck() {
    if (this.element.nativeElement.value !== "" && !this.block) {
      if (this.checkScrollHeight && this.element.nativeElement.scrollHeight == 0) return;
      this.element.nativeElement.style.height = this.height;
      // Get the scroll height and set the new height accordingly
      let computedStyle = getComputedStyle(this.element.nativeElement);
      const newHeight = this.element.nativeElement.scrollHeight + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      // Set height, but limit it to the maximum height
      if (newHeight <= this.maxHeight) {
        this.element.nativeElement.style.height = `${newHeight}px`;
      } else {
        this.element.nativeElement.style.height = `${this.maxHeight}px`;
        this.element.nativeElement.style.overflowY = 'scroll';  // Show scrollbar when max height is reached
      }
      this.block = true;
      // this.appStateService.changeDetectorRef();
    }
  }
}
