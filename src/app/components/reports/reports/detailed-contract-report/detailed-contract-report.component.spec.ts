import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedContractReportComponent } from './detailed-contract-report.component';

describe('DetailedContractReportComponent', () => {
  let component: DetailedContractReportComponent;
  let fixture: ComponentFixture<DetailedContractReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedContractReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedContractReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
