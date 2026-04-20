import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { InvoicesFilterComponent } from './invoices-filter.component';



describe('InvoicesFilterComponent unit test', () => {
  let component: InvoicesFilterComponent;
  let fixture: ComponentFixture<InvoicesFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        PreviewPhoneMaskModule,
        DynamicTooltipModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, InvoicesFilterComponent]
}).compileComponents();

  });

  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(InvoicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectStatus({ value: "test" })
    expect(com.invoicesFilter.status).toEqual("test");
  });
  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(InvoicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectCompany(null)
    expect(com.invoicesFilter.companyIds.length).toEqual(0);
  });
  it('check "onSetNumberInvoice"', () => {
    const fixture = TestBed.createComponent(InvoicesFilterComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSetNumberInvoice({ target: { value: "test" } })
    expect(com.invoicesFilter.invoiceNumber).toEqual("test");
  });
});