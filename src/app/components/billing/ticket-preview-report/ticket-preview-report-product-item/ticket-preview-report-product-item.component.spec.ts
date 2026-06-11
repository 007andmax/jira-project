import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item.component';
import { TicketPreviewProduct } from '../class/ticket-preview-product';



describe('TicketPreviewReportProductItemComponent unit test', () => {
  let component: TicketPreviewReportProductItemComponent;
  let fixture: ComponentFixture<TicketPreviewReportProductItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [TicketPreviewReportProductItemComponent
      ]
    }).compileComponents();

  });

  it('check "onChangeDiscountAmount"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.discountAmount = 1;
    com.onChangeDiscountAmount(2);
    expect(com.product.discountAmount).toEqual(2);
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "onChangeSerialNumber"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.serialNumber = "test";
    com.onChangeSerialNumber({ target: { value: "test 1" } });
    expect(com.product.serialNumber).toEqual("test 1");
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "onChangeQuantity"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.quantity = 1;
    com.onChangeQuantity({ target: { value: 2 } });
    expect(com.product.quantity).toEqual(2);
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "onChangeCost"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.item = { cost: 1 }
    com.onChangeCost(2);
    expect(com.product.item.cost).toEqual(2);
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "changeSales"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.item = { sale: 1 }
    com.changeSales(2);
    expect(com.product.item.sale).toEqual(2);
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "onChangeMarkup"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = new TicketPreviewProduct();
    com.product.item = { sale: 1, cost: 2 };
    com.markup = 1;
    com.onChangeMarkup(2);
    expect(com.markup).toEqual(2);
    expect(com.product.isEdit).toEqual(true);
  });
  it('check "getMarkups"', () => {
    const fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.product = { item: { sale: 200, quantity: 1, cost: 100 } } as any;
    expect(com.getMarkups()).toEqual(100);
  });
});