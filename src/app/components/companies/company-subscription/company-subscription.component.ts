import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompanySubscription } from '../class/company-subscription';
import { CompanySubscriptionStateService } from './class/company-subscription-state.service';
import { UserCustomerCompaniesInfo } from '../../users/class/user-customer-companies-info';

@Component({
  selector: 'app-company-subscription',
  templateUrl: './company-subscription.component.html',
  styleUrls: ['./company-subscription.component.scss']
})
export class CompanySubscriptionComponent implements OnInit, OnDestroy {
  sub = new Subscription();
  @Input() companyId: string;
  @Input() customerCompaniesInfo: Array<UserCustomerCompaniesInfo> = [];
  @Output() subscribeChange = new EventEmitter();
  subscriptions: Array<CompanySubscription> = [new CompanySubscription('Ticket Updates', 'ticketSubscription'),
  new CompanySubscription('Ticket Manager', 'ticketManagerSubscription'),
  new CompanySubscription('Invoice Updates', 'invoiceSubscription')];
  /**
   * Creates an instance of the TagsComponent with the injected services
   * @param {TagsService} tagsService Service to work with tags
   * @param {TagsStateService} tagsState to work with tags state
   */
  public constructor(
    private companySubscriptionState: CompanySubscriptionStateService
  ) { }

  /**
   * Initializes modal quotes. See [ngOnInit]{@see OnInit#ngOnInit}
   */
  public ngOnInit() {
    let customerCompaniesInfo = this.customerCompaniesInfo.find(item => item.companyId == this.companyId);
    if (customerCompaniesInfo) this.subscriptions.forEach(item => item.selected = customerCompaniesInfo.defaultSubscriptions[item.field].enabled);
    this.onInitClearState();
    this.onCheckEditItem();
  }

  /**
  * Subscribe for edit mode
  */
  private onCheckEditItem() {
    let getEditMode = this.companySubscriptionState.getOnEditMode().subscribe((data) => {
      this.subscriptions.forEach(item => item.selected = data[item.field]);
    })
    this.sub.add(getEditMode);
  }

  /**
  * Subscribe for clear data
  */
  private onInitClearState() {
    let getClearState = this.companySubscriptionState.getClearState().subscribe(() => this.close());
    this.sub.add(getClearState);
  }

  /**
   * Remove tag from selected
   * @param index - user index
   */
  public remove(index): void {
    if (index >= 0) {
      this.subscriptions[index].selected = false;
      this.subscribeChange.emit(this.subscriptions);
    }
  }

  /**
   * Add tag to selected
   * @param tag - selected tag
   */
  public selected(index): void {
    this.subscriptions[index].selected = !this.subscriptions[index].selected;
    this.subscribeChange.emit(this.subscriptions);
  }

  /**
   * Close tags list
   */
  public close() {
    this.subscriptions.forEach(item => item.selected = false);
    this.subscribeChange.emit(this.subscriptions);
  }

  public trackById(index, item) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
