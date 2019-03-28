import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UpgradeModule, downgradeComponent } from '@angular/upgrade/static';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';

import { ApiPasswordManagerService } from "./components/password-manager/api-password-manager.service";
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
  );


@NgModule({
  declarations: [
    AppComponent,
    PasswordManagerComponent,
    LeftPanelComponent,
    LeftPanelPasswordManagerComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    HttpClientModule,
    NgSelectModule,
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
