import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerEditLinkedComponent } from './password-manager-edit-linked.component';

describe('PasswordManagerEditLinkedComponent', () => {
  let component: PasswordManagerEditLinkedComponent;
  let fixture: ComponentFixture<PasswordManagerEditLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerEditLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerEditLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
