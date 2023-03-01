import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfile } from '../../class/ticket-profile';

@Component({
  selector: 'ticket-detail-change-company',
  templateUrl: './ticket-detail-change-company.component.html',
  styleUrls: ['./ticket-detail-change-company.component.scss']
})
export class TicketDetailChangeCompanyComponent implements OnInit {
  selectedCompany: Company;
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(private companiesStateService: CompaniesStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
  }
  checkExistServicesProducts() {
    return this.ticketProfile.updates.filter(item => item.type == 'PRODUCT' || item.type == 'SERVICE').length > 0;
  }
  getCompany(id) {
    return this.companiesStateService.getCompanies().find(item => item.id === id);
  }
  onSelectCompany(data) {
    this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note, data.id).subscribe(data => {
    })
  }
}
