import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProductDashboardComponent } from './top-product-dashboard.component';

describe('TopProductDashboardComponent', () => {
  let component: TopProductDashboardComponent;
  let fixture: ComponentFixture<TopProductDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopProductDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopProductDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
