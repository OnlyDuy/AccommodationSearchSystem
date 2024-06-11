import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserPostsDetailComponent } from './home-user-posts-detail.component';

describe('HomeUserPostsDetailComponent', () => {
  let component: HomeUserPostsDetailComponent;
  let fixture: ComponentFixture<HomeUserPostsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUserPostsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserPostsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
