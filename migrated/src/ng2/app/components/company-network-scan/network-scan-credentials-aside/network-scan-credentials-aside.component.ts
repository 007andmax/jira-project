import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVE_CREDENTIAL } from 'src/ng2/app/const/confirm';
import { PasswordManagerService } from 'src/ng2/app/services/password-manager/password-manager.service';
import { NetworkScanStateService } from 'src/ng2/app/states/network-scan/network-scan-state.service';
import { PasswordManagerStateService } from 'src/ng2/app/states/password-manager/password-manager-state.service';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NetworkScanCredential } from '../class/network-scan-credential';

@Component({
  selector: 'app-network-scan-credentials-aside',
  templateUrl: './network-scan-credentials-aside.component.html',
  styleUrls: ['./network-scan-credentials-aside.component.scss']
})
export class NetworkScanCredentialsAsideComponent implements OnInit, OnDestroy {
  open: boolean = false;
  list: Array<NetworkScanCredential> = [];
  @Input() companyId: string;
  @Output() onSelect = new EventEmitter<any>();
  sub: Subscription = new Subscription();
  constructor(private passwordManagerService: PasswordManagerService,
    private passwordManagerStateService: PasswordManagerStateService,
    private confirmStateService: ConfirmStateService,
    public cd: ChangeDetectorRef,
    private networkScanStateService: NetworkScanStateService) { }

  ngOnInit() {
    this.networkScanStateService.getOnOpenAside().subscribe(data => {
      this.open = true;
    })
    this.passwordManagerService.getAgentsCredentialsForCompany(this.companyId).subscribe(data => {
      this.list = data[this.companyId].map(item => new NetworkScanCredential(item.id, item.username));
    })
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
  }
  onSelectCredential(data) {
    this.onSelect.emit(data);
    this.close();
  }
  close() {
    this.open = false;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
