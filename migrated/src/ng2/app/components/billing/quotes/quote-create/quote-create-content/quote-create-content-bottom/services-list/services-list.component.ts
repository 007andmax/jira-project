import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesListComponent implements OnInit {

  @Input() itemList: any;
  @Output() serviceList: any;
  @Output() selectedServicesItem = new EventEmitter<any>();
  public client: any;

  constructor() { }

  ngOnInit() {}

  public selectServicesItem(item) {
    this.selectedServicesItem.next(item)
  }



}
