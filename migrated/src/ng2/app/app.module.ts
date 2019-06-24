import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NgZone } from '@angular/core';
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
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSelectModule} from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatIconModule } from "@angular/material";

import { AppComponent } from './app.component';
import { PasswordManagerComponent } from './components/password-manager/password-manager.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { LeftPanelPasswordManagerComponent } from './components/left-panel/left-panel-password-manager/left-panel-password-manager.component';
import { MainComponent } from './components/main/main.component';
import { PasswordRecordsTypesComponent } from './components/left-panel/left-panel-password-manager/password-records-types/password-records-types.component';
import { PasswordManagerTableComponent } from './components/password-manager/password-manager-table/password-manager-table.component';
import { PasswoordManagerHeaderComponent } from './components/password-manager/passwoord-manager-header/passwoord-manager-header.component';

import { ApiPasswordManagerService } from "./services/password-manager/api-password-manager.service";

import { QuotesComponent } from './components/billing/quotes/quotes.component';
import { QuoteCreateComponent } from './components/billing/quotes/quote-create/quote-create.component';
import { QuoteCreateContentComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content.component';
import { QuoteCreateHeaderComponent } from './components/billing/quotes/quote-create/quote-create-header/quote-create-header.component';
import { QuoteCreateContentTopComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-top/quote-create-content-top.component';
import { QuoteCreateContentBottomComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/quote-create-content-bottom.component';
import { QuoteCreateContentNotesComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-notes/quote-create-content-notes.component';
import { QuotePreviewComponent} from './components/billing/quotes/quote-preview/quote-preview.component';
import { UserPipe } from './pipe/user.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { CompanyPipe } from './pipe/company.pipe';
import { PasswordManagerEditAsideComponent } from './components/password-manager/password-manager-edit-aside/password-manager-edit-aside.component';
import { DeviceUserPipe } from './pipe/device-user.pipe';
import { PasswordCategoryPipe } from './pipe/password-category.pipe';
import { SelectClientCompanyComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-top/select-client-company/select-client-company.component';
import { ProductListComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/product-list/product-list.component';
import { ServicesListComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/services-list/services-list.component';
import { ProductTableComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/product-table/product-table.component';
import { AddItemComponent } from './components/billing/quotes/quote-create/quote-create-content/quote-create-content-bottom/add-item/add-item.component';
import { MultiDatepickerComponent } from './components/shared/multi-datepicker/multi-datepicker.component';
import { LeftPanelBillingComponent } from './components/left-panel/left-panel-billing/left-panel-billing.component';
import { ToNumerPipe } from './pipe/to-numer.pipe';
import { ModalQuoteComponent } from './services/modal/modal-quote/modal-quote.component';


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
    downgradeComponent({component: PasswordManagerComponent}))
  .directive(
    'leftPanelComponent',
    downgradeComponent({component: LeftPanelComponent}))
  .directive(
    'quotesComponent',
    downgradeComponent({component: QuotesComponent}))
  .directive(
    'quoteCreateComponent',
    downgradeComponent({component: QuoteCreateComponent}))
  .directive(
    'quotePreviewComponent',
    downgradeComponent({component: QuotePreviewComponent}))
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
    PasswordCategoryPipe,
    QuotesComponent,
    QuoteCreateComponent,
    QuoteCreateContentComponent,
    QuoteCreateHeaderComponent,
    QuoteCreateContentTopComponent,
    QuoteCreateContentBottomComponent,
    QuoteCreateContentNotesComponent,
    QuotePreviewComponent,
    SelectClientCompanyComponent,
    ProductListComponent,
    ServicesListComponent,
    ProductTableComponent,
    AddItemComponent,
    MultiDatepickerComponent,
    LeftPanelBillingComponent,
    ToNumerPipe,
    ModalQuoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UpgradeModule,
    HttpClientModule,
    FormsModule,
    SelectModule,
    NgbModule,
    InfiniteScrollModule,
    ClickOutsideModule,
    ShowHidePasswordModule,
    NgxSelectModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
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
        },
        {
          path: 'ng2/quotes',
          component: QuotesComponent,
          pathMatch: 'full'
        },
        {
          path: 'ng2/quotes/quote-create',
          component: QuoteCreateComponent,
          pathMatch: 'full'
        },
        {
          path: 'ng2/quotes/quote-preview',
          component: QuotePreviewComponent,
          pathMatch: 'full'
        }
      ],
      {
        useHash: true,
        enableTracing: false
      })
  ],
  entryComponents: [
    LeftPanelComponent,
    ModalQuoteComponent,
    QuotesComponent,
    QuoteCreateComponent,
    QuotePreviewComponent,
    PasswordManagerComponent
  ],
  providers: [
    {
      provide: '$state',
      useFactory: ($injector: any) => $injector.get('$state'),
      deps: ['$injector']
    },
    {provide: UrlHandlingStrategy, useClass: CustomHandlingStrategy},
    ApiPasswordManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
