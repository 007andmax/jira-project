import { Component, Input, OnInit } from '@angular/core';
import { Display } from '../class/system';

@Component({
    selector: 'hardware-display',
    templateUrl: './hardware-display.component.html',
    styleUrls: ['./hardware-display.component.scss'],
    standalone: true
})
export class HardwareDisplayComponent implements OnInit {
  @Input() display: Display;
  constructor() { }

  ngOnInit() {
  }

}
