import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteConnectionReportComponent } from './remote-connection-report.component';

describe('RemoteConnectionReportComponent', () => {
  let component: RemoteConnectionReportComponent;
  let fixture: ComponentFixture<RemoteConnectionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoteConnectionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteConnectionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
