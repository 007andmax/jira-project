import { Component, OnInit, OnDestroy } from '@angular/core';
import { InvoiceTicketsService } from './invoice-tickets.service';
declare var $:any;
@Component({
  selector: 'app-invoice-tickets',
  templateUrl: './invoice-tickets.component.html',
  styleUrls: ['./invoice-tickets.component.scss']
})
export class InvoiceTicketsComponent implements OnInit, OnDestroy {
  loading = false;
  taxId: any;
  taxIdDescription: any;
  showTab = false;
  showTerm = false;
  term: any;
  condition: any;

  constructor(private invoiceTicketsService: InvoiceTicketsService) {}

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.getTaxNumber();
    this.getTermsAndConditions();
  }

  ngOnDestroy() {
    $('body').removeClass('ng7');
  }
  
  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }

  getTaxNumber() {
    this.loading = true;$(".loading").css("display", "block");
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
    this.loading = true;$(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false;$(".loading").css("display", "none");
        if (res) {
          this.term = res.term;
          this.condition = res.conditions;
          this.showTerm = true;
        }
      },
      error => {
        this.showTerm = true;
        this.loading = false;$(".loading").css("display", "none");
      }
    );
  }

}
