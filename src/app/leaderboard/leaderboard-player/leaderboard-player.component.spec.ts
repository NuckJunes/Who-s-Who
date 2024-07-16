import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardPlayerComponent } from './leaderboard-player.component';

describe('LeaderboardPlayerComponent', () => {
  let component: LeaderboardPlayerComponent;
  let fixture: ComponentFixture<LeaderboardPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
