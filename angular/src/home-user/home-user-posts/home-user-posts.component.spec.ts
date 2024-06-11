import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserPostsComponent } from './home-user-posts.component';

describe('HomeUserPostsComponent', () => {
  let component: HomeUserPostsComponent;
  let fixture: ComponentFixture<HomeUserPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeUserPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
