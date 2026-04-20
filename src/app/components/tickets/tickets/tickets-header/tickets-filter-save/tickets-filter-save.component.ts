import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { TicketsFilterSaveValidate } from './class/tickets-filter-save-validate';
import { PreloaderTicketComponent } from '../../../../shared/preloader-ticket/preloader-ticket.component';
import { DisabledBtnDirective as DisabledBtnDirective_1 } from '../../../../../directives/disabled-btn/disabled-btn.directive';
import { MatErrorComponent } from '../../../../shared/mat-error/mat-error.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'tickets-filter-save',
    templateUrl: './tickets-filter-save.component.html',
    styleUrls: ['./tickets-filter-save.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, NgIf, MatErrorComponent, DisabledBtnDirective_1, PreloaderTicketComponent]
})
export class TicketsFilterSaveComponent implements OnInit {
  @ViewChild('addBtn', { static: true }) addBtn: DisabledBtnDirective;
  @Input() globalFilter: TicketGlobalFilter;
  validate: TicketsFilterSaveValidate = new TicketsFilterSaveValidate();
  oldName: string;
  constructor(public activeModal: NgbActiveModal,
    private confirmStateService: ConfirmStateService,
    private ticketsService: TicketsService,) { }

  ngOnInit() {
    this.oldName = JSON.parse(JSON.stringify(this.globalFilter.name));
  }
  /**
* @description Confirm and close modal
*/
  cancelConfirm() {
    this.addBtn.setDisabled(false);
    this.activeModal.close();
    this.confirmStateService.setConfirm(false);
  };

  onChangeName() {
    this.validate.checkValidName(this.globalFilter.name);
  }
  /**
* @description Init request to add / edit global filter
*/
  save() {
    if (!this.validate.isValidate(this.globalFilter)) return;
    this.addBtn.setDisabled(true);
    if (!this.globalFilter.id) {
      this.ticketsService.addGlobalFilter(this.globalFilter.getDataForRequest(true)).subscribe(data => {
        this.cancelConfirm();
      })
    } else {
      if (this.oldName !== this.globalFilter.name) {
        this.ticketsService.addGlobalFilter(this.globalFilter.getDataForRequest(true)).subscribe(data => {
          this.cancelConfirm();
        })
      } else {
        this.ticketsService.editGlobalFilter(this.globalFilter.id, this.globalFilter.getDataForRequest(false)).subscribe(data => {
          this.cancelConfirm();
        })
      }
    }
  }

}
