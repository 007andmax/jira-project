import { Component, ViewChild } from '@angular/core';
import { AllIntegrationsOverviewComponent } from './all-integrations-overview/all-integrations-overview.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { PreloaderTicketComponent } from '../../shared/preloader-ticket/preloader-ticket.component';
import { DisabledBtnDirective as DisabledBtnDirective_1 } from '../../../directives/disabled-btn/disabled-btn.directive';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'app-all-integrations',
    templateUrl: './all-integrations.component.html',
    styleUrls: ['./all-integrations.component.scss'],
    standalone: true,
    imports: [NgClass, NgIf, DisabledBtnDirective_1, PreloaderTicketComponent, NgbNavModule, AllIntegrationsOverviewComponent]
})
export class AllIntegrationsComponent {
  activeTab: string = "overview";
  @ViewChild('overview', { static: false }) overview: AllIntegrationsOverviewComponent;
  @ViewChild('disconnectBtn', { static: false }) disconnectBtn: DisabledBtnDirective;
  @ViewChild('saveBtn', { static: false }) saveBtn: DisabledBtnDirective;
  @ViewChild('updateBtn', { static: false }) updateBtn: DisabledBtnDirective;
  save() {
    this.overview.save();
  }
  disconnect() {
    this.overview.disconnect();
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  onInitRequest(data) {
    if (this.disconnectBtn) this.disconnectBtn.setDisabled(data);
    if (this.saveBtn) this.saveBtn.setDisabled(data);
    if (this.updateBtn) this.updateBtn.setDisabled(data);
  }
}
