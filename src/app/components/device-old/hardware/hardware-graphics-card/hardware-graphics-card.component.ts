import { Component, Input, OnInit } from '@angular/core';
import { Graphics } from '../class/system';
import { NgIf } from '@angular/common';

@Component({
    selector: 'hardware-graphics-card',
    templateUrl: './hardware-graphics-card.component.html',
    styleUrls: ['./hardware-graphics-card.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class HardwareGraphicsCardComponent implements OnInit {
  @Input() graphics: Graphics;
  constructor() { }

  ngOnInit() {
  }

}
