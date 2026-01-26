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
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { REMOVE_CARD } from 'src/app/const/confirm';
import { ManageCardsRealTimeService } from 'src/app/states/manage-cards/manage-cards-real-time.service';
import { IntegrationsStateService } from 'src/app/states/integrations/integrations-state.service';

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
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    public ref: ChangeDetectorRef,
    public integrationsStateService: IntegrationsStateService,
    private manageCardsRealTimeService: ManageCardsRealTimeService,
    private manageCardsStateService: ManageCardsStateService,
    private manageCardsService: ManageCardsService,) {
    super(elRef, companiesStateService, usersStateService, customerPortalStateService, companiesService, devicesService, ref);
  }

  ngOnInit() {
    if (this.class.length > 0) this.class = this.class;
    if (this.uiType) this.class.push(this.uiType);
    this.ref.markForCheck();
    let changeCardsArray = this.manageCardsRealTimeService.changeCardsArray.subscribe((newChange: any) => {
      if (newChange.action === 'PAYMENT_CARD_SAVED') {
        let index = this.list.findIndex(item => item.id == newChange.data.id);
        if (index == -1) this.list.push(new Card(newChange.data));
      } else if (newChange.action === 'PAYMENT_CARD_EDITED') {
        let index = this.list.findIndex(item => item.id === newChange.data.id);
        if (index > -1) this.list[index] = new Card(newChange.data);
      } else if (newChange.action === 'PAYMENT_CARD_REMOVED') {
        let indexList = this.list.findIndex(item => item.id === newChange.data);
        if (indexList > -1) this.list.splice(indexList, 1);
      }
      if (!this.ref['destroyed']) this.ref.detectChanges();
    });
    this.sub.add(changeCardsArray);
    let onFastRemove = this.manageCardsStateService.onFastRemove.subscribe((cardId) => {
      let indexList = this.list.findIndex(item => item.id === cardId);
      if (indexList > -1) this.list.splice(indexList, 1);
    });
    this.sub.add(onFastRemove);
    let onFastEdit = this.manageCardsStateService.onFastEdit.subscribe((data) => {
      let index = this.list.findIndex(item => item.id === data.id);
      if (index > -1) this.list[index] = new Card(data);
    });
    this.sub.add(onFastEdit);
  }
  checkCardForRemove() {
    if (this.selectedItem && !this.selectedCompanies.find(item => item.id === this.selectedItem.companyId)) {
      this.selectedItem = null;
    }
  }
  goToIntegrationsPage() {
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/integrations/all-integrations`;
    window.open(url, '_self');
    this.ref.detectChanges();
  }
  addCard() {
    this.dp.close();
    this.manageCardsStateService.openAsideForAdd();
  }
  edit(item) {
    this.dp.close();
    this.manageCardsStateService.openAsideForEdit(item);
  }
  delete(item) {
    this.confirmStateService.setConfirmAction(REMOVE_CARD);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Are you sure you want to remove this card?`;
    this.manageCardsStateService.setCardForRemove(item);
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
    this.manageCardsService.getCards(this.page, { companyIds: this.selectedCompanies.map(item => item.id) }, 10).subscribe((res: any) => {
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
