import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//token
const AUTH_ENDPOINT =
  'https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token';
const TOKEN_KEY = 'whos-who-access-token';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  token: string = '';
  songs: any[] = [];
  currentSong: any = null;
  options: string[] = [];
  correctAnswer: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.authenticate();
  }

  async authenticate() {
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        this.token = storedToken.value;
        this.loadSongs();
        return;
      }
    }
    const { access_token, expires_in } = await this.http
      .get<any>(AUTH_ENDPOINT)
      .toPromise();
    const newToken = {
      value: access_token,
      expiration: Date.now() + (expires_in - 20) * 1000,
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
    this.token = newToken.value;
    this.loadSongs();
  }

  async loadSongs() {
    const endpoint =
      'https://api.spotify.com/v1/search?q=';
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    const response = await this.http
      .get<any>(endpoint, { headers })
      .toPromise();
    this.songs = response.tracks;
    this.loadNextSong();
  }

  loadNextSong() {
    if (this.songs.length === 0) return;

    this.currentSong = this.songs.pop();
    this.correctAnswer = this.currentSong.artists[0].name;
    this.options = this.generateOptions(this.correctAnswer);

    // Play song preview
    const audio = new Audio(this.currentSong.preview_url);
    audio.play();
  }

  generateOptions(correct: string): string[] {
    const options = new Set<string>();
    options.add(correct);
    while (options.size < 4) {
      const randomArtist =
        this.songs[Math.floor(Math.random() * this.songs.length)].artists[0]
          .name;
      options.add(randomArtist);
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  checkAnswer(selectedOption: string) {
    if (selectedOption === this.correctAnswer) {
      alert('Correct!');
    } else {
      alert('Wrong! The correct answer was ' + this.correctAnswer);
    }
    this.loadNextSong();
  }
}
