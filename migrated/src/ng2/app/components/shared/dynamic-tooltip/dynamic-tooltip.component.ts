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
  @Input() disableTooltip: boolean = false;
  constructor(private elRef: ElementRef) { }

  ngOnInit() {

  }
  public show(target) {
    console.log("target", target);
    if (this.disableTooltip) return;
    const tooltip = this.elRef.nativeElement.querySelector('#tooltip');
    createPopper(target, tooltip, {
      placement: <any>this.position,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    });
    this.elRef.nativeElement.querySelector('#tooltip').classList.add('show');
  }
  public hide() {
    if (this.disableTooltip) return;
    this.elRef.nativeElement.querySelector('#tooltip').classList.remove('show');
  }

}
