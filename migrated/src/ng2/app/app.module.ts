import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken, NgZone } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
// @ts-ignore
import { UpgradeModule, downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from 'ng2-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSelectModule } from 'ngx-select-ex';
import { SidebarModule } from 'ng-sidebar';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ClickOutsideModule } from 'ng4-click-outside';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';
import { PasswordRecordsTypesComponent } from './components/left-panel/left-panel-password-manager/password-records-types/password-records-types.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';

import { ApiPasswordManagerService } from "./services/password-manager/api-password-manager.service";

import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { CompanyPipe } from './pipe/company.pipe';
import { PasswordManagerEditAsideComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { DeviceUserPipe } from './pipe/device-user.pipe';
import { PasswordCategoryPipe } from './pipe/password-category.pipe';

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
    CompanyPipe,
    PasswordRecordsTypesComponent,
    PasswordManagerTableComponent,
    PasswoordManagerHeaderComponent,
    UserPipe,
    DateFormatPipe,
    PasswordManagerEditAsideComponent,
    DeviceUserPipe,
    PasswordCategoryPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    SelectModule,
    NgbModule,
    ClickOutsideModule,
    ShowHidePasswordModule,

    NgxSelectModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    SidebarModule.forRoot(),
    RouterModule.forRoot([
        {
          path: '',
          component: AppComponent,
          pathMatch: 'full'
        },
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
  entryComponents: [
    LeftPanelComponent
  ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy },
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
