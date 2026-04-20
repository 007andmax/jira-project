import { Component, ContentChildren, ElementRef, Input, OnChanges, OnInit, QueryList, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-mat-form-field',
    templateUrl: './mat-form-field.component.html',
    styleUrls: ['./mat-form-field.component.scss'],
    standalone: true,
    imports: [NgClass],
})
export class MatFormFieldComponent implements OnInit {
  classes = [];
  @Input() placeholder: string;
  constructor(private elRef: ElementRef,) { }

  ngOnInit() {

  }

  public checkSelectedItems(data) {
    if (data.length > 0 && !this.classes.some(item => item == "mat-form-selected")) this.classes.push("mat-form-selected");
    if (data.length == 0 && this.classes.some(item => item == "mat-form-selected")) {
      let index = this.classes.findIndex(item => item == "mat-form-selected");
      this.classes.splice(index, 1);

    }
  }
  ngAfterViewInit() {
    this.elRef.nativeElement.querySelector("input").onfocus = () => {
      if (!this.classes.some(item => item == "mat-focused")) this.classes.push("mat-focused");
    }
    this.elRef.nativeElement.querySelector("input").onblur = () => {
      if (this.classes.some(item => item == "mat-focused")) {
        let index = this.classes.findIndex(item => item == "mat-focused");
        this.classes.splice(index, 1);
      }
    }
  }

}
