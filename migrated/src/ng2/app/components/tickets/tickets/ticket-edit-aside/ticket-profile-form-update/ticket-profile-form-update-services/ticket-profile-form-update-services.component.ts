import { Component, OnInit, Input } from '@angular/core';
import { ServiceAgreementsService } from 'src/ng2/app/services/service-agreements/service-agreements.service';
import { TicketProfile } from '../../../class/ticket-profile';
import { RecurringService } from 'src/ng2/app/services/recurring/recurring.service';

@Component({
  selector: 'app-ticket-profile-form-update-services',
  templateUrl: './ticket-profile-form-update-services.component.html',
  styleUrls: ['./ticket-profile-form-update-services.component.scss']
})
export class TicketProfileFormUpdateServicesComponent implements OnInit {
  @Input() ticketProfile: TicketProfile = new TicketProfile();
  areTicketsTerminated: boolean = false;
  areTicketsPresented: boolean = false;
  listAgreements = [];
  servicesList = [];
  constructor(private serviceAgreementsService: ServiceAgreementsService, private recurringService: RecurringService) { }

  ngOnInit() {
    this.getListServices(this.ticketProfile.company);

  }
  private getServiceAgreements() {
    this.serviceAgreementsService.getServiceAgreements().subscribe((data: any) => {
      this.listAgreements = data;
      let Agreements = data.filter((el) => el.company.id === this.ticketProfile.company.id)
      this.areTicketsPresented = (Agreements.length > 0) ? true : false;
     // if (this.areTicketsPresented)
     this.servicesList.filter(item => item.canUseInTicket);
      console.log("Agreements", Agreements);
      this.areTicketsTerminated = Agreements.every((el) => {
        return el.status === 'EXPIRED' || el.status === 'TERMINATED'
      })
    })
  }
  private getListServices(value) {
    this.recurringService.getServiceList(value.id).subscribe((res: any) => {
      this.servicesList = res;
      this.getServiceAgreements();
    })
  }

}
