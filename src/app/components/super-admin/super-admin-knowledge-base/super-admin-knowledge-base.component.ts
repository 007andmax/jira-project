import { Component, OnInit, ViewChild } from '@angular/core';
import { SuperAdminKnowledgeBaseTableComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table.component';

@Component({
  selector: 'app-super-admin-knowledge-base',
  templateUrl: './super-admin-knowledge-base.component.html',
  styleUrls: ['./super-admin-knowledge-base.component.scss']
})
export class SuperAdminKnowledgeBaseComponent implements OnInit {
  @ViewChild('table') table: SuperAdminKnowledgeBaseTableComponent;
  constructor() { }

  ngOnInit() {
  }
  onAddNew() {
    document.body.querySelector(".aside-filters").scrollTo(0, 0);
    this.table.setToggleFilter(true);
  }
}
