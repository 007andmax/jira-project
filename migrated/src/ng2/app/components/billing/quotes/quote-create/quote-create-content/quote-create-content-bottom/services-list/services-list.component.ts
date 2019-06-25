import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 *  Service list component
 */
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

  /**
   * Creates an instance of the ServicesListComponent with the injected services
   */
  constructor() { }

  /**
   * Initializes service list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {}

  /**
   * select service item and emit
   */
  public selectServicesItem(item) {
    this.selectedServicesItem.next(item)
  }



}
