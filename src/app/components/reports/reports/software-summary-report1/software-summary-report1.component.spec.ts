import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSummaryReport1Component } from './software-summary-report1.component';

describe('SoftwareSummaryReport1Component', () => {
  let component: SoftwareSummaryReport1Component;
  let fixture: ComponentFixture<SoftwareSummaryReport1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareSummaryReport1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareSummaryReport1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
