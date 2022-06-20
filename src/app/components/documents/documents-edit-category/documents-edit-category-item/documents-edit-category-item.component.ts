import { Component, Input, OnInit } from '@angular/core';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';
import { Company } from 'src/app/interfaces/company/company';
import { DocumentEditCategory } from '../class/document-edit-category';

@Component({
  selector: 'documents-edit-category-item',
  templateUrl: './documents-edit-category-item.component.html',
  styleUrls: ['./documents-edit-category-item.component.scss'],
  providers: [TicketsListService],
})
export class DocumentsEditCategoryItemComponent implements OnInit {
  @Input() company: Company;
  @Input() documentEditCategory: DocumentEditCategory;
  indexNoAvatar: number = 0;
  listColorNoAvatar = ['#0cdeaa', '#16a4fa', '#7c77cb', '#ffb937'];
  constructor(public ticketsListService: TicketsListService,) { }

  ngOnInit() {
    this.indexNoAvatar = this.ticketsListService.randomInteger(0, 3);
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
