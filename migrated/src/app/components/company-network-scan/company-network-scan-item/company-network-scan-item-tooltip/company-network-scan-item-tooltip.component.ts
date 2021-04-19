import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NetworkScanDevice } from '../../class/network-scan-device';
import { CompanyNetworkScanService } from '../../services/company-network-scan.service';

@Component({
  selector: 'app-company-network-scan-item-tooltip',
  templateUrl: './company-network-scan-item-tooltip.component.html',
  styleUrls: ['./company-network-scan-item-tooltip.component.scss'],
  providers: [CompanyNetworkScanService]
})
export class CompanyNetworkScanItemTooltipComponent implements OnInit {
  @Input() device: NetworkScanDevice;
  constructor(public cd: ChangeDetectorRef,
    private companyNetworkScanService: CompanyNetworkScanService) { }

  ngOnInit() {
  }
  shownTooltip() {
    this.cd.detectChanges();
  }
  getClass() {
    if (this.device.agentStatus === 'managed' || this.device.agentStatus === 'Installed') return ['tag__modern', '--success']
    if (this.device.agentStatus === 'Install error' || this.device.agentStatus === 'ErrorInitialization' || this.device.agentStatus === 'Bad password' || this.device.agentStatus === 'ErrorUac') return ['tag__modern', '--error']
    if (this.device.agentStatus === 'Blocked') return ['tag__modern', '--gray']
    if (this.device.agentStatus === 'Installing' || this.device.agentStatus === 'init') return ['qt-sz-18', 'qt-loading', '--blue', 'qt-ml-20']
  }
  getStatusText() {
    return this.companyNetworkScanService.getStatusText(this.device);
  }
}
