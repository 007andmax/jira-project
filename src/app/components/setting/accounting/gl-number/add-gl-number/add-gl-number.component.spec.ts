import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGlNumberComponent } from './add-gl-number.component';

describe('AddGlNumberComponent', () => {
  let component: AddGlNumberComponent;
  let fixture: ComponentFixture<AddGlNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGlNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGlNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
