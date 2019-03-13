import { BrowserModule } from '@angular/platform-browser';
import {NgModule, InjectionToken, DoBootstrap} from '@angular/core';
import { RouterModule, PreloadAllModules } from '@angular/router';

import { downgradeComponent, setAngularJSGlobal, UpgradeComponent, UpgradeModule } from '@angular/upgrade/static';
import { AppComponent } from './app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MODULE_NAME } from '../ng1/app/scripts/core/app.mdl.js';
import { appRoutes } from './app.routes';
// import { Ng2DemoComponent } from "ng2/app/ng2-demo.component";
// import { phoneServiceProvider } from "ng2/app/phone.service";

declare var angular: any;

// angular.module('quicktech')
//   .directive(
//     'ng2Demo',
//     downgradeComponent({component: Ng2DemoComponent})
//   );

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      onSameUrlNavigation: 'reload'
    }),
  ],
  entryComponents: [
    // Ng2DemoComponent // Don't forget this!!!
  ],
  bootstrap: [AppComponent]
})



export class AppModule {
  constructor(private upgrade: UpgradeModule) {}

  ngDoBootstrap() {
    setAngularJSGlobal(angular);
    this.upgrade.bootstrap(document.getElementById('ng-app'), [MODULE_NAME], { strictDi: true });
  }

}

