import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TicketsListService } from '../../tickets/tickets/services/tickets-list.service';
import { Subscription } from 'rxjs';
import { SuperAdminCompany } from './class/super-admin-company';
import { CompaniesService } from 'src/app/services/company/companies.service';
import { SuperAdminCompanyFilters } from './class/super-admin-company-filters';

@Component({
  selector: 'super-admin-companies',
  templateUrl: './super-admin-companies.component.html',
  styleUrls: ['./super-admin-companies.component.scss'],
  providers: [TicketsListService]
})
export class SuperAdminCompaniesComponent implements OnInit {
  filters: SuperAdminCompanyFilters = new SuperAdminCompanyFilters();
  showPreloader: boolean = true;
  public infiniteScrollDisabled = true;
  public page_number: number = 0;
  companies: Array<SuperAdminCompany> = [];
  sub: Subscription = new Subscription();
  showPendingPreloader: boolean = false;
  toggleFilter: boolean = false;
  container = document.body.querySelector(".main-container");
  constructor(
    private companiesService: CompaniesService,
    private ticketsListService: TicketsListService,
    public cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.onScroll()
    const selectTarget = (fromElement, selector) => {
      if (!(fromElement instanceof HTMLElement)) {
        return null;
      }
      return fromElement.querySelector(selector);
    };
    const resizeData = {
      tracking: false,
      startWidth: null,
      startCursorScreenX: null,
      handleWidth: 10,
      resizeTarget: null,
      parentElement: null,
      maxWidth: null,
    };
    $(document.body).on('mousedown', '.resize-handle--x', null, (event) => {
      if (event.button !== 0) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const handleElement = event.currentTarget;
      if (!handleElement.parentElement) {
        console.error(new Error("Parent element not found."));
        return;
      }
      // Use the target selector on the handle to get the resize target.
      const targetSelector = handleElement.getAttribute('data-target');
      const targetElement = selectTarget(handleElement.parentElement, targetSelector);
      if (!targetElement) {
        console.error(new Error("Resize target element not found."));
        return;
      }
      resizeData.startWidth = $(targetElement).outerWidth();
      resizeData.startCursorScreenX = event.screenX;
      resizeData.resizeTarget = targetElement;
      resizeData.parentElement = handleElement.parentElement;
      resizeData.maxWidth = $(handleElement.parentElement).innerWidth() - resizeData.handleWidth;
      resizeData.tracking = true;
    });
    $(window).on('mousemove', null, null, (event) => {
      if (resizeData.tracking) {
        const cursorScreenXDelta = event.screenX - resizeData.startCursorScreenX;
        const newWidth = Math.min(resizeData.startWidth + cursorScreenXDelta, resizeData.maxWidth);
        if (newWidth >= 234) $(resizeData.resizeTarget).outerWidth(newWidth);
      }
    });
    $(window).on('mouseup', null, null, (event) => {
      if (resizeData.tracking) resizeData.tracking = false;
    });
  }
  onFilter(data) {
    this.showPreloader = true;
    this.filters.setSortBy(data);
    this.setDefaultScoll();
    this.onScroll();
  }
  private getCompanies() {
    if (this.ticketsListService.getBlockList()) {
      this.infiniteScrollDisabled = false;
      return;
    }
    if (this.page_number > 0) this.showPendingPreloader = true;
    this.filters.setOffset(this.page_number * this.filters.size);
    this.companiesService.getSuperAdminCompanies(this.filters.getDataForRequest()).subscribe((data: Array<SuperAdminCompany>) => {
      this.companies = [...this.companies, ...data];
      this.infiniteScrollDisabled = false;
      if (data.length < this.filters.size) this.ticketsListService.setBlockList(true);
      this.page_number += 1;
      this.showPreloader = false;
      this.showPendingPreloader = false;
      this.cd.detectChanges();

    })
  }
  public onScroll() {
    this.infiniteScrollDisabled = true;
    this.getCompanies();
  }
  public setDefaultScoll() {
    this.page_number = 0;
    this.ticketsListService.setBlockList(false);
    this.companies = [];
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  public trackById(index, item) {
    return item.id;
  }

}
