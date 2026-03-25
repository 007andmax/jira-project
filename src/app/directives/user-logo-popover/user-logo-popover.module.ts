import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserLogoPopoverDirective } from './user-logo-popover.directive';

@NgModule({
    declarations: [
        UserLogoPopoverDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
    ],
    exports: [UserLogoPopoverDirective],


})
export class UserLogoPopoverModule { }
