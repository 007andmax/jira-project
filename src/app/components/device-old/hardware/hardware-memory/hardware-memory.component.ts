import { Component, Input, OnInit } from '@angular/core';
import { Memory } from '../class/system';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'hardware-memory',
    templateUrl: './hardware-memory.component.html',
    styleUrls: ['./hardware-memory.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf]
})
export class HardwareMemoryComponent implements OnInit {
  @Input() memory: Array<Memory> = [];
  constructor() { }

  ngOnInit() {
  }

}
