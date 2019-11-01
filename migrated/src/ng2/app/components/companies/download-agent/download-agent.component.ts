import { Component, OnInit } from '@angular/core';
import { DownloadAgentService } from './services/download-agent.service';
import { DownloadAgentStateService } from 'src/ng2/app/states/download-agent/download-agent-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-agent',
  templateUrl: './download-agent.component.html',
  styleUrls: ['./download-agent.component.scss']
})
export class DownloadAgentComponent implements OnInit {

  constructor(private downloadAgentService: DownloadAgentService, private downloadAgentStateService: DownloadAgentStateService,
    public activeModal: NgbActiveModal, ) { }

  ngOnInit() {

  }
  closeModal() {
    this.activeModal.close();
 
  
    /*  if (closeFn) closeFn();
      $uibModalInstance.dismiss();*/
  }

  downloadAgent() {
    this.downloadAgentService.archiveCompany(this.downloadAgentStateService.getCompany().id, "", "", false).subscribe((data: any) => {
      console.log('data', data);
      var link = document.createElement('a');
      link.target = "_blank";
      link.href = data.link;
      link.download = data.link.substring(data.link.lastIndexOf('/') + 1, data.link.length);;
      link.click();
    })
  }

}
