import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taskbar',
  templateUrl: './taskbar.component.html',
  styleUrls: ['./taskbar.component.css']
})
export class TaskbarComponent implements OnInit {

  selectedGenre: string = '';

  ngOnInit(): void {}

  constructor(private router: Router) { }

  isHome(): boolean {
    return this.router.url === '/home';
  }

  isLeaderboard(): boolean {
    return this.router.url === '/leaderboard';
  }

  navigate(destination: string): void {
    if(this.router.url.startsWith('/game')) {
      console.log('check if on game screen.')
      const confirmation = confirm('If you leave the page, your progress will be localStorage. Do you want to continue?');
      if (!confirmation) {
        return;
      }
    }
    this.router.navigate([`/${destination}`]);
  }

  

}
