import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserLikeComponent } from './home-user-like.component';

describe('HomeUserLikeComponent', () => {
  let component: HomeUserLikeComponent;
  let fixture: ComponentFixture<HomeUserLikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUserLikeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
