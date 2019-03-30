import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, NgZone } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UpgradeModule, downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from 'ng2-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';

import { ApiPasswordManagerService } from "./components/password-manager/api-password-manager.service";
import { ObjectByObjectPipe } from './pipe/object-by-object.pipe';
import { PasswordRecordsTypesComponent } from './components/left-panel/left-panel-password-manager/password-records-types/password-records-types.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';
import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';

// import { ApiInterceptor } from "./services/api.interceptor/api.interceptor";


declare var angular: any;

export class CustomHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    return url.toString().startsWith("/ng2") || url.toString() == "/"
  }

  extract(url) { return url }
  merge(url, whole) { return url }
}

angular.module('quicktech')
  .directive(
    'passwordManager',
    downgradeComponent({component: PasswordManagerComponent})

  ).directive(
  'leftPanelComponent',
  downgradeComponent({component: LeftPanelComponent}))
  .factory('ngZone', downgradeInjectable(NgZone));


@NgModule({
  declarations: [
    AppComponent,
    PasswordManagerComponent,
    LeftPanelComponent,
    LeftPanelPasswordManagerComponent,
    MainComponent,
    ObjectByObjectPipe,
    PasswordRecordsTypesComponent,
    PasswordManagerTableComponent,
    PasswoordManagerHeaderComponent,
    UserPipe,
    DateFormatPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    SelectModule,
    NgbModule,
    NgxSelectModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
        {
          path: 'ng2/password-manager',
          component: PasswordManagerComponent,
          pathMatch: 'full'
        }
      ],
      {
        useHash: true,
        enableTracing: false
      })
  ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ApiInterceptor,
    //   multi: true
    // },
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
