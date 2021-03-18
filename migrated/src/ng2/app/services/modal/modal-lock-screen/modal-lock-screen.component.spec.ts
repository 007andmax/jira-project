import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLockScreenComponent } from './modal-lock-screen.component';

describe('ModalLockScreenComponent', () => {
  let component: ModalLockScreenComponent;
  let fixture: ComponentFixture<ModalLockScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLockScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLockScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
