import { Component, Input, OnInit } from '@angular/core';
import { settings } from '../../services/settings';
import { Router } from '@angular/router';

interface player {
  username: String;
  difficulty: String;
  score: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  playersRanked: player[] = [];

  constructor(private settings: settings, private router: Router) { }

  ngOnInit(): void {
    this.settings.getRankedPlayers().subscribe(value => this.playersRanked = value);
  }

  // Dummy objects until local storage is set up
  player1: player = {
    username: "Test1",
    difficulty: "easy",
    score: 15,
  }

  // This component will display all of the leaderboard people
  // Here we need to get the localstorage player objects
  // These contain a username and score and I set the rankings here

  @Input() players: player[] = [];
  @Input() rank: number = 0;


  returnHome() {
    this.router.navigate(['/home']);
  }
}
