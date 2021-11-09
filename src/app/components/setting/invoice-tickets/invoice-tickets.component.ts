import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SettingStateService } from 'src/app/states/setting/setting-state.service';
import { GlNumberSettingsComponent } from './gl-number/gl-number.component';
import { InvoiceTicketsService } from './invoice-tickets.service';
declare var $: any;
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
  activeTab: string = "invoiceSettings";
  @ViewChild('glNumber') glNumber: GlNumberSettingsComponent;
  constructor(private invoiceTicketsService: InvoiceTicketsService,
    private settingStateService: SettingStateService) { }

  ngOnInit() {
    $('body').addClass('ng7');
    $('body').removeClass('backMenu');
    this.getTaxNumber();
    this.getTermsAndConditions();
    this.settingStateService.setComponentName('InvoiceTicketsComponent');
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
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.getTaxNumber().subscribe(
      (res: any) => {
        if (res) {
          this.taxId = res.taxId;
          this.taxIdDescription = res.taxIdDescription;
        } else {
          this.taxId = "";
          this.taxIdDescription = "";
        }
        this.showTab = true;
      },
      error => {
        this.showTab = true;
      }
    );
  }
  setTab(data) {
    this.activeTab = data['nextId'];
  }
  create() {
    if (this.activeTab === "gLNumbers") this.glNumber.toggleShowAddGL(true);
  }
  getTermsAndConditions() {
    this.loading = true; $(".loading").css("display", "block");
    this.invoiceTicketsService.termsAndConditions().subscribe(
      (res: any) => {
        this.loading = false; $(".loading").css("display", "none");
        if (res) {
          this.term = res.term;
          this.condition = res.conditions;
        } else {
          this.term = "";
          this.condition = "";
        }
        this.showTerm = true;
      },
      error => {
        this.showTerm = true;
        this.loading = false; $(".loading").css("display", "none");
      }
    );
  }

}
