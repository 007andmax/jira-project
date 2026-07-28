import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { InventoryAddBodyComponent } from './inventory-add-body.component';
import { FormsModule } from '@angular/forms';
import { PreloaderTicketModule } from 'src/app/components/shared/preloader-ticket/preloader-ticket.module';
import { TaxesModule } from 'src/app/components/shared/taxes/taxes.module';
import { DecimalNumberModule } from 'src/app/directives/decimal-number/decimal-number.module';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { GlNumbersDropDownModule } from '../../gl-numbers-drop-down/gl-numbers-drop-down.module';



describe('InventoryAddBodyComponent unit test', () => {
  let component: InventoryAddBodyComponent;
  let fixture: ComponentFixture<InventoryAddBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        TextAreaModule,
        TaxesModule,
        NumberModule,
        DropDownModule,
        DecimalNumberModule,
        GlNumbersDropDownModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        MatErrorModule,
        ToFixedModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InventoryAddBodyComponent
      ],
    }).compileComponents();

  });

  it('check "formatterSelectedItemText"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatterSelectedItemText()).toEqual("");
  });
  it('check "changeMarkup"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { item: { sale: 100, quantity: 1, cost: 100 } } as any;
    com.changeMarkup(200);
    expect(com.inventory.item.sale).toEqual(100);
  });
  it('check "changeSales"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { item: { sale: 100, quantity: 1, cost: 100 } } as any;
    com.changeSales({ target: { value: 200 } });
    expect(com.inventory.item.sale).toEqual(100);
  });
  it('check "changeCost"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { item: { sale: 100, quantity: 1, cost: 100 } } as any;
    com.changeCost({ target: { value: 200 } });
    expect(com.inventory.item.cost).toEqual(100);
  });
  it('check "getMarkups"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { item: { sale: 200, quantity: 1, cost: 100 } } as any;
    expect(com.getMarkups()).toEqual(0);
  });
  it('check "onSelectSupplier"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { companyId: "test" } as any;
    com.onSelectSupplier(null)
    expect(com.inventory.companyId).toEqual(null);
  });
  it('check "onSelectGlNumbers"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { glNumber: "test" } as any;
    com.onSelectGlNumbers(null)
    expect(com.inventory.glNumber).toEqual(null);
  });
  it('check "onTaxesChange"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    com.inventory = { taxIds: [] } as any;
    com.onTaxesChange([{ id: "1" }, { id: "2" }, { id: "3" }])
    expect(com.inventory.taxIds).toEqual(["1", "2", "3"]);
  });
  it('check "formatterGLNumber"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatterGLNumber({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
  it('check "formatterSeletedGLNumber"', () => {
    const fixture = TestBed.createComponent(InventoryAddBodyComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.formatterSeletedGLNumber({ glNumber: "test", description: "123" })).toEqual("test - 123");
  });
});