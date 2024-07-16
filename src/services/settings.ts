import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, subscribeOn } from 'rxjs'
import { HttpClient } from '@angular/common/http';

interface player {
    username: String;
    score: number;
    streak: number;
}


@Injectable({
    providedIn: 'root',
})
export class settings {

    private genreSource = new BehaviorSubject<String>('');
    genre = this.genreSource.asObservable();

    private difficultySource = new BehaviorSubject<String>('');
    difficulty = this.difficultySource.asObservable();

    private usernameSource = new BehaviorSubject<String>('');
    username = this.usernameSource.asObservable();

    private latestPlayerSource = new BehaviorSubject<player | undefined>(undefined);
    latestPlayer = this.latestPlayerSource.asObservable();

    private rankedPlayerSource = new BehaviorSubject<player[]>([]);
    rankedPlayer = this.rankedPlayerSource.asObservable();

    // private questionNumSource = new BehaviorSubject<number>(0);
    // questionNum = this.questionNumSource.asObservable();

    // private livesSource = new BehaviorSubject<number>(0);
    // lives = this.livesSource.asObservable();

    constructor(private http: HttpClient) {}

    updateGenre(newGenre: String) {
        this.genreSource.next(newGenre);
    }

    updateDifficulty(newDifficulty: String) {
        this.difficultySource.next(newDifficulty);
    }

    updateUsername(newUsername: String) {
        this.usernameSource.next(newUsername);
    }

    updateLatestPlayer(newPlayer: player) {
        this.latestPlayerSource.next(newPlayer);
    }

    updateRankedPlayer(players: player[]) {
        this.rankedPlayerSource.next(players);
    }

    // updateQuestionNum(newQuestionNum: number) {
    //     this.questionNumSource.next(newQuestionNum);
    // }

    // updateLives(newLives: number) {
    //     this.livesSource.next(newLives);
    // }

    getRankedPlayers():Observable<player[]> {
        return this.rankedPlayerSource;
    }
}