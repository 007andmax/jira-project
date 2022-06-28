import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlNumberCheckUseComponent } from './gl-number-check-use.component';

describe('GlNumberCheckUseComponent', () => {
  let component: GlNumberCheckUseComponent;
  let fixture: ComponentFixture<GlNumberCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlNumberCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlNumberCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
