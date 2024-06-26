import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgxSnakeModule } from 'ngx-snake';
import { IntroPageComponent } from './intro-page/intro-page.component';
import { GamePageComponent } from './game-page/game-page.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { PlayerDataService } from './services/player-data.service';
import { ScoresComponent } from './scores/scores.component';
import { Score } from './definitions';
import { LoginService } from './services/login.service';
import { GameService } from './services/game.service';
import { ScoresService } from './services/scores.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NgxSnakeModule,
    IntroPageComponent,
    GamePageComponent,
    RouterOutlet,
    ScoresComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public responseResult: Score[] = [];
  public topScores: Score[] = [];
  time: string = '00:00';
  score: number = 0;
  gameStatus: string = 'Log out';
  name: string = '';
  currentPath: string;

  constructor(
    private readonly _location: Location,
    private _router: Router,
    private _gameService: GameService,
    private _loginService: LoginService,
    private _scoresService: ScoresService,
    private _playerDataService: PlayerDataService
  ) {}

  ngOnInit() {
    this._gameService.time$.subscribe((time) => (this.time = time));
    this._gameService.score$.subscribe((score) => (this.score = score));
    this._gameService.gameStatus$.subscribe(
      (status) => (this.gameStatus = status)
    );

    this._playerDataService.playerData$.subscribe((data) => {
      this.name = data.name;
    });

    this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentPath = event.urlAfterRedirects;
      this.checkLoginStatus();
    });
    this.checkLoginStatus();
  }

  public onLogOut() {
    this._gameService.resetGame();
    this._gameService.setGameStatus('Log out')
    this._loginService.logout();
    this._playerDataService.reset();
    this._router.navigate(['/intro-page']);
  }

  loadScores() {
    this._scoresService.load().subscribe(
      (result) => this._scoresService.setScores(result),
      (error) => console.error('Error fetching scores:', error)
    );
  }

  onScores() {
    this._router.navigate(['/scores']);
  }

  navigate() {
    if (this._loginService.isLogged) {
      this._router.navigate(['/snake-game']);
    } else {
      this._router.navigate(['/intro-page']);
    }
  }
  isGamePage(): boolean {
    return this.currentPath && this.currentPath.startsWith('/snake-game');
  }

  private checkLoginStatus() {
    if (!this._loginService.isLogged && this.isGamePage()) {
      this._gameService.setGameStatus('Log out');
      this._router.navigate(['/intro-page']);
    }
    else if (!this._loginService.isLogged) {
      this._gameService.setGameStatus('Log out');
    }
  }
}
