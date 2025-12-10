import { Component } from '@angular/core';
import { PasswordRecord } from '../../password-manager/class/password-record';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';

@Component({
  selector: 'app-manage-cards',
  templateUrl: './manage-cards.component.html',
  styleUrls: ['./manage-cards.component.scss'],
  providers: [TicketsListService]
})
export class ManageCardsComponent {
  showPreloader: boolean = false;
  showPendingPreloader: boolean = false;
  list = [];
  toggleFilter: boolean = false;
  public infiniteScrollDisabled = true;
  //public filter: FilterPasswordManager = new FilterPasswordManager();
  constructor(private ticketsListService: TicketsListService,) { }

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
    // this.filter.page = 0;
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
    // if (this.filter.page > 0) this.showPendingPreloader = true;
    /*  this.passwordManagerService.getRecords(this.filter.getDataForRequest()).subscribe((res: any) => {
        this.list = [...this.list, ...res.map(item => new PasswordRecord(item))];
        this.showPreloader = false;
        this.showPendingPreloader = false;
        this.infiniteScrollDisabled = false;
        if (res.length < this.filter.limit) this.passwordManagerListService.setBlockList(true);
        this.filter.page += 1;
        this.cd.detectChanges();
      });*/
  }
}
