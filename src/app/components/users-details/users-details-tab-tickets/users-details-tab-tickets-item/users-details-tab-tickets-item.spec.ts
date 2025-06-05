import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UsersDetailsTabTicketsItemComponent } from './users-details-tab-tickets-item.component';

describe('UsersDetailsTabTicketsItemComponent unit test', () => {
  let component: UsersDetailsTabTicketsItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabTicketsItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersDetailsTabTicketsItemComponent
      ]
    }).compileComponents();

  });

  it('check "getStyleStatus"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabTicketsItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getStyleStatus("test")).toEqual({
      'border-color': null,
      'background-color': null,
      'color': null
    });
  });
  it('check "getClassType"', () => {
    const fixture = TestBed.createComponent(UsersDetailsTabTicketsItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.ticket = {
      priorityLevel: null,
    };
    expect(com.getClassType()).toEqual(`priority-icon `);
  });
});