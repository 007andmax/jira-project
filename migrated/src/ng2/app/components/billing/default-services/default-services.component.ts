import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DefaultServices } from './class/default-service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';

@Component({
  selector: 'default-services',
  templateUrl: './default-services.component.html',
  styleUrls: ['./default-services.component.scss']
})
export class DefaultServicesComponent implements OnInit {
  showCreateService: boolean = false;
  list: Array<DefaultServices> = [];
  constructor(private defaultServicesService: DefaultServicesService) { }

  ngOnInit() {
    this.defaultServicesService.getDefaultServices().subscribe((data:Array<DefaultServices>) => {
      this.list = data;

    })
  }

}
