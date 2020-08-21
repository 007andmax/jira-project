import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DefaultServices } from './class/default-service';
import { DefaultServicesService } from 'src/ng2/app/services/default-services/default-services.service';
import { DefaultServicesFilter } from './class/default-services-filter';

@Component({
  selector: 'default-services',
  templateUrl: './default-services.component.html',
  styleUrls: ['./default-services.component.scss']
})
export class DefaultServicesComponent implements OnInit {
  showCreateService: boolean = false;
  list: Array<DefaultServices> = [];
  filter: DefaultServicesFilter = new DefaultServicesFilter();
  constructor(private defaultServicesService: DefaultServicesService,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.defaultServicesService.getDefaultServices().subscribe((data:Array<DefaultServices>) => {
      this.list = data;
      this.filter.onFilter('name', this.list);
      this.cd.detectChanges();
    })
  }
  public onFilter(field) {
    this.filter.onFilter(field, this.list);
    this.cd.detectChanges();
   
  }
 
}
