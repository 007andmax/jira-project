import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsPreviewComponent } from './contracts-preview.component';

describe('ContractsPreviewComponent', () => {
  let component: ContractsPreviewComponent;
  let fixture: ComponentFixture<ContractsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
