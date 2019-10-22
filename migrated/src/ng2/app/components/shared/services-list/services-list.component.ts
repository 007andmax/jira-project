import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('products') products_dropDown: NgbDropdown;
  @Input() editItem: any;
  @Input() itemList: any;
  @Output() serviceList: any;
  @Output() selectedServicesItem = new EventEmitter<any>();
  public client: any;
  public isFormValid = false;
  /**
   * Creates an instance of the ServicesListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(private elRef: ElementRef) { }

  /**
   * Initializes service list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
    console.log('this.editItem',this.editItem);
    if (this.editItem && this.editItem.duration) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
  }



  /**
  * Get name serivce / produuct
  *  @param item - serivce / produuct
  */
   getNameOrDescription(item) {
    
    if (item && item.name) return item.name;
    return '';
  }

  /**
   * select service item and emit
   * @param item - selected services item
   */
  public selectServicesItem(item) {
    this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(item);
    this.products_dropDown.close();
    this.selectedServicesItem.next(item)
  }



}
