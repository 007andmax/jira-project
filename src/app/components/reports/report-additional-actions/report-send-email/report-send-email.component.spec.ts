import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSendEmailComponent } from './report-send-email.component';

describe('ReportSendEmailComponent', () => {
  let component: ReportSendEmailComponent;
  let fixture: ComponentFixture<ReportSendEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportSendEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportSendEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
