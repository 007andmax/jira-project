import { Component, OnInit } from '@angular/core';
import { DownloadAgentService } from './services/download-agent.service';
import { DownloadAgentStateService } from 'src/ng2/app/states/download-agent/download-agent-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { CompanyDownlaodAgent } from '../class/company-download-agent';

@Component({
  selector: 'app-download-agent',
  templateUrl: './download-agent.component.html',
  styleUrls: ['./download-agent.component.scss']
})
export class DownloadAgentComponent implements OnInit {
  downloadLink: string;
  constructor(private downloadAgentService: DownloadAgentService, private downloadAgentStateService: DownloadAgentStateService,
    public activeModal: NgbActiveModal, private companiesService: CompaniesService) { }

  ngOnInit() {
    let data = new CompanyDownlaodAgent("", "", "", "", this.downloadAgentStateService.getCompany().id);
    this.companiesService.getDownloadLink(data).subscribe((res: any) => {
      this.downloadLink = res.downloadLink;
    })
  }
  closeModal() {
    this.activeModal.close();


    /*  if (closeFn) closeFn();
      $uibModalInstance.dismiss();*/
  }
  getDonwloadLink() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.downloadLink;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      let successful = document.execCommand('copy');
      if (successful) {
        // UserNotificationService.show('Copied successfully', true);
      } else {
        //  UserNotificationService.show('Copy failed', true);
      }
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }

    document.body.removeChild(textArea);
  }
  downloadAgent() {
    this.downloadAgentService.downoad(this.downloadAgentStateService.getCompany().id, "", "", false).subscribe((data: any) => {

      var link = document.createElement('a');
      link.target = "_blank";
      link.href = data.link;
      link.download = data.link.substring(data.link.lastIndexOf('/') + 1, data.link.length);;
      link.click();
    })
  }

}
