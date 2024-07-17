import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaderboard-player',
  templateUrl: './leaderboard-player.component.html',
  styleUrls: ['./leaderboard-player.component.css']
})
export class LeaderboardPlayerComponent implements OnInit {

  @Input() player: any;
  @Input() rank: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
