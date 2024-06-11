import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeViewPostsComponent } from './home-view-posts.component';

describe('HomeViewPostsComponent', () => {
  let component: HomeViewPostsComponent;
  let fixture: ComponentFixture<HomeViewPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeViewPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeViewPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
