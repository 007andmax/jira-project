import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TYPE_QUOTE, TYPE_TICKET } from 'src/app/const/services';
import { TicketStateService } from '../../tickets/tickets/ticket-edit-aside/services/ticket-state.service';
import { Subscription } from 'rxjs';

/**
 *  Service list component
 */
@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesListComponent implements OnInit, OnDestroy {
  @ViewChild('products') products_dropDown: NgbDropdown;
  @Input() isDisabled: boolean = false;
  preloader: boolean = false;
  @Input() editItem: any;
  @Input() itemList: any;
  @Output() serviceList: any;
  @Output() selectedServicesItem = new EventEmitter<any>();
  @Input() type: string;
  searchName: string = null;
  public client: any;
  public isFormValid = false;
  sub: Subscription = new Subscription();
  /**
   * Creates an instance of the ServicesListComponent with the injected services
   * @param {ElementRef} elRef Service to work with template
   */
  constructor(private elRef: ElementRef,
    public cd: ChangeDetectorRef,
    public ticketStateService: TicketStateService) { }


  /**
   * Initializes service list. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  ngOnInit() {

    if (this.editItem && this.editItem.duration) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
    if (this.editItem && this.type === TYPE_QUOTE) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
    if (this.editItem && this.type === TYPE_TICKET) this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
    let onServicePreloader = this.ticketStateService.onServicePreloader.subscribe(data => {
      console.log("onServicePreloader", data);
      this.isDisabled = data;
      this.preloader = data;
      this.clear();
      this.cd.detectChanges();
    })
    this.sub.add(onServicePreloader);
  }
  public onFocus(event) {
    if (!this.products_dropDown.isOpen()) this.products_dropDown.open();
  }
  onSearch(event) {
    this.searchName = (event.target.value.length > 0) ? event.target.value : null
  }

  public setEditItem(data) {
    this.editItem = data;
    this.elRef.nativeElement.querySelector('#dropdownServices').value = this.getNameOrDescription(this.editItem);
    this.cd.detectChanges();
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
    this.selectedServicesItem.next(item);
    this.searchName = null;
    this.cd.detectChanges();
  }
  public isSelected(id) {
    return this.editItem && this.editItem.name && this.editItem.versionedId.id == id;
  }

  public clear() {
    this.elRef.nativeElement.querySelector('#dropdownServices').value = '';
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
