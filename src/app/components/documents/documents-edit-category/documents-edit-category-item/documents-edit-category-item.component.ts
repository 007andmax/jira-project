import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { Company } from 'src/app/interfaces/company/company';
import { DocumentEditCategory } from '../class/document-edit-category';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'documents-edit-category-item',
  templateUrl: './documents-edit-category-item.component.html',
  styleUrls: ['./documents-edit-category-item.component.scss'],
  providers: [TicketsListService],
  standalone: true,
})
export class DocumentsEditCategoryItemComponent implements OnInit {
  @Input() company: Company;
  @Input() documentEditCategory: DocumentEditCategory;
  indexNoAvatar: number = 0;
  listColorNoAvatar = [];
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.listColorNoAvatar = this.ticketsListService.getListColorNoAvatar();
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 6);
  }
  checkSelected(id) {
    return this.documentEditCategory.assignedCompaniesIds.find(item => item == id);
  }
  onSelectCompany(event, company) {
    if (event.target.checked) {
      this.documentEditCategory.addAssignedCompaniesIds(company.id);
    } else {
      let indexId = this.documentEditCategory.assignedCompaniesIds.findIndex(item => item === company.id);
      if (indexId > -1) this.documentEditCategory.removedAssignedCompaniesIds(indexId);
    }
  }
}
