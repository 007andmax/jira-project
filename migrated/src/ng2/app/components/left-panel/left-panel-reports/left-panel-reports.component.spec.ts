import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelReportsComponent } from './left-panel-reports.component';

describe('LeftPanelReportsComponent', () => {
  let component: LeftPanelReportsComponent;
  let fixture: ComponentFixture<LeftPanelReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
