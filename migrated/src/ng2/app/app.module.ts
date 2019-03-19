import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule, UrlHandlingStrategy } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { UpgradeModule, downgradeComponent } from '@angular/upgrade/static';

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';


declare var angular: any;

export class CustomHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url) {
    console.log(url, 'URL');
    console.log((url.toString().startsWith("/ng2") || url.toString() == "/"), 'URL');
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
    PasswordManagerComponent
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
    { provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  // constructor(private upgrade: UpgradeModule) { }
  // ngDoBootstrap() {
  //   this.upgrade.bootstrap(document.body, ['quicktech'], { strictDi: true });
  // }
}
