import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationbycompanyReportComponent } from './applicationbycompany-report.component';

describe('ApplicationbycompanyReportComponent', () => {
  let component: ApplicationbycompanyReportComponent;
  let fixture: ComponentFixture<ApplicationbycompanyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationbycompanyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationbycompanyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
