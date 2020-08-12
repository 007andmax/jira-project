import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesAddComponent } from './default-services-add.component';

describe('DefaultServicesAddComponent', () => {
  let component: DefaultServicesAddComponent;
  let fixture: ComponentFixture<DefaultServicesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultServicesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
