import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesListComponent } from './services-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceModule } from 'src/app/pipe/service/service.module';




@NgModule({
    declarations: [ServicesListComponent

    ],
    imports: [
        CommonModule,
        NgbModule,
        ServiceModule
    ],
    exports: [ServicesListComponent]


})
export class ServicesListModule { }
