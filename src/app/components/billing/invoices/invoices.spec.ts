import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { CompanyDropDownModule } from '../../shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from '../../shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from '../../shared/multi-datepicker/multi-datepicker.module';
import { InvoiceExportModule } from './invoices-header/invoice-export/invoice-export.module';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { InvoicesComponent } from './invoices.component';


describe('InvoicesComponent unit test', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        InfiniteScrollModule,
        FormsModule,
        NgbModule,
        MultiDatepickerModule,
        InvoicesRoutingModule,
        KeyUpEnterModule,
        DynamicTooltipModule,
        InvoiceExportModule,
        CompanyDropDownModule,
        DropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoicesComponent
      ]
    }).compileComponents();

  });

  it('check "getTotal"', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTotal()).toEqual(0);
  });
  it('check "getTotalBalanceDue"', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTotalBalanceDue()).toEqual(0);
  });
  it('check "onSelectInvoice"', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoices = [{ selected: true, companyId: "123" }];
    com.onSelectInvoice();
    expect(com.selectedCompanyIds).toEqual(["123"]);
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(InvoicesComponent);
    const com = fixture.debugElement.componentInstance;
    com.page_number = 11;
    com.setDefaultScoll();
    expect(com.page_number).toEqual(0);
  });
});