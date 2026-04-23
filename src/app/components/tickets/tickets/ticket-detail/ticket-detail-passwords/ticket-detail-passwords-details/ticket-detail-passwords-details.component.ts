
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterPasswordManager } from 'src/app/components/password-manager/class/filter-password-manager';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { PasswordManagerListService } from 'src/app/components/password-manager/services/password-manager-list.service';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { TicketDetailPasswordsItemComponent } from '../ticket-detail-passwords-item/ticket-detail-passwords-item.component';

@Component({
  standalone: true,
  imports: [TicketDetailPasswordsItemComponent, CommonModule],
  selector: 'ticket-detail-passwords-details',
  templateUrl: './ticket-detail-passwords-details.component.html',
  styleUrls: ['./ticket-detail-passwords-details.component.scss'],
  providers: [PasswordManagerListService]
})
export class TicketDetailPasswordsDetailsComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  @Output() onClose = new EventEmitter<any>();
  public recordsData: Array<PasswordRecord> = [];
  public showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  showPendingPreloader: boolean = false;
  public filter: FilterPasswordManager = new FilterPasswordManager();
  public list_records: Array<PasswordRecord> = [];
  isSearch: boolean = false;
  container;
  constructor(public passwordManagerService: PasswordManagerService,
    public passwordManagerListService: PasswordManagerListService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.initDefaultPasswordRecordList();
  }
  public initDefaultPasswordRecordList() {
    this.container = this.elRef.nativeElement.querySelector(".ticket-detail-passwords__body");
    this.elRef.nativeElement.querySelector(".ticket-detail-passwords__body").scrollTo(0, 0);
    this.filter.setSort('DESCRIPTION');
    this.filter.setCompany({ id: this.ticketProfile.company.id });
    this.setDefaultScoll();
    this.onScroll();
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.filterList();
  }
  public setDefaultScoll() {
    this.showPreloader = true;
    this.filter.page = 0;
    this.passwordManagerListService.setBlockList(false);
    this.list_records = [];
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
  clearSearch() {
    this.filter.setSearch(null);
    this.setDefaultScoll();
    this.onScroll();
    this.elRef.nativeElement.querySelector("#search-passwords").value = '';
    this.isSearch = false;
  }
  onKeyUp(event) {
    if (event.keyCode === 13) this.search(event);
  }
  search(event) {
    this.filter.setSearch(event.target.value);
    if (event.target.value.length > 0) {
      this.isSearch = true;
    } else {
      this.isSearch = false;
    }
    this.setDefaultScoll();
    this.onScroll();
  }
  close() {
    this.onClose.emit(null);
  }
  private filterList() {
    if (this.passwordManagerListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.filter.page > 0) this.showPendingPreloader = true;
    this.passwordManagerService.getRecords(this.filter.getDataForRequest()).subscribe((res: any) => {
      this.list_records = [...this.list_records, ...res.map(item => new PasswordRecord(item))];
      this.infiniteScrollDisabled = false;
      this.showPendingPreloader = false;
      if (res.length < this.filter.limit) this.passwordManagerListService.setBlockList(true);
      this.filter.page += 1;
      this.showPreloader = false;
      this.cd.detectChanges();
    });
  }
}
