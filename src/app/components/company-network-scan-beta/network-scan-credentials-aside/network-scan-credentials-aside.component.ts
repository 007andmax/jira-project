import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { REMOVE_CREDENTIAL } from 'src/app/const/confirm';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { NetworkScanStateService } from 'src/app/states/network-scan/network-scan-state.service';
import { PasswordManagerStateService } from 'src/app/states/password-manager/password-manager-state.service';
import { FilterPasswordManager } from '../../password-manager/class/filter-password-manager';
import { PasswordRecordCategories } from '../../password-manager/class/password-record-categories';
import { PasswordManagerListService } from '../../password-manager/services/password-manager-list.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NetworkScanCredential } from '../class/network-scan-credential';

@Component({
  selector: 'app-network-scan-credentials-aside',
  templateUrl: './network-scan-credentials-aside.component.html',
  styleUrls: ['./network-scan-credentials-aside.component.scss'],
  providers: [PasswordManagerListService]
})
export class NetworkScanCredentialsAsideComponent implements OnInit, OnDestroy {
  open: boolean = false;
  list: Array<NetworkScanCredential> = [];
  categoryAgent: PasswordRecordCategories;
  @Input() companyId: string;
  @Output() onSelect = new EventEmitter<any>();
  public filter: FilterPasswordManager = new FilterPasswordManager();
  sub: Subscription = new Subscription();
  public infiniteScrollDisabled = true;
  showPendingPreloader: boolean = false;
  container;
  constructor(private passwordManagerService: PasswordManagerService,
    private passwordManagerStateService: PasswordManagerStateService,
    private confirmStateService: ConfirmStateService,
    public passwordManagerListService: PasswordManagerListService,
    public cd: ChangeDetectorRef,
    private elRef: ElementRef,
    private networkScanStateService: NetworkScanStateService) { }

  ngOnInit() {
    this.container = this.elRef.nativeElement.querySelector(".contracts-page-scroll-content");
    this.elRef.nativeElement.querySelector(".contracts-page-scroll-content").scrollTo(0, 0);
    let getOnOpenAside = this.networkScanStateService.getOnOpenAside().subscribe(data => {
      this.open = true;
    })
    this.sub.add(getOnOpenAside);
    this.filter.setCompany({ id: this.companyId });
    this.onScroll();
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CREDENTIAL) {
          this.passwordManagerService.deleteRecord(this.networkScanStateService.getCredentialForRemove().id).subscribe(res => {
          })
        }
      }
    })
    this.sub.add(getConfirm);
    let onChangeRealTime = this.passwordManagerStateService.onChangeRealTime.subscribe(newChange => {
      if (newChange.action === 'PASSWORD_RECORD_CREATED') this.list.push(new NetworkScanCredential(newChange.data.id, newChange.data.username));
      if (newChange.action === 'PASSWORD_RECORD_UPDATED') {
        let findIndex = this.list.findIndex(item => item.id === newChange.data.id);
        if (findIndex > -1) this.list[findIndex].setUserName(newChange.data.username);
      }
      if (newChange.action === 'PASSWORD_RECORD_DELETED') {
        let findIndex = this.list.findIndex(item => item.id === newChange.data.id);
        if (findIndex > -1) this.list.splice(findIndex, 1);
      }
      this.cd.detectChanges();
    })
    this.sub.add(onChangeRealTime);
    if (this.passwordManagerStateService.getCategories().length === 0) this.passwordManagerStateService.onInit();
    this.categoryAgent = this.passwordManagerStateService.getCategories().find(item => item.name === "AGENT");
    let onGetCategories = this.passwordManagerStateService.onGetCategories.subscribe((data: Array<PasswordRecordCategories>) => {
      this.categoryAgent = data.find(item => item.name === "AGENT");
    })
    this.sub.add(onGetCategories);
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.filterList();
  }
  private filterList() {
    if (this.passwordManagerListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.filter.page > 0) this.showPendingPreloader = true;
    this.passwordManagerService.getRecords(this.filter.getDataForRequest()).subscribe((res: any) => {
      this.list = [...this.list, ...res.map(item => new NetworkScanCredential(item.id, item.username))];
      this.infiniteScrollDisabled = false;
      this.showPendingPreloader = false;
      if (res.length < this.filter.limit) this.passwordManagerListService.setBlockList(true);
      this.filter.page += 1;
      this.cd.detectChanges();
    });
  }
  onSelectCredential(data) {
    this.onSelect.emit(data);
    this.close();
  }
  close() {
    this.open = false;
  }
  public trackById(index, item) {
    return item.id;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
