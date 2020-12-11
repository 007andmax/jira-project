import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { REMOVE_CREDENTIAL } from 'src/ng2/app/const/confirm';
import { ApiPasswordManagerService } from 'src/ng2/app/services/password-manager/api-password-manager.service';
import { PasswordManagerService } from 'src/ng2/app/services/password-manager/password-manager.service';
import { NetworkScanStateService } from 'src/ng2/app/states/network-scan/network-scan-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { NetworkScanCredential } from '../class/network-scan-credential';

@Component({
  selector: 'app-network-scan-credentials-aside',
  templateUrl: './network-scan-credentials-aside.component.html',
  styleUrls: ['./network-scan-credentials-aside.component.scss']
})
export class NetworkScanCredentialsAsideComponent implements OnInit {
  open: boolean = false;
  list: Array<NetworkScanCredential> = [];
  @Input() companyId: string;
  sub: Subscription = new Subscription();
  constructor(private passwordManagerService: PasswordManagerService,
    private modalService: NgbModal,
    private confirmStateService: ConfirmStateService,
    private apiPasswordManagerService: ApiPasswordManagerService,
    private networkScanStateService: NetworkScanStateService) { }

  ngOnInit() {
    this.networkScanStateService.getOnOpenAside().subscribe(data => {
      this.open = true;
    })
    this.passwordManagerService.getAgentsCredentialsForCompany(this.companyId).subscribe(data => {
      console.log("data", data);
      this.list = data[this.companyId].map(item => new NetworkScanCredential(item.id, item.username));
      console.log("this.list", this.list);
    })
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === REMOVE_CREDENTIAL) {
          this.apiPasswordManagerService.deleteRecord(this.networkScanStateService.getCredentialForRemove().id).subscribe(res => {

          })
        }

      }
    })
    this.sub.add(getConfirm);
  }
  close() {
    this.open = false;
  }

}
