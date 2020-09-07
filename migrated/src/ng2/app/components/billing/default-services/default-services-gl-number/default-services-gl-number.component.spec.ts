import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesGlNumberComponent } from './default-services-gl-number.component';

describe('DefaultServicesGlNumberComponent', () => {
  let component: DefaultServicesGlNumberComponent;
  let fixture: ComponentFixture<DefaultServicesGlNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultServicesGlNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesGlNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
