import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { Invoice } from '../class/invoice';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { InvoicesHeaderComponent } from './invoices-header.component';


describe('InvoicesHeaderComponent unit test', () => {
  let component: InvoicesHeaderComponent;
  let fixture: ComponentFixture<InvoicesHeaderComponent>;

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
        NoopAnimationsModule, InvoicesHeaderComponent]
}).compileComponents();

  });

  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(InvoicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 7;
    expect(com.getTextCountFilters()).toEqual(`Filters (7)`);
  });
  it('check "onChangeCountFilter"', () => {
    const fixture = TestBed.createComponent(InvoicesHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeCountFilter(7);
    expect(com.countFilter).toEqual(7);
  });
});