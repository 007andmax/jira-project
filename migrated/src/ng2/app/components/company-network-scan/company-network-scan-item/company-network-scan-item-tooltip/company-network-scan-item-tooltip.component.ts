import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NetworkScanDevice } from '../../class/network-scan-device';

@Component({
  selector: 'app-company-network-scan-item-tooltip',
  templateUrl: './company-network-scan-item-tooltip.component.html',
  styleUrls: ['./company-network-scan-item-tooltip.component.scss']
})
export class CompanyNetworkScanItemTooltipComponent implements OnInit {
  @Input() device: NetworkScanDevice;
  constructor(public cd: ChangeDetectorRef) { }

  ngOnInit() {
  }
  shownTooltip() {
    console.log("shownTooltip");
    this.cd.detectChanges();
  }
  getClass() {
    if (this.device.agentStatus === 'managed' || this.device.agentStatus === 'Installed' || this.device.agentStatus === 'unknown') return ['tag__modern', '--success']
    if (this.device.agentStatus === 'Install error' || this.device.agentStatus === 'ErrorInitialization' || this.device.agentStatus === 'Bad password' || this.device.agentStatus === 'unknown' || this.device.agentStatus === 'ErrorUac') return ['tag__modern', '--error']
    if (this.device.agentStatus === 'Blocked') return ['tag__modern', '--gray']
    if (this.device.agentStatus === 'Installing' || this.device.agentStatus === 'init') return ['qt-sz-18', 'qt-loading', '--blue', 'qt-ml-20']

  }
  getStatusText() {
    if (this.device.agentStatus === 'managed') {
      return 'Managed';

    } else if (this.device.agentStatus === 'Installed') {

      return 'Installed';
    } else if (this.device.agentStatus === 'Install error') {

      return 'Install error';

    } else if (this.device.agentStatus === 'ErrorInitialization') {

      return 'Error Initialization';

    } else if (this.device.agentStatus === 'Bad password') {

      return 'Bad password';

    } else if (this.device.agentStatus === 'Installing' /*
      || ($scope.device.agentPassword && $scope.device.agentPassword.status === 'PROCEED')*/) {

      return '';

    } else if (this.device.agentStatus === 'init') {

      return 'Copy install files'

    } else if (this.device.agentStatus === 'Blocked') {

      return 'Blocked';

    } else if (this.device.agentStatus === 'ErrorUac') {

      return 'Error Uac';

    } else {


      /*  if ($scope.device.agentPassword && $scope.device.agentPassword.status === 'SUCCESS') {
          return 'Correct';
        } else {
          return 'Not Monitored';
        }
  */
    }
  }

}
