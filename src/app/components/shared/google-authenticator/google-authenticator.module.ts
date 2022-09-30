import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthenticatorComponent } from './google-authenticator.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatChipsModule, MatSelectModule } from '@angular/material';
@NgModule({
    declarations: [
        GoogleAuthenticatorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        MatChipsModule,
        NgxMaskModule.forRoot(),
    ],
    entryComponents: [GoogleAuthenticatorComponent],
    exports: [GoogleAuthenticatorComponent],
})
export class GoogleAuthenticatorModule { }
