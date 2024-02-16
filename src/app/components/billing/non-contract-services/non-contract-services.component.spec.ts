import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesComponent } from './non-contract-services.component';

describe('DefaultServicesComponent', () => {
  let component: DefaultServicesComponent;
  let fixture: ComponentFixture<DefaultServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultServicesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
