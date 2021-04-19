import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesNoExistRemoteSessionsComponent } from './company-devices-no-exist-remote-sessions.component';

describe('CompanyDevicesNoExistRemoteSessionsComponent', () => {
  let component: CompanyDevicesNoExistRemoteSessionsComponent;
  let fixture: ComponentFixture<CompanyDevicesNoExistRemoteSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesNoExistRemoteSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesNoExistRemoteSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
