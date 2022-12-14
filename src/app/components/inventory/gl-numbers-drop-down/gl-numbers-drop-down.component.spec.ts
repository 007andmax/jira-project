import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlNumbersDropDownComponent } from './gl-numbers-drop-down.component';

describe('GlNumbersDropDownComponent', () => {
  let component: GlNumbersDropDownComponent;
  let fixture: ComponentFixture<GlNumbersDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlNumbersDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlNumbersDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
