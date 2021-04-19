import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAdditionalActionsComponent } from './report-additional-actions.component';

describe('ReportAdditionalActionsComponent', () => {
  let component: ReportAdditionalActionsComponent;
  let fixture: ComponentFixture<ReportAdditionalActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportAdditionalActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAdditionalActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
