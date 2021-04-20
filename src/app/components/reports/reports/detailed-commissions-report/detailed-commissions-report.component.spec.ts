import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedCommissionsReportComponent } from './detailed-commissions-report.component';

describe('DetailedCommissionsReportComponent', () => {
  let component: DetailedCommissionsReportComponent;
  let fixture: ComponentFixture<DetailedCommissionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedCommissionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedCommissionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
