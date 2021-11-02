import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
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
  @ViewChild('ticketsStatus') ticketsStatus: TicketsStatusComponent;
  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.getTaxNumber();
    this.getTermsAndConditions();
    this.settingStateService.setComponentName('InvoiceTicketsComponent');
  }
  create() {
    this.ticketsStatus.toggleAddStatus(true);
  }
  ngOnDestroy() {
    $('body').removeClass('ng7');
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
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

