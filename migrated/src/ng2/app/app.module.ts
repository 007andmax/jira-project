import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UpgradeModule, downgradeComponent } from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';

import { ApiPasswordManagerService } from "./components/password-manager/api-password-manager.service";


declare var angular: any;

export class CustomHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    console.log(url, 'URL', url.toString().startsWith("/ng2"));
    return url.toString().startsWith("/ng2") || url.toString() == "/"
  }

  extract(url) { return url; }
  merge(url, whole) { return url; }
}

angular.module('quicktech')
  .directive(
    'ng2Demo',
    downgradeComponent({component: PasswordManagerComponent})
  );


@NgModule({
  declarations: [
    AppComponent,
    PasswordManagerComponent,
    LeftPanelComponent,
    LeftPanelPasswordManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    RouterModule.forRoot([
        {
          path: 'ng2/password-manager',
          component: PasswordManagerComponent

        }
      ],
      {
        useHash: true,
        enableTracing: true
      })
  ],
  providers: [
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy },
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
