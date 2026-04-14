import { Directive, ElementRef, Input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { AppStateService } from 'src/app/states/app/app-state.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Directive({
  selector: '[appCompanyLogoPopover]'
})
export class CompanyLogoPopoverDirective {

  @Input() popover: NgbPopover;
  @Input() company: any;
  @Input() disabled: boolean = false;
  private closeTimer: any;
  private openTimer: any;
  constructor(private appStateService: AppStateService,
    public companiesStateService: CompaniesStateService,
    private element: ElementRef
  ) { }
  ngOnInit() {

    this.element.nativeElement.addEventListener('mouseenter', () => {
      // Reset the height to auto to calculate the new height
      if (!this.disabled) this.openPopover(this.popover)
    });
    this.element.nativeElement.addEventListener('mouseleave', () => {
      // Reset the height to auto to calculate the new height
      if (!this.disabled) this.startCloseTimer(this.popover)
    });
  }

  openPopover(popover: NgbPopover): void {
    if (!this.company) return;
    clearTimeout(this.closeTimer);

    if (!popover.isOpen()) {
      this.openTimer = setTimeout(() => {
        popover.open();
        this.appStateService.changeDetectorRef();
        // Wait until popover is added to <body>
        setTimeout(() => {
          const popoverEl: any = document.querySelector('.requested-by-popover');

          if (!popoverEl) {
            return;
          }
          popoverEl.style.opacity = "1";
          popoverEl.addEventListener('mouseenter', this.onPopoverMouseEnter);
          popoverEl.addEventListener('mouseleave', () => {
            if (!this.companiesStateService.isOpenDropDownRequestedBy) popover.close();
          });
        });
      }, 500);
    }
  }

  startCloseTimer(popover: NgbPopover): void {
    if (!this.company || this.companiesStateService.isOpenDropDownRequestedBy) return;
    clearTimeout(this.closeTimer);
    clearTimeout(this.openTimer);
    this.closeTimer = setTimeout(() => {
      const popoverEl = document.querySelector('.requested-by-popover:hover');

      // close only if mouse is not over popover body
      if (!popoverEl) {
        popover.close();
      }
    }, 150);
  }
  onPopoverMouseEnter = (): void => {
    clearTimeout(this.closeTimer);
  };
  ngOnDestroy(): void {
    clearTimeout(this.closeTimer);
  }

}
