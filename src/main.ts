import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { QuoteAsidePreviewModule } from './app/components/billing/quotes/quote-aside-preview/quote-aside-preview.module';
import { GoogleAuthenticatorModule } from './app/components/shared/google-authenticator/google-authenticator.module';
import { InvoicesAsidePreviewModule } from './app/components/billing/invoices/invoices-aside-preview/invoices-aside-preview.module';
import { MapModalModule } from './app/components/shared/map-modal/map-modal.module';
import { UsersAsideEditModule } from './app/components/users/users-aside-edit/users-aside-edit.module';
import { UsersAsideModule } from './app/components/users/users-aside/users-aside.module';
import { CompanyAddAsideModule } from './app/components/companies/company-add-aside/company-add-aside.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { PermissionIntegrationsService } from './app/components/integrations/integrations.service';
import { SuperAdminKnowledgeBaseService } from './app/components/super-admin/services/super-admin-knowledge-base/super-admin-knowledge-base.service';
import { PermissionMyProfileService } from './app/components/setting/my-profile/permission-my-profile.service';
import { PermissionClientUserService } from './app/services/users/permission-client-user.service';
import { PermissionNoSuperAdminService } from './app/services/users/permission-no-super-admin.service';
import { PermissionCompanyDevicesService } from './app/components/company-devices/permission-company-devices.service';
import { PermissionTicketsService } from './app/components/tickets/tickets/permission-tickets.service';
import { PermissionQuotesService } from './app/components/billing/quotes/permission-quotes.service';
import { PermissionPaymentsService } from './app/components/billing/payments/permission-payments.service';
import { TestPermissionService } from './app/services/test-permission/test-permission.service';
import { PermissionSuperAdminService } from './app/services/users/permission-super-admin.service';
import { PermissionTechUserService } from './app/services/users/permission-tech-user.service';
import { PermissionReportsService } from './app/components/reports/permission-reports.service';
import { PermissionSupportService } from './app/components/support/permission-support.service';
import { PermissionPasswordManagerService } from './app/components/password-manager/permission-password-manager.service';
import { PermissionUsersService } from './app/components/users/permission-users.service';
import { PermissionInvoicesService } from './app/components/billing/invoices/permission-invoices.service';
import { PermissionBillableService } from './app/components/billing/billable/permission-billable.service';
import { PermissionCompanyService } from './app/components/companies/permission-company.service';
import { PermissionContractsService } from './app/components/billing/contracts/permission-contracts.service';
import { PermissionCrmSettingsService } from './app/components/setting/crm-settings/permission-crm-settings.service';
import { PermissionAccountingSettingsService } from './app/components/setting/accounting/permission-accounting-settings.service';
import { PermissionEmailTemplateService } from './app/components/setting/email-template/permission-email-template.service';
import { PermissionTicketSettingsService } from './app/components/setting/ticket-settings-page/permission-ticket-settings.service';
import { PermissionEmailSettingService } from './app/components/setting/email-setting/permission-email-setting.service';
import { PermissionsTechUsersService } from './app/components/setting/tech-users-settings/permissions-tech-users.service';
import { PermissionProductsSettingsService } from './app/components/setting/products-settings/permission-products-settings.service';
import { PermissionManageTagsService } from './app/components/setting/manage-tags/permission-manage-tags.service';
import { PermissionDasnboardBillingService } from './app/services/dashboard-billing/permission-dasnboard-billing.service';
import { HttpInterceptorService } from './app/services/http/http-interceptor.service';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';

if (environment.production) {
    enableProdMode();
}


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, CommonModule, FormsModule, ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }), AppRoutingModule, ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }), RouterModule, AngularEditorModule, CompanyAddAsideModule, UsersAsideModule, UsersAsideEditModule, MapModalModule, InvoicesAsidePreviewModule, GoogleAuthenticatorModule, QuoteAsidePreviewModule),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true,
        },
        PermissionDasnboardBillingService,
        PermissionManageTagsService,
        PermissionProductsSettingsService,
        PermissionsTechUsersService,
        PermissionEmailSettingService,
        PermissionTicketSettingsService,
        PermissionEmailTemplateService,
        PermissionAccountingSettingsService,
        PermissionCrmSettingsService,
        PermissionContractsService,
        PermissionCompanyService,
        PermissionBillableService,
        PermissionInvoicesService,
        PermissionUsersService,
        PermissionPasswordManagerService,
        PermissionSupportService,
        PermissionReportsService,
        PermissionTechUserService,
        PermissionSuperAdminService,
        TestPermissionService,
        PermissionPaymentsService,
        PermissionQuotesService,
        PermissionTicketsService,
        PermissionCompanyDevicesService,
        PermissionNoSuperAdminService,
        PermissionClientUserService,
        PermissionMyProfileService,
        SuperAdminKnowledgeBaseService,
        PermissionIntegrationsService,
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
}).then(() => {
    document.body.classList.add('ready');
})
    .catch(err => console.error(err));
