import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { UsersCheckUseComponent } from './users-check-use.component';


describe('UsersCheckUseComponent unit test', () => {
  let component: UsersCheckUseComponent;
  let fixture: ComponentFixture<UsersCheckUseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersCheckUseComponent
      ],
      providers: [NgbActiveModal]
    }).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(UsersCheckUseComponent);
    const com = fixture.debugElement.componentInstance;
    com.user = { firstName: 'John', lastName: 'Doe' } as any;
    expect(com.getUserName()).toEqual('John Doe');
  });

});