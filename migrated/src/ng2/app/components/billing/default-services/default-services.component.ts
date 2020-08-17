import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'default-services',
  templateUrl: './default-services.component.html',
  styleUrls: ['./default-services.component.scss']
})
export class DefaultServicesComponent implements OnInit {
  showCreateService: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
