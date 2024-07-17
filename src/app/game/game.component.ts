import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { settings } from '../../services/settings';
import { filter } from 'lodash';

interface player {
  username: String;
  difficulty: String;
  score: number;
}

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
  artists: Set<string> = new Set;
  currentSong: any = null;
  options: string[] = [];
  correctAnswer: string = '';
  selectedGenre: string = '';
  moreTracks: number = 0;
  incorrectCount: number = 0;
  selectedOption: any = null;
  numQuestions: number = 0;
  currentPlayer: player = {
    username: '',
    difficulty: '',
    score: 0,
  };
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private settings: settings
  ) {}

  ngOnInit(): void {
    this.settings
      .getDifficulty()
      .subscribe((value) => (this.currentPlayer.difficulty = value));
    this.settings
      .getUsername()
      .subscribe((value) => (this.currentPlayer.username = value));
    this.checkDifficulty();
    this.route.paramMap.subscribe((params) => {
      this.selectedGenre = params.get('genre') || '';
      this.authenticate();
    });
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
    if (this.isLoading) return;
    this.isLoading = true;
    let endpoint = `https://api.spotify.com/v1/search?q=genre:${this.selectedGenre}&type=track&limit=10&market=US`;
    console.log('track offset: ' + this.moreTracks);
    if (this.moreTracks) {
      endpoint = endpoint + `&offset=${this.moreTracks * 10}`;
    }
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    try {
      const response = await this.http
        .get<any>(endpoint, { headers })
        .toPromise();
      if (response.tracks.items.length === 0) {
        alert('No more tracks available.');
        this.router.navigate(['/game-over']);
      }
      this.songs = response.tracks.items;
      console.log(this.songs);
      this.songs.forEach((song: any) => {
        if (song.artists && song.artists.length > 0) {
          this.artists.add(song.artists[0].name);
          console.log(song.artists[0].name)
        }
      })
      console.log(this.artists);
      this.songs = this.shuffle(this.songs);
      this.loadNextSong();
    } catch (error) {
      console.error('Error loading songs:', error);
      alert('Error loading songs. PLease try agian later.');
      this.router.navigate(['/game-over']);
    } finally {
      this.isLoading = false;
    }
  }

  loadNextSong() {
    do {
      this.currentSong = this.songs.pop();
      console.log('number of songs left: ' + this.songs.length);
      if (this.songs.length <= 0) {
        console.log('Need to load more tracks')
        this.moreTracks++;
        this.loadSongs();
        return;
      }
    } while (this.currentSong && !this.currentSong.preview_url);

    if (this.currentSong) {
      this.correctAnswer = this.currentSong.artists[0].name;
      this.options = this.generateOptions(this.correctAnswer);
      this.selectedOption = null;
    } else {
      this.loadNextSong();
    }
  }

  generateOptions(correct: string): string[] {
    const options = new Set<string>();
    const artistsArray = Array.from(this.artists);
    console.log(artistsArray);
    options.add(correct);
    while (options.size < this.numQuestions) {
      const randomArtist =
        artistsArray[Math.floor(Math.random() * artistsArray.length)];
      options.add(randomArtist);
      console.log(randomArtist);
    }
    console.log(options);
    return Array.from(options).sort(() => Math.random() - 0.5);
  }

  checkAnswer(selectedOption: string) {
    if (selectedOption === this.correctAnswer) {
      alert('Correct!');
      this.currentPlayer.score++;
    } else {
      alert('Wrong! The correct answer was ' + this.correctAnswer);
      this.incorrectCount++;
      if (this.incorrectCount >= 3) {
        this.settings.updateLatestPlayer(this.currentPlayer);
        this.router.navigate(['/game-over']);
        return;
      }
    }
    this.loadNextSong();
  }

  shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  checkDifficulty() {
    if (this.currentPlayer.difficulty === 'easy') {
      this.numQuestions = 4;
    } else if (this.currentPlayer.difficulty === 'medium') {
      this.numQuestions = 6;
    } else {
      this.numQuestions = 8;
    }
  }
}
