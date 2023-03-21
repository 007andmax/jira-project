import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterPasswordManager } from 'src/app/components/password-manager/class/filter-password-manager';
import { PasswordRecord } from 'src/app/components/password-manager/class/password-record';
import { PasswordManagerListService } from 'src/app/components/password-manager/services/password-manager-list.service';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { TicketProfile } from '../../../class/ticket-profile';

@Component({
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
  public filter: FilterPasswordManager = new FilterPasswordManager();
  public list_records: Array<PasswordRecord> = [];
  isSearch: boolean = false;
  constructor(public passwordManagerService: PasswordManagerService,
    public passwordManagerListService: PasswordManagerListService,
    private elRef: ElementRef,
    public cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.getRecords();
  }
  public getRecords() {
    this.passwordManagerService.getRecordsDetailsTicket(this.ticketProfile.company.id).subscribe((res: any) => {
      this.recordsData = res.map(item => new PasswordRecord(item));
      this.recordsData.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));

      this.list_records = res.map(item => new PasswordRecord(item));
      this.list_records.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
        1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
      this.showPreloader = false;
      this.cd.detectChanges();
    });
  }
  public trackByIndex(index, item) {
    return index;
  }
  public trackById(index, item) {
    return item.id;
  }
  clearSearch() {
    this.list_records = JSON.parse(JSON.stringify(this.recordsData)).map(item => new PasswordRecord(item));
    this.elRef.nativeElement.querySelector("#search-passwords").value = '';
    this.isSearch = false;
  }
  search(event) {
    if (event.target.value.length > 0) {
      this.list_records = this.recordsData.filter(item => item.description.toLowerCase().includes(event.target.value.toLowerCase()));
      this.isSearch = true;
    } else {
      this.list_records = JSON.parse(JSON.stringify(this.recordsData)).map(item => new PasswordRecord(item));
      this.isSearch = false;
    }
  }
  close() {
    this.onClose.emit(null);
  }
  private filterList() {
    if (this.passwordManagerListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    this.page_number += 1;
    let listFilter = this.filter.getFilterList(this.recordsData);
    let start = (this.page_number - 1) * 30;
    let end = ((this.page_number * 30) > listFilter.length) ? listFilter.length : this.page_number * 30;
    let list_records = [];
    for (let i = start; i < end; i++) {
      list_records.push(listFilter[i]);
    }
    this.list_records = [...this.list_records, ...list_records.map(item => new PasswordRecord(JSON.parse(JSON.stringify(item))))];
    this.infiniteScrollDisabled = false;
    if ((this.page_number * 30) > listFilter.length) this.passwordManagerListService.setBlockList(true);
  }
}
