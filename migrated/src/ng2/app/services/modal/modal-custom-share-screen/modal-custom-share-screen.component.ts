import { Component, OnInit, Input } from '@angular/core';
import { DownloadAgentService } from 'src/ng2/app/components/companies/download-agent/services/download-agent.service';
import { DevicesStateService } from 'src/ng2/app/states/devices/devices-state.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-custom-share-screen',
  templateUrl: './modal-custom-share-screen.component.html',
  styleUrls: ['./modal-custom-share-screen.component.scss'],

})
export class ModalCustomShareScreenComponent implements OnInit {
  @Input() companyId: string;
  constructor(private downloadAgentService: DownloadAgentService,
    private devicesStateService: DevicesStateService,
    public activeModal: NgbActiveModal,) { }

  ngOnInit() {
  }
  downloadViewer() {
    window.location.href = '/data/connection-viewer';
  }
  launchApp() {
    this.devicesStateService.onInitRemoveConnection();
    this.activeModal.close();
  }
  closed() {
    this.activeModal.close();
  }
}
