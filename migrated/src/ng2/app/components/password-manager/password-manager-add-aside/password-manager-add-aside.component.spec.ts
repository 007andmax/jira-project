import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerAddAsideComponent } from './password-manager-add-aside.component';

describe('PasswordManagerAddAsideComponent', () => {
  let component: PasswordManagerAddAsideComponent;
  let fixture: ComponentFixture<PasswordManagerAddAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerAddAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerAddAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
