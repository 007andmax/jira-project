import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CompaniesStateService } from '../../states/company/companies-state.service';

@Directive({
    selector: '[appRightClickBlank]',
    standalone: true
})
export class RightClickBlankDirective {

  @Input() link: string;
  constructor(private eRef: ElementRef, public companiesStateService: CompaniesStateService,) {
    this.eRef.nativeElement.style.color = 'unset';
    this.eRef.nativeElement.addEventListener("click", (event) => {
      event.preventDefault();
    });
  }
  ngDoCheck() {
    if (this.companiesStateService.getCurrentCompany()) this.eRef.nativeElement.setAttribute("href", `/#/${this.companiesStateService.getCurrentCompany().techDomain}/${this.link
      }`)
  }
}
