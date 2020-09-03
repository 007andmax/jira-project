import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesEditComponent } from './default-services-edit.component';

describe('DefaultServicesEditComponent', () => {
  let component: DefaultServicesEditComponent;
  let fixture: ComponentFixture<DefaultServicesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultServicesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
