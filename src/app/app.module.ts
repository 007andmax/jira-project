import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HardwareComponent } from './hardware/hardware.component';
import { SoftwareComponent } from './software/software.component';
import { StartupProgramesComponent } from './startup-programes/startup-programes.component';
import { ServicesComponent } from './services/services.component';
import { AntivirusComponent } from './antivirus/antivirus.component';
import { TerminalComponent } from './terminal/terminal.component';
import { WindowsUpdateComponent } from './windows-update/windows-update.component';
import { FileExplorerComponent } from './file-explorer/file-explorer.component';
import { PasswordComponent } from './password/password.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxUploaderModule } from 'ngx-uploader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { FormsModule } from '@angular/forms';
import { TicketTaskComponent } from './ticket-task/ticket-task.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { searchTextPipe } from './_pipe/searchText.pipe';
import { HighlightDirective } from './../app/_directive/highlight.directive';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    HardwareComponent,
    SoftwareComponent,
    StartupProgramesComponent,
    ServicesComponent,
    AntivirusComponent,
    TerminalComponent,
    WindowsUpdateComponent,
    FileExplorerComponent,
    PasswordComponent,
    SessionTimeoutComponent,
    LockScreenComponent,
    TicketTaskComponent,
    searchTextPipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgxUploaderModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      closeButton: true,
      preventDuplicates: true,
    }),
    NgbModule
  ],
  providers: [
      { provide: LocationStrategy, useClass: HashLocationStrategy },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [SessionTimeoutComponent, LockScreenComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

  


 }
