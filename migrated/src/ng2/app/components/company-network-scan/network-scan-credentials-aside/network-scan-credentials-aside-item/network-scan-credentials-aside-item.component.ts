import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { REMOVE_CREDENTIAL } from 'src/ng2/app/const/confirm';
import { ApiPasswordManagerService } from 'src/ng2/app/services/password-manager/api-password-manager.service';
import { NetworkScanStateService } from 'src/ng2/app/states/network-scan/network-scan-state.service';
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
  constructor(private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private networkScanStateService: NetworkScanStateService) { }

  ngOnInit() {
  }
  remove() {
    this.confirmStateService.setConfirmAction(REMOVE_CREDENTIAL);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal' });
    modalRef.componentInstance.message = `Are you sure you want to delete this password?`;
    this.networkScanStateService.setCredentialForRemove(this.item);

  }
  showPassword() {
    this.apiPasswordManagerService.setOpenRecord(this.item.id).subscribe((data: any) => {
      console.log('data', data);
      this.item.setPassword(data.password);
    })
  }
}
