import { Component, OnInit } from '@angular/core';
import { settings } from '../../services/settings';

interface player {
  username: String;
  difficulty: String;
  score: number;
}

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnInit {

  currentPlayer: player = {
    username: '',
    difficulty: '',
    score: 0,
  }

  playersList: player[] = [];
  

  constructor(private settings: settings) { }

  ngOnInit(): void {
    this.settings.getLatestPlayer().subscribe(value => { if(value !== undefined) {this.currentPlayer = value} });
    this.settings.getRankedPlayers().subscribe(value => this.playersList = value);
    this.sortNewestPlayer();
  }

  sortNewestPlayer() {
    let tmpScore = this.currentPlayer.score;
    let loc = -1;
    for(let i = 0; i<this.playersList.length; i++) {
      if(this.playersList[i].score < tmpScore) {
        loc = i;
        break;
      }
    }
    if(loc === -1) {
      loc = this.playersList.length;
    }
    this.playersList.splice(loc, 0, this.currentPlayer);
    this.settings.updateRankedPlayer(this.playersList);
  }

}
