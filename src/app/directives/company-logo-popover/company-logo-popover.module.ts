import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyLogoPopoverDirective } from './company-logo-popover.directive';

@NgModule({
    declarations: [
        CompanyLogoPopoverDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [CompanyLogoPopoverDirective],


})
export class CompanyLogoPopoverModule { }
