import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardsTableComponent } from './manage-cards-table.component';

describe('ManageCardsTableComponent', () => {
  let component: ManageCardsTableComponent;
  let fixture: ComponentFixture<ManageCardsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCardsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
