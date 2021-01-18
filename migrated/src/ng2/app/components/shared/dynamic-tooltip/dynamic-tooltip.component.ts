import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-dynamic-tooltip',
  templateUrl: './dynamic-tooltip.component.html',
  styleUrls: ['./dynamic-tooltip.component.scss']
})
export class DynamicTooltipComponent implements OnInit {
  @Input() content: string;
  @Input() position: string = 'top';
  constructor(private elRef: ElementRef) { }

  ngOnInit() {

  }
  public show(target) {
    console.log("target", target);
    const tooltip = this.elRef.nativeElement.querySelector('#tooltip');
    createPopper(target, tooltip, {
      placement: <any>this.position,
    });
    this.elRef.nativeElement.querySelector('#tooltip').classList.add('show');
  }
  public hide() {
    this.elRef.nativeElement.querySelector('#tooltip').classList.remove('show');
  }

}
