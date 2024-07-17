import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { settings } from '../../services/settings';

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
  currentSong: any = null;
  options: string[] = [];
  correctAnswer: string = '';
  selectedGenre: string = '';
  moreTracks: number = 0;
  correctCount: number = 0;
  incorrectCount: number = 0;
  selectedOption: any = null;
  difficulty: String = '';
  numQuestions: number = 0;
  currentPlayer: player = {
    username: '',
    difficulty: '',
    score: 0,
  }

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private settings: settings,
  ) {}

  ngOnInit(): void {
    this.settings.getDifficulty().subscribe(value => this.difficulty = value);
    this.settings.getUsername().subscribe(value => this.currentPlayer.username = value);
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
    let endpoint = `https://api.spotify.com/v1/search?q=genre:${this.selectedGenre}&type=track&limit=10&market=US`;
    if (this.moreTracks) {
      endpoint = endpoint + `&offset=${this.moreTracks}`;
    }
    const headers = {
      Authorization: `Bearer ${this.token}`,
    };
    const response = await this.http
      .get<any>(endpoint, { headers })
      .toPromise();
    this.songs = response.tracks.items;
    this.songs = this.shuffle(this.songs);
    this.loadNextSong();
  }

  loadNextSong() {
    if (this.songs.length === 0) {
      this.moreTracks++;
      this.loadSongs();
      return;
    }
    do {
      this.currentSong = this.songs.pop();
    } while (this.currentSong && !this.currentSong.preview_url);

    if (this.currentSong) {
      this.correctAnswer = this.currentSong.artists[0].name;
      this.options = this.generateOptions(this.correctAnswer);
      this.selectedOption = null;
    }
  }

  generateOptions(correct: string): string[] {
    const options = new Set<string>();
    options.add(correct);
    while (options.size < this.numQuestions) {
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
      this.correctCount++;
    } else {
      alert('Wrong! The correct answer was ' + this.correctAnswer);
      this.incorrectCount++;
      if (this.incorrectCount >= 3) {
        this.currentPlayer.score = this.correctCount;
        this.currentPlayer.difficulty = this.difficulty;
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
    if(this.difficulty === "easy") {
      this.numQuestions = 4;
    } else if(this.difficulty === "medium") {
      this.numQuestions = 6;
    } else {
      this.numQuestions = 8;
    }
  }
}
