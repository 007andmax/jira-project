import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCardsHeaderComponent } from './manage-cards-header.component';

describe('ManageCardsHeaderComponent', () => {
  let component: ManageCardsHeaderComponent;
  let fixture: ComponentFixture<ManageCardsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCardsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCardsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
