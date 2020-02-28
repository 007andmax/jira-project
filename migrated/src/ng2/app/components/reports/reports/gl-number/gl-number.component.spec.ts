import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlNumberComponent } from './gl-number.component';

describe('GlNumberComponent', () => {
  let component: GlNumberComponent;
  let fixture: ComponentFixture<GlNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
