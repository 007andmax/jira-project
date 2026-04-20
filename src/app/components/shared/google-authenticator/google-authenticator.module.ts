import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthenticatorComponent } from './google-authenticator.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    declarations: [
        GoogleAuthenticatorComponent
    ],
    imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot()
],
    exports: [GoogleAuthenticatorComponent]
})
export class GoogleAuthenticatorModule { }
