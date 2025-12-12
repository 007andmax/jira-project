import { ChangeDetectorRef, Component } from '@angular/core';
import { PasswordRecord } from '../../password-manager/class/password-record';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { ManageCardsService } from 'src/app/services/manage-cards/manage-cards.service';
import { Card } from './class/card';
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';
import { Subscription } from 'rxjs';
import { REMOVE_CARD } from 'src/app/const/confirm';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';

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
    public cd: ChangeDetectorRef,
  ) { }
  ngOnInit() {
    this.onScroll();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CARD) this.onRemoveCard(this.manageCardsStateService.getCardForRemove().id);
      }
    })
    this.sub.add(getConfirm);
  }
  onRemoveCard(cardId) {
    this.manageCardsService.deleteCard(cardId).subscribe(res => {

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
