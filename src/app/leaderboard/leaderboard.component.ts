import { Component, Input, OnInit } from '@angular/core';
import { settings } from '../../services/settings';

interface player {
  username: String;
  score: number;
  streak: number;
}

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  playersRanked: player[] = [];

  constructor(private settings: settings) { }

  ngOnInit(): void {
    this.settings.getRankedPlayers().subscribe(value => this.playersRanked = value);
  }

  // Dummy objects until local storage is set up
  player1: player = {
    username: "Test1",
    score: 15,
    streak: 3,
  }

  player2: player = {
    username: "Test2",
    score: 35,
    streak: 8,
  }

  player3: player = {
    username: "Test3",
    score: 5,
    streak: 0,
  }

  // This component will display all of the leaderboard people
  // Here we need to get the localstorage player objects
  // These contain a username and score and I set the rankings here

  @Input() player = {username: this.player1.username, score: this.player1.score, rank: 0};

}
