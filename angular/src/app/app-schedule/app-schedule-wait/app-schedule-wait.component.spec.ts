import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScheduleWaitComponent } from './app-schedule-wait.component';

describe('AppScheduleWaitComponent', () => {
  let component: AppScheduleWaitComponent;
  let fixture: ComponentFixture<AppScheduleWaitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppScheduleWaitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppScheduleWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
