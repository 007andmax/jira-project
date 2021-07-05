import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerLinkedComponent } from './password-manager-linked.component';

describe('PasswordManagerLinkedComponent', () => {
  let component: PasswordManagerLinkedComponent;
  let fixture: ComponentFixture<PasswordManagerLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
