import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { createPopper } from '@popperjs/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-dynamic-tooltip',
  templateUrl: './dynamic-tooltip.component.html',
  styleUrls: ['./dynamic-tooltip.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DynamicTooltipComponent implements OnInit {
  @Input() content: string;
  @Input() position: string = 'top';
  @Input() disableTooltip: boolean = false;
  popperInstance = null;

  constructor(private elRef: ElementRef) { }

  ngOnInit() {

  }
  public setContent(data) {
    this.content = data;
  }
  public show(target) {
    if (this.disableTooltip) return;
    let tooltip = this.elRef.nativeElement.querySelector('#tooltip');
    this.popperInstance = createPopper(target, tooltip, {
      placement: <any>this.position,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
        {
          name: 'flip',
          enabled: false,
        },
      ],
    });
    this.elRef.nativeElement.querySelector('#tooltip').classList.add('show');
    tooltip = null;
  }
  public hide() {
    if (this.disableTooltip) return;
    this.elRef.nativeElement.querySelector('#tooltip').classList.remove('show');
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}
