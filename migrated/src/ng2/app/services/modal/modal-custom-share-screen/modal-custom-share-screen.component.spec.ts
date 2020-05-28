import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomShareScreenComponent } from './modal-custom-share-screen.component';

describe('ModalCustomShareScreenComponent', () => {
  let component: ModalCustomShareScreenComponent;
  let fixture: ComponentFixture<ModalCustomShareScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCustomShareScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCustomShareScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
