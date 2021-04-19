import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSessionScreenComponent } from './modal-session-screen.component';

describe('ModalSessionScreenComponent', () => {
  let component: ModalSessionScreenComponent;
  let fixture: ComponentFixture<ModalSessionScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSessionScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSessionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
