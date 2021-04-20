import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesExistRemoteSessionsComponent } from './company-devices-exist-remote-sessions.component';

describe('CompanyDevicesExistRemoteSessionsComponent', () => {
  let component: CompanyDevicesExistRemoteSessionsComponent;
  let fixture: ComponentFixture<CompanyDevicesExistRemoteSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesExistRemoteSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesExistRemoteSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
