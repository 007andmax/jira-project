import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyProductsComponent } from './company-products.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};

describe('CompanyProductsComponent unit test', () => {
  let component: CompanyProductsComponent;
  let fixture: ComponentFixture<CompanyProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, CompanyProductsComponent],
    providers: [{ provide: Router, useValue: mockRouter }],
}).compileComponents();

  });
  it('check "calculateSumPrices"', () => {
    const fixture = TestBed.createComponent(CompanyProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.calculateSumPrices();
    expect(com.purchaseCostSum).toEqual(0);
    expect(com.salesPriceSum).toEqual(0);
  });
  it('check "onRequest"', () => {
    const fixture = TestBed.createComponent(CompanyProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onRequest(true);
    expect(com.loadingInProgress).toEqual(true);
  });
  it('check "onSelectedClient"', () => {
    const fixture = TestBed.createComponent(CompanyProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectedClient(null);
    expect(com.selectedClient).toEqual(null);
  });
  it('check "changeGeneralCheckbox"', () => {
    const fixture = TestBed.createComponent(CompanyProductsComponent);
    const com = fixture.debugElement.componentInstance;
    com.productsCompanyReport.lines = [{ isChecked: true, purchaseCost: 0, salePrice: 0 }, { isChecked: true, purchaseCost: 0, salePrice: 0 }] as any;
    com.changeGeneralCheckbox();
    expect(com.productsCompanyReport.lines[0].isChecked).toEqual(true);
  });
  it('check "parseTotal"', () => {
    const fixture = TestBed.createComponent(CompanyProductsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseTotal("123.1")).toEqual("123.10");
  });
});