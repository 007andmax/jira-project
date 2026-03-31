import { Component, OnInit } from '@angular/core';
import { DownloadAgentService } from './services/download-agent.service';
import { DownloadAgentStateService } from 'src/app/states/download-agent/download-agent-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { CompanyDownlaodAgent } from '../class/company-download-agent';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-download-agent',
  templateUrl: './download-agent.component.html',
  styleUrls: ['./download-agent.component.scss']
})
export class DownloadAgentComponent implements OnInit {
  downloadLink: string;
  toggleWingetCommand: boolean = false;
  constructor(private downloadAgentService: DownloadAgentService, private downloadAgentStateService: DownloadAgentStateService,
    private toastrService: ToastrService,
    private appStateService: AppStateService,
    public activeModal: NgbActiveModal, private companiesService: CompaniesService) { }

  ngOnInit() {
    let data = new CompanyDownlaodAgent("", "", "", "", this.downloadAgentStateService.getCompany().id);
    this.companiesService.getDownloadLink(data).subscribe((res: any) => {
      this.downloadLink = res.downloadLink;
    })
  }
  closeModal() {
    this.activeModal.close();
  }
  onToggleWingetCommand() {
    this.toggleWingetCommand = !this.toggleWingetCommand;
  }
  getWingetRepositoryLink() {
    return `winget source add -n Winget-Repo -t "Microsoft.Rest" -a https://update.quicktech.com/winget/api/`;
  }
  copyWingetRepositoryLink() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.getWingetRepositoryLink();;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  getWinGetCommand() {
    return `winget install QuicktechAgentSetup --version 1.0.1.3891 --source Winget-Repo --override "--company_id ${this.downloadAgentStateService.getCompany().id} --silent"`;
  }
  copyWinGetCommand() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.getWinGetCommand();
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
    this.toastrService.success("The value is copied to clipboard");
    this.appStateService.changeDetectorRef();
  }
  getDonwloadLink() {
    let textArea: any = document.createElement("textarea");
    textArea.style.opacity = 0;
    textArea.value = this.downloadLink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      let successful = document.execCommand('copy');
    } catch (err) {
      //  UserNotificationService.show('Copy failed', true);
    }
    document.body.removeChild(textArea);
  }
  downloadAgent() {
    this.downloadAgentService.download(this.downloadAgentStateService.getCompany().id, "", "", false).subscribe((data: any) => {
      var link = document.createElement('a');
      link.target = "_blank";
      link.href = data.link;
      link.download = data.link.substring(data.link.lastIndexOf('/') + 1, data.link.length);;
      link.click();
    })
  }
  downloadDemoAgent() {
    var link = document.createElement('a');
    link.target = "_blank";
    link.href = `data/downloadNewInstaller?companyId=${this.downloadAgentStateService.getCompany().id}&doForce=false`;
    link.click();
  }

}
