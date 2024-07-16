import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GameComponent } from './game/game.component';
import { GameOverComponent } from './game-over/game-over.component';

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: 'game/:genre', component:GameComponent },
  { path: 'game-over', component: GameOverComponent}
];

@NgModule({
  declarations: [AppComponent, HomeComponent, GameComponent, GameOverComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {}
