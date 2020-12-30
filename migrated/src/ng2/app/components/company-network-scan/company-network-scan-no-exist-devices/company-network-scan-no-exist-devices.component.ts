import { Component, Input, OnInit } from '@angular/core';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompanyDownlaodAgent } from '../../companies/class/company-download-agent';
import { DownloadAgentService } from '../../companies/download-agent/services/download-agent.service';

@Component({
  selector: 'app-company-network-scan-no-exist-devices',
  templateUrl: './company-network-scan-no-exist-devices.component.html',
  styleUrls: ['./company-network-scan-no-exist-devices.component.scss']
})
export class CompanyNetworkScanNoExistDevicesComponent implements OnInit {
  @Input() companyId: string;
  downloadLink: string;
  constructor(private downloadAgentService: DownloadAgentService, private companiesService: CompaniesService) { }

  ngOnInit() {
    let data = new CompanyDownlaodAgent("", "", "", "", this.companyId);
    this.companiesService.getDownloadLink(data).subscribe((res: any) => {
      this.downloadLink = res.downloadLink;
    })
  }
  copyInstallerLink() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.downloadLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
    }
    document.body.removeChild(textArea);
  }
  downloadAgent() {
    this.downloadAgentService.download(this.companyId, "", "", false).subscribe((data: any) => {
      var link = document.createElement('a');
      link.target = "_blank";
      link.href = data.link;
      link.download = data.link.substring(data.link.lastIndexOf('/') + 1, data.link.length);;
      link.click();
    })
  }
}
