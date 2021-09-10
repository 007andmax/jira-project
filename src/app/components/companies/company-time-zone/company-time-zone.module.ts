import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanyTimeZoneComponent } from './company-time-zone.component';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';


@NgModule({
    declarations: [CompanyTimeZoneComponent

    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        DropDownModule

    ],
    exports: [CompanyTimeZoneComponent]

})
export class CompanyTimeZoneModule { }
