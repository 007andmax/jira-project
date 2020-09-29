import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideProductServicePreviewComponent } from './contracts-aside-product-service-preview.component';

describe('ContractsAsideProductServicePreviewComponent', () => {
  let component: ContractsAsideProductServicePreviewComponent;
  let fixture: ComponentFixture<ContractsAsideProductServicePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideProductServicePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideProductServicePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
