import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddUsersNotifyComponent } from './modal-add-users-notify.component';

describe('ModalAddUsersNotifyComponent', () => {
  let component: ModalAddUsersNotifyComponent;
  let fixture: ComponentFixture<ModalAddUsersNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddUsersNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddUsersNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
