import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { TicketProfileUpdate } from '../../class/ticket-profile-update';
import { TicketStateService } from '../../ticket-edit-aside/services/ticket-state.service';
import { TicketDetailProfileEditUpdatesServicesComponent } from './ticket-detail-profile-edit-updates-services/ticket-detail-profile-edit-updates-services.component';

@Component({
  selector: 'ticket-detail-profile-edit-updates',
  templateUrl: './ticket-detail-profile-edit-updates.component.html',
  styleUrls: ['./ticket-detail-profile-edit-updates.component.scss']
})
export class TicketDetailProfileEditUpdatesComponent implements OnInit {
  @ViewChild('updateBtn') updateBtn: DisabledBtnDirective;
  @ViewChild('selectServices') selectServices: TicketDetailProfileEditUpdatesServicesComponent;
  @Output() onCloseForm = new EventEmitter();
  update: TicketProfileUpdate;
  isUpdate: boolean = false;
  constructor(private ticketStateService: TicketStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.update = this.ticketStateService.getUpdateForEdit();
  }
  save() {
    /*  if (this.update.type === "PRODUCT") {
        this.onChangeProducts(this.selectProducts.getSelectedProducts());
        if (!this.ticketProfileFormUpdate.isValidateProduct() || !this.selectProducts.onValidateProducts()) return;
        this.onUpdateTicket(this.ticketProfileFormUpdate.getDataForUpdateProduct());
      }*/
    if (this.update.type === "SERVICE") {
      this.isUpdate = true;
      this.updateBtn.setDisabled(true);
      this.ticketsService.updateExpense(this.selectServices.service.getDateForUpdate(this.update.id)).subscribe(data => {
        //  this.onEdit.emit(null);
        this.isUpdate = false;
        this.updateBtn.setDisabled(false);
        this.close();
      })
    }
  }
  close() {
    this.onCloseForm.emit(null);
  }
}
