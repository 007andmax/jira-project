import { ChangeDetectorRef, Component } from '@angular/core';
import { PasswordRecord } from '../../password-manager/class/password-record';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { ManageCardsService } from 'src/app/services/manage-cards/manage-cards.service';
import { Card } from './class/card';
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';
import { Subscription } from 'rxjs';
import { REMOVE_CARD } from 'src/app/const/confirm';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { ManageCardsRealTimeService } from 'src/app/states/manage-cards/manage-cards-real-time.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { IntegrationsStateService } from 'src/app/states/integrations/integrations-state.service';

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss'],
  providers: [TicketsListService]
})
export class ManageCardsComponent {
  showPreloader: boolean = true;
  showPendingPreloader: boolean = false;
  list = [];
  page: number = 0;
  toggleFilter: boolean = false;
  public infiniteScrollDisabled = true;
  container = document.body.querySelector(".main-container");
  sub: Subscription = new Subscription();
  //public filter: FilterPasswordManager = new FilterPasswordManager();
  constructor(private ticketsListService: TicketsListService,
    private manageCardsService: ManageCardsService,
    private manageCardsStateService: ManageCardsStateService,
    public confirmStateService: ConfirmStateService,
    public companiesStateService: CompaniesStateService,
    private manageCardsRealTimeService: ManageCardsRealTimeService,
    public integrationsStateService: IntegrationsStateService,
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    if (this.companiesStateService.currentCompany && this.integrationsStateService.isInit && this.integrationsStateService.connected) {
      this.setDefaultScoll();
      this.onScroll();
    }
    if (this.companiesStateService.currentCompany && this.integrationsStateService.isInit && !this.integrationsStateService.connected) this.showPreloader = false;
    let onCurrentCompany = this.companiesStateService.onCurrentCompany.subscribe(() => {
      if (this.companiesStateService.currentCompany && this.integrationsStateService.connected) {
        this.setDefaultScoll();
        this.onScroll();
      }
    });
    this.sub.add(onCurrentCompany);
    let onGetConnected = this.integrationsStateService.onGetConnected.subscribe((connected) => {
      if (this.companiesStateService.currentCompany && this.integrationsStateService.connected) {
        this.setDefaultScoll();
        this.onScroll();
      }
      if (!this.integrationsStateService.connected) this.showPreloader = false;
    });
    this.sub.add(onGetConnected);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CARD) this.onRemoveCard(this.manageCardsStateService.getCardForRemove().id);
      }
    })
    this.sub.add(getConfirm);
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
      if (!this.cd['destroyed']) this.cd.detectChanges();
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
  goToIntegrationsPage() {
    const url = `/#/${this.companiesStateService.getCurrentCompany().techDomain}/integrations/all-integrations`;
    window.open(url, '_self');
    this.cd.detectChanges();
  }
  onRemoveCard(cardId) {
    this.manageCardsService.deleteCard(cardId).subscribe(res => {
      this.manageCardsStateService.fastRemoveCard(cardId);
      this.cd.detectChanges();
    });
  }
  public onFilter(field) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    //  this.filter.setSort(field);
    this.setDefaultScoll();
    this.onScroll();
  }
  onSearch(value) {
    document.body.querySelector(".main-container").scrollTo(0, 0);
    // this.filter.setSearch((value !== "") ? value : null);
    this.setDefaultScoll();
    this.onScroll();
  }
  public setDefaultScoll() {
    this.showPreloader = true;
    this.page = 0;
    this.ticketsListService.setBlockList(false);
    this.list = [];
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.filterList();
  }
  private filterList() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.page > 0) { this.showPendingPreloader = true; } else {
      this.showPreloader = true;
    }
    this.manageCardsService.getCards(this.page).subscribe((res: any) => {
      this.list = [...this.list, ...res.cards.map(item => new Card(item))];
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.infiniteScrollDisabled = false;
      if (res.totalElements === this.list.length) this.ticketsListService.setBlockList(true);
      this.page += 1;
      this.cd.detectChanges();
    }, err => {
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.infiniteScrollDisabled = false;
      this.cd.detectChanges();
    });
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
