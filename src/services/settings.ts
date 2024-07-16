import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class settings {

    private genreSource = new BehaviorSubject<String>('');
    genre = this.genreSource.asObservable();

    private questionNumSource = new BehaviorSubject<number>(0);
    questionNum = this.questionNumSource.asObservable();

    private livesSource = new BehaviorSubject<number>(0);
    lives = this.livesSource.asObservable();

    updateGenre(newGenre: String) {
        this.genreSource.next(newGenre);
    }

    updateQuestionNum(newQuestionNum: number) {
        this.questionNumSource.next(newQuestionNum);
    }

    updateLives(newLives: number) {
        this.livesSource.next(newLives);
    }
}