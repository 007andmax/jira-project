import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultServicesItemComponent } from './default-services-item.component';

describe('DefaultServicesItemComponent', () => {
  let component: DefaultServicesItemComponent;
  let fixture: ComponentFixture<DefaultServicesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultServicesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultServicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
