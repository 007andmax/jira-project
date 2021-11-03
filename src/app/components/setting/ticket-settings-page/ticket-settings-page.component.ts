import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subscription } from 'rxjs';
import { DELETE_LIST_TICKET_STATUS } from 'src/app/const/confirm';
import { TicketsService } from 'src/app/services/tickets/tickets.service';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { TicketsStateService } from 'src/app/states/tickets/tickets-state.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { ConfirmStateService } from '../../shared/confirm/services/confirm-state.service';
import { InvoiceTicketsService } from '../invoice-tickets/invoice-tickets.service';
import { TicketsStatusComponent } from './tickets-status/tickets-status.component';
declare var $: any;
@Component({
  selector: 'ticket-settings-page',
  templateUrl: './ticket-settings-page.component.html',
  styleUrls: ['./ticket-settings-page.component.scss']
})
export class TicketSettingsPageComponent implements OnInit, OnDestroy {
  loading = false;
  taxId: any;
  taxIdDescription: any;
  showTab = false;
  showTerm = false;
  term: any;
  condition: any;
  activeTab: string = "ticketSettings";
  sub: Subscription = new Subscription();
  @ViewChild('ticketsStatus') ticketsStatus: TicketsStatusComponent;
  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private confirmStateService: ConfirmStateService,
    private modalService: NgbModal,
    private ticketsService: TicketsService,
    public cd: ChangeDetectorRef,
    private ticketsStateService: TicketsStateService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.getTaxNumber();
    this.getTermsAndConditions();
    this.settingStateService.setComponentName('InvoiceTicketsComponent');
    let getConfirm = this.confirmStateService.getConfirm().subscribe(data => {
      if (data) {
        if (this.confirmStateService.getConfirmAction() === DELETE_LIST_TICKET_STATUS) {
          this.onRemoveTicketsStatus();
        }
      }
    })
    this.sub.add(getConfirm);
  }
  create() {
    this.ticketsStatus.toggleAddStatus(true);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    $('body').removeClass('ng7');
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  getSelectedCount() {
    return (this.ticketsStatus) ? this.ticketsStatus.ticketsStatus.filter(item => item.selected).length : 0;
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  onRemoveTicketsStatus() {
    forkJoin(this.ticketsStateService.getListTicketStatusForRemove().map(item => this.ticketsService.removeTicketStatus(item.id)))
      .subscribe(
        () => {
          this.cd.detectChanges();
        },
        error => {
        }
      );
  }
  removeTicketsStatus() {
    this.confirmStateService.setConfirmAction(DELETE_LIST_TICKET_STATUS);
    const modalRef = this.modalService.open(ConfirmComponent, { windowClass: 'xs-modal' });
    modalRef.componentInstance.message = `Do you want to delete statuses?`;
    this.ticketsStateService.setListTicketStatusForRemove(this.ticketsStatus.ticketsStatus.filter(item => item.selected));
  }
  getTaxNumber() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        if (res) {
          this.showTab = true;
          this.taxId = res.taxId;
          this.taxIdDescription = res.taxIdDescription;
        }
      },
      error => {
        this.showTab = true;
      }
    );
  }

  getTermsAndConditions() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (res) {
          this.term = res.term;
          this.condition = res.conditions;
          this.showTerm = true;
        }
      },
      error => {
        this.showTerm = true;
        this.loading = false; $(".loading").css("display", "none");
      }
    );
  }

}

