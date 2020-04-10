import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxesReportComponent } from './taxes-report.component';

describe('TaxesReportComponent', () => {
  let component: TaxesReportComponent;
  let fixture: ComponentFixture<TaxesReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxesReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
