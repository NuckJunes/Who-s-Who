import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { LeaderboardPlayerComponent } from './leaderboard/leaderboard-player/leaderboard-player.component';
import { GameComponent } from "./game/game.component";
import { GameOverComponent } from './game-over/game-over.component';
import { TaskbarComponent } from './taskbar/taskbar.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'game/:genre', component: GameComponent},
  {  path: "leaderboard", component: LeaderboardComponent  },
  { path: 'game-over', component: GameOverComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [AppComponent, HomeComponent, LeaderboardComponent, LeaderboardPlayerComponent, GameOverComponent, GameComponent, TaskbarComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
