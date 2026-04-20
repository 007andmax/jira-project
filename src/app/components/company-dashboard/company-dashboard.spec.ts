import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxMaskModule } from 'ngx-mask';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { PhoneModule } from 'src/app/pipe/phone/phone.module';
import { PreparePhoneModule } from 'src/app/pipe/prepare-phone/prepare-phone.module';
import { ContractsEditModule } from '../billing/contracts/contracts-edit/contracts-edit.module';
import { ContractsPreviewModule } from '../billing/contracts/contracts-preview/contracts-preview.module';
import { CompanyEditAsideModule } from '../companies/company-edit-aside/company-edit-aside.module';
import { CompanyTagsModule } from '../companies/company-tags/company-tags.module';
import { PreviewPhoneMaskModule } from '../shared/preview-phone-mask/preview-phone-mask.module';
import { CompanyDashAssociateInfoComponent } from './company-dash-associate-info/company-dash-associate-info.component';
import { CompanyAssociateModule } from './company-dash-associate/company-associate/company-associate.module';
import { CompanyDashAssociateComponent } from './company-dash-associate/company-dash-associate.component';
import { CompanyDashContractComponent } from './company-dash-contract/company-dash-contract.component';
import { CompanyDashDetailComponent } from './company-dash-detail/company-dash-detail.component';
import { CompanyDashInvoiceComponent } from './company-dash-invoice/company-dash-invoice.component';
import { CompanyDashRevenueComponent } from './company-dash-revenue/company-dash-revenue.component';
import { CompanyDashStatsComponent } from './company-dash-stats/company-dash-stats.component';
import { CompanyDashTicketComponent } from './company-dash-ticket/company-dash-ticket.component';
import { CompanyDashboardRoutingModule } from './company-dashboard-routing.module';
import { CompanyDashboardComponent } from './company-dashboard.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('CompanyDashboardComponent unit test', () => {
  let component: CompanyDashboardComponent;
  let fixture: ComponentFixture<CompanyDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        CompanyDashboardRoutingModule,
        CompanyTagsModule,
        NgxMaskModule.forRoot(),
        NgbModule,
        FormsModule,
        CompanyEditAsideModule,
        CompanyAssociateModule,
        ContractsPreviewModule,
        ContractsEditModule,
        PhoneModule,
        PreparePhoneModule,
        PreviewPhoneMaskModule,
        TextAreaModule,
        NgxChartsModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    providers: [{ provide: Router, useValue: mockRouter }],
    declarations: [CompanyDashboardComponent,
        CompanyDashDetailComponent,
        CompanyDashAssociateComponent,
        CompanyDashStatsComponent,
        CompanyDashTicketComponent,
        CompanyDashRevenueComponent,
        CompanyDashInvoiceComponent,
        CompanyDashContractComponent,
        CompanyDashAssociateInfoComponent],
}).compileComponents();

  });
  it('check "isArchive"', () => {
    const fixture = TestBed.createComponent(CompanyDashboardComponent);
    const com = fixture.debugElement.componentInstance;
    com.onCompanyChanged({ isArchived: true });
    expect(com.company.isArchived).toEqual(true);
  });
  it('check "totalTicketsChangedHandler"', () => {
    const fixture = TestBed.createComponent(CompanyDashboardComponent);
    const com = fixture.debugElement.componentInstance;
    com.totalTicketsChangedHandler(100);
    expect(com.totalTickets).toEqual(100);
  });
  it('check "averageResponseTimeChangedHandler"', () => {
    const fixture = TestBed.createComponent(CompanyDashboardComponent);
    const com = fixture.debugElement.componentInstance;
    com.averageResponseTimeChangedHandler('100');
    expect(com.averageResponseTime).toEqual('100');
  });
  it('check "companyNameChangedHandler"', () => {
    const fixture = TestBed.createComponent(CompanyDashboardComponent);
    const com = fixture.debugElement.componentInstance;
    com.companyNameChangedHandler('100');
    expect(com.companyName).toEqual('100');
  });
});