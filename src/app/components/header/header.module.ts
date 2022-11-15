import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { GlobalSearchComponent } from './global-search/global-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [HeaderComponent,
        GlobalSearchComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,
    ],
    exports: [HeaderComponent]


})
export class HeaderModule { }
