import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MultiDatepickerModule } from 'src/app/components/shared/multi-datepicker/multi-datepicker.module';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ContractsAsideProductServicePreviewComponent } from './contracts-aside-product-service-preview.component';


describe('ContractsAsideProductServicePreviewComponent unit test', () => {
  let component: ContractsAsideProductServicePreviewComponent;
  let fixture: ComponentFixture<ContractsAsideProductServicePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        DropDownModule,
        MultiDatepickerModule,
        CompanyDropDownModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, ContractsAsideProductServicePreviewComponent],
}).compileComponents();

  });

  it('check "getSelectedInterval"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    com.getSelectedInterval();
    expect(com.selectedInterval).toEqual(`7 days`);
  });
  it('check "getDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDiscount({ discountAmount: 300, discountType: "FIXED" })).toEqual(`300 $`);
  });
  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02 : 00");
  });
  it('check "getSubTotal"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSubTotal({ quantity: 1, salePrice: 100, discountAmount: 100 })).toEqual("0.00");
  });
  it('check "calculateDiscount"', () => {
    const fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.calculateDiscount({ quantity: 1, salePrice: 100, discountAmount: 100 })).toEqual(100);
  });
});