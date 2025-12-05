import { Component } from '@angular/core';

@Component({
  selector: 'app-all-integrations',
  templateUrl: './all-integrations.component.html',
  styleUrls: ['./all-integrations.component.scss']
})
export class AllIntegrationsComponent {
  activeTab: string = "overview";


  setTab(data) {
    this.activeTab = data['nextId'];
  }
}
