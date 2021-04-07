import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswoordManagerDevicesUsersComponent } from './passwoord-manager-devices-users.component';

describe('PasswoordManagerDevicesUsersComponent', () => {
  let component: PasswoordManagerDevicesUsersComponent;
  let fixture: ComponentFixture<PasswoordManagerDevicesUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswoordManagerDevicesUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswoordManagerDevicesUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
