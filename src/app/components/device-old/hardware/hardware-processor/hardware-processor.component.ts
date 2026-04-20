import { Component, Input, OnInit } from '@angular/core';
import { Processor } from '../class/system';

@Component({
    selector: 'hardware-processor',
    templateUrl: './hardware-processor.component.html',
    styleUrls: ['./hardware-processor.component.scss'],
    standalone: true
})
export class HardwareProcessorComponent implements OnInit {
  @Input() processors: Processor;
  constructor() { }

  ngOnInit() {
  }

}
