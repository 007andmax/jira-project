import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerEditAsideComponent } from './password-manager-edit-aside.component';

describe('PasswordManagerEditAsideComponent', () => {
  let component: PasswordManagerEditAsideComponent;
  let fixture: ComponentFixture<PasswordManagerEditAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerEditAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerEditAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
