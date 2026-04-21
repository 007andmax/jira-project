import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SuperAdminKnowledgeBaseTableComponent } from './super-admin-knowledge-base-table/super-admin-knowledge-base-table.component';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-super-admin-knowledge-base',
  templateUrl: './super-admin-knowledge-base.component.html',
  styleUrls: ['./super-admin-knowledge-base.component.scss']
})
export class SuperAdminKnowledgeBaseComponent implements OnInit {
  @ViewChild('table', { static: true }) table: SuperAdminKnowledgeBaseTableComponent;
  constructor() { }

  ngOnInit() {
  }
  onAddNew() {
    document.body.querySelector(".aside-filters").scrollTo(0, 0);
    this.table.setToggleFilter(true);
  }
}
