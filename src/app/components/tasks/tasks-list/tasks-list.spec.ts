import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TasksListComponent } from './tasks-list.component';



describe('TasksListComponent unit test', () => {
  let component: TasksListComponent;
  let fixture: ComponentFixture<TasksListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        InfiniteScrollModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, TasksListComponent]
}).compileComponents();

  });

  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(TasksListComponent);
    const com = fixture.debugElement.componentInstance;
    com.setDefaultScoll();
    expect(com.page_number).toEqual(0);
    expect(com.list).toEqual([]);
  });
});