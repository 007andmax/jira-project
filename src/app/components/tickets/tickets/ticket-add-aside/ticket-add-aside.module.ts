import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketAddAsideComponent } from './ticket-add-aside.component';
import { FormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { UploadAreaComponent } from 'src/app/components/shared/upload-area/upload-area.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { UploadAreaProgressComponent } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.component';
import { UploadAreaProgressModule } from 'src/app/components/shared/upload-area/upload-area-progress/upload-area-progress.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadAreaModule } from 'src/app/components/shared/upload-area/upload-area.module';
import { TechUsersModule } from 'src/app/components/shared/tech-users/tech-users.module';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { CompanyUsersDropDownComponent } from './company-users-drop-down/company-users-drop-down.component';
import { CompanyUsersDropDownModule } from './company-users-drop-down/company-users-drop-down.module';
import { PriorityLevelDropDownComponent } from './priority-level-drop-down/priority-level-drop-down.component';
import { AssignedTicketUserComponent } from './assigned-ticket-user/assigned-ticket-user.component';
import { AssignedTicketUserSelectedItemComponent } from './assigned-ticket-user/assigned-ticket-user-selected-item/assigned-ticket-user-selected-item.component';
import { AssignedTicketUserItemComponent } from './assigned-ticket-user/assigned-ticket-user-item/assigned-ticket-user-item.component';
import { AssignedTicketUserModule } from './assigned-ticket-user/assigned-ticket-user.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { UsersDropDownModule } from 'src/app/components/shared/users-drop-down/users-drop-down.module';



@NgModule({
    declarations: [TicketAddAsideComponent, PriorityLevelDropDownComponent
    ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        TechUsersModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        UploadAreaProgressModule,
        NgbModule,
        UploadAreaModule,
        CompanyDropDownModule,
        DynamicTooltipModule,
        CompanyUsersDropDownModule,
        AssignedTicketUserModule,
        MatErrorModule,
        UsersDropDownModule
    ],
    exports: [TicketAddAsideComponent]
})
export class TicketAddAsideModule { }
