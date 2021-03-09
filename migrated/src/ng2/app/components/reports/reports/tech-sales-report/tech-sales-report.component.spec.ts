import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSalesReportComponent } from './tech-sales-report.component';

describe('TechSalesReportComponent', () => {
  let component: TechSalesReportComponent;
  let fixture: ComponentFixture<TechSalesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechSalesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
