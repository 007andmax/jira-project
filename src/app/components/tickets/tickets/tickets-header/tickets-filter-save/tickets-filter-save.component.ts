import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TicketGlobalFilter } from '../../class/ticket-global-filter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmStateService } from 'src/app/components/shared/confirm/services/confirm-state.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';

@Component({
  selector: 'tickets-filter-save',
  templateUrl: './tickets-filter-save.component.html',
  styleUrls: ['./tickets-filter-save.component.scss']
})
export class TicketsFilterSaveComponent implements OnInit {
  @ViewChild('addBtn') addBtn: DisabledBtnDirective;
  @Input() globalFilter: TicketGlobalFilter;
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
  /**
* @description Init request to add / edit global filter
*/
  save() {
    if (this.globalFilter.name.length == 0) return;
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
