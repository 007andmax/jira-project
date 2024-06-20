import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Company } from 'src/app/interfaces/company/company';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { TicketProfile } from '../../class/ticket-profile';
import { Subscription } from 'rxjs';
import { CHANGE_COMPANY_TICKET } from 'src/app/const/confirm';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from 'src/app/components/shared/confirm/confirm.component';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';

@Component({
  selector: 'ticket-detail-change-company',
  templateUrl: './ticket-detail-change-company.component.html',
  styleUrls: ['./ticket-detail-change-company.component.scss']
})
export class TicketDetailChangeCompanyComponent implements OnInit, OnDestroy {
  selectedCompany: Company;
  listCompanies: Array<Company> = [];
  sub: Subscription = new Subscription();
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  constructor(private companiesStateService: CompaniesStateService,
    private confirmStateService: ConfirmStateService,
    public ticketsPermissionsService: TicketsPermissionsService,
    private modalService: NgbModal,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.selectedCompany = this.companiesStateService.getCompanies().find(item => item.id === this.ticketProfile.company.id);
    if (this.companiesStateService.getCompanies().length > 0) this.getCompanies(this.companiesStateService.getCompanies());
    let getOnCompanies = this.companiesStateService.getOnCompanies().subscribe((data) => {
      this.selectedCompany = data.find(item => item.id === this.ticketProfile.company.id);
      this.getCompanies(data);
    })
    this.sub.add(getOnCompanies);
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === CHANGE_COMPANY_TICKET) this.ticketsService.changeSubjectNoteTicket(this.ticketProfile.id, this.ticketProfile.subject, this.ticketProfile.note, this.selectedCompany.id).subscribe(data => {
        })

      }
    })
    this.sub.add(getConfirm);
  }
  getTextForTooltip() {
    if (this.ticketProfile.ticketSource === 'FROM_EMAIL' && !this.checkExistServicesProducts() && this.getCompany(this.ticketProfile.company.id) && !this.getCompany(this.ticketProfile.company.id).isUnknown) return 'The ticket creator is associated with many customer companies. You can change the customer company of the ticket.';
    if (this.ticketProfile.ticketSource === 'FROM_EMAIL' && !this.checkExistServicesProducts() && this.getCompany(this.ticketProfile.company.id) && this.getCompany(this.ticketProfile.company.id).isUnknown) return 'The ticket creator does not belong to any customer company. You can change the customer company of the ticket. The system will automatically create a new customer user for the selected customer company.';
  }
  getCompanies(data) {
    this.listCompanies = data.filter(item => this.ticketProfile.userCompanies && this.ticketProfile.userCompanies.indexOf(item.id) > -1);
  }
  checkExistServicesProducts() {
    return this.ticketProfile.updates.filter(item => item.type == 'PRODUCT' || item.type == 'SERVICE').length > 0;
  }
  getCompany(id) {
    return this.companiesStateService.getCompanies().find(item => item.id === id);
  }
  onSelectCompany(data) {
    this.selectedCompany = data;
    this.confirmStateService.setConfirmAction(CHANGE_COMPANY_TICKET);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal user-modal', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.message = `Do you want to assign the following company to the ticket - ${data.name}`;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
