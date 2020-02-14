import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TYPE_QUOTE } from 'src/ng2/app/const/services';

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
  @Input() type:string;
  public client: any;
  public isFormValid = false;
  /**
   * Creates an instance of the ServicesListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(private elRef: ElementRef,
    public cd: ChangeDetectorRef,) { }

  /**
   * Initializes service list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {
      
    if (this.editItem && this.editItem.duration) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
  if (this.editItem && this.type === TYPE_QUOTE) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
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
    this.cd.detectChanges();
  }



}
