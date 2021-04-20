import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCommissionsReportComponent } from './common-commissions-report.component';

describe('CommonCommissionsReportComponent', () => {
  let component: CommonCommissionsReportComponent;
  let fixture: ComponentFixture<CommonCommissionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCommissionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCommissionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
