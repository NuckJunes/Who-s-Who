import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

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

    // private questionNumSource = new BehaviorSubject<number>(0);
    // questionNum = this.questionNumSource.asObservable();

    // private livesSource = new BehaviorSubject<number>(0);
    // lives = this.livesSource.asObservable();

    updateGenre(newGenre: String) {
        this.genreSource.next(newGenre);
    }

    updateDifficulty(newDifficulty: String) {
        this.difficultySource.next(newDifficulty);
    }

    updateUsername(newUsername: String) {
        this.usernameSource.next(newUsername);
    }

    // updateQuestionNum(newQuestionNum: number) {
    //     this.questionNumSource.next(newQuestionNum);
    // }

    // updateLives(newLives: number) {
    //     this.livesSource.next(newLives);
    // }
}