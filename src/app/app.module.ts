import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LeaderboardPlayerComponent } from './leaderboard/leaderboard-player/leaderboard-player.component';
import { GameOverComponent } from './game-over/game-over.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  {  path: "leaderboard", component: LeaderboardComponent  },
  { path: 'game-over', component: GameOverComponent}
];

@NgModule({
  declarations: [AppComponent, HomeComponent, LeaderboardComponent, LeaderboardPlayerComponent, GameOverComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
