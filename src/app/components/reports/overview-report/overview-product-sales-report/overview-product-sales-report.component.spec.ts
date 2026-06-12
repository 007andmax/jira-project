import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewProductSalesReportComponent } from './overview-product-sales-report.component';

describe('OverviewProductSalesReportComponent', () => {
  let component: OverviewProductSalesReportComponent;
  let fixture: ComponentFixture<OverviewProductSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OverviewProductSalesReportComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(OverviewProductSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
