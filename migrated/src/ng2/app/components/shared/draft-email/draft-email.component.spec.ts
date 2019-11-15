import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftEmailComponent } from './draft-email.component';

describe('DraftEmailComponent', () => {
  let component: DraftEmailComponent;
  let fixture: ComponentFixture<DraftEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraftEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
