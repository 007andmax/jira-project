import { ChangeDetectorRef, Component, ElementRef, Input } from '@angular/core';
import { DropDownComponent } from 'src/app/components/shared/drop-down/drop-down.component';
import { Card } from '../../manage-cards/class/card';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { CustomerPortalStateService } from 'src/app/states/customer-portal/customer-portal-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';
import { ManageCardsService } from 'src/app/services/manage-cards/manage-cards.service';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-payments-cards',
  templateUrl: './payments-cards.component.html',
  styleUrls: ['./payments-cards.component.scss'],
  providers: [TicketsListService]
})
export class PaymentsCardsComponent extends DropDownComponent {
  @Input() selectedCompanies = [];;
  list: Array<Card> = [];
  showPreloader: boolean = true;
  showPendingPreloader: boolean = true;
  infiniteScrollDisabled: boolean = true;
  page: number = 0;
  constructor(public elRef: ElementRef,
    public companiesStateService: CompaniesStateService,
    public usersStateService: UsersStateService,
    public customerPortalStateService: CustomerPortalStateService,
    public companiesService: CompaniesService,
    public devicesService: DevicesService,
    private ticketsListService: TicketsListService,
    public ref: ChangeDetectorRef,
    private manageCardsService: ManageCardsService,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
  }

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    this.ref.markForCheck();
  }
  onOpenChange(event) {
    if (event) {
      this.setDefaultScoll();
      this.onScroll();
    }
  }
  onSelect(data) {
    this.isAdd = false;
    this.selectedItem = data;
    this.onSelectedItem.emit(data);
    this.dp.close();
    this.ref.detectChanges();
  }
  public setDefaultScoll() {
    this.showPreloader = true;
    this.page = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCard();
  }
  getCard() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.page > 0) { this.showPendingPreloader = true; } else {
      this.showPreloader = true;
    }
    this.manageCardsService.getCards(this.page, { companyIds: this.selectedCompanies.map(item => item.id) }).subscribe((res: any) => {
      this.list = [...this.list, ...res.cards.map(item => new Card(item))];
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.infiniteScrollDisabled = false;
      if (res.totalElements === this.list.length) this.ticketsListService.setBlockList(true);
      this.page += 1;
      this.ref.detectChanges();
    });
  }
}
