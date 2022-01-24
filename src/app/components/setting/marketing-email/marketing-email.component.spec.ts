import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingEmailComponent } from './marketing-email.component';

describe('MarketingEmailComponent', () => {
  let component: MarketingEmailComponent;
  let fixture: ComponentFixture<MarketingEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
