import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSummaryDevicesDroDownComponent } from './software-summary-devices-dro-down.component';

describe('SoftwareSummaryDevicesDroDownComponent', () => {
  let component: SoftwareSummaryDevicesDroDownComponent;
  let fixture: ComponentFixture<SoftwareSummaryDevicesDroDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareSummaryDevicesDroDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareSummaryDevicesDroDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
