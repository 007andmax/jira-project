import { Component, Input, OnInit } from '@angular/core';
import { PasswordManagerService } from 'src/app/services/password-manager/password-manager.service';
import { NetworkScanCredentialsAdd } from '../class/network-scan-credentials-add';

@Component({
  selector: 'app-network-scan-credentials-add',
  templateUrl: './network-scan-credentials-add.component.html',
  styleUrls: ['./network-scan-credentials-add.component.scss']
})
export class NetworkScanCredentialsAddComponent implements OnInit {
  @Input() companyId: string;
  networkScanCredentialsAdd: NetworkScanCredentialsAdd = new NetworkScanCredentialsAdd();
  constructor(private passwordManagerService: PasswordManagerService) { }

  ngOnInit() {
  }
  add() {
    if (!this.networkScanCredentialsAdd.isValidate()) return;
    this.passwordManagerService.createRecord(this.networkScanCredentialsAdd.getDataForAdd(this.companyId)).subscribe(data => {
    })
  }
  close() {
    this.networkScanCredentialsAdd = new NetworkScanCredentialsAdd();
  }
}
