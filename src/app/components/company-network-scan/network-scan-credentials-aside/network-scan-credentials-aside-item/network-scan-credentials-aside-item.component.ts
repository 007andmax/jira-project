import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_CREDENTIAL } from 'src/app/const/confirm';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { NetworkScanStateService } from 'src/app/states/network-scan/network-scan-state.service';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../../shared/confirm/services/confirm-state.service';
import { NetworkScanCredential } from '../../class/network-scan-credential';

@Component({
  selector: 'app-network-scan-credentials-aside-item',
  templateUrl: './network-scan-credentials-aside-item.component.html',
  styleUrls: ['./network-scan-credentials-aside-item.component.scss']
})
export class NetworkScanCredentialsAsideItemComponent implements OnInit {
  @Input() item: NetworkScanCredential;
  @Input() companyId: string;
  @Output() onSelect = new EventEmitter<any>();
  constructor(private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private passwordManagerService: PasswordManagerService,
    private networkScanStateService: NetworkScanStateService) { }

  ngOnInit() {
  }
  select() {
    this.onSelect.emit(this.item);
  }
  onCheckChangeName(event) {
    if (this.item.username !== event.target.value) {
      this.passwordManagerService.editRecord(this.item.getDataForUpdate(this.companyId, event.target.value, null)).subscribe(data => {
        this.item.setUserName(event.target.value);
      })
    }
  }
  onCheckChangePassword(event) {
    if (this.item.password !== event.target.value) {
      this.passwordManagerService.editRecord(this.item.getDataForUpdate(this.companyId, this.item.username, event.target.value)).subscribe(data => {
        this.item.setPassword(event.target.value);
      })
    }
  }
  remove() {
    this.confirmStateService.setConfirmAction(REMOVE_CREDENTIAL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete this password?`;
    this.networkScanStateService.setCredentialForRemove(this.item);
  }
  showPassword() {
    this.passwordManagerService.setOpenRecord(this.item.id).subscribe((data: any) => {
      this.item.setPassword(data.password);
    })
  }
}
