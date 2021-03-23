import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerItemComponent } from './password-manager-item.component';

describe('PasswordManagerItemComponent', () => {
  let component: PasswordManagerItemComponent;
  let fixture: ComponentFixture<PasswordManagerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
