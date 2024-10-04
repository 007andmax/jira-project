import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthenticatorComponent } from './google-authenticator.component';
import { NgxMaskModule } from 'ngx-mask';
import { MatErrorModule } from '../mat-error/mat-error.module';
@NgModule({
    declarations: [
        GoogleAuthenticatorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxMaskModule.forRoot(),
        MatErrorModule
    ],
    entryComponents: [GoogleAuthenticatorComponent],
    exports: [GoogleAuthenticatorComponent],
})
export class GoogleAuthenticatorModule { }
