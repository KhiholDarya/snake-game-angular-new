import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSnakeComponent, NgxSnakeModule } from 'ngx-snake';
import { FilterByEventTypePipe } from './pipes/filter/filter-by-event-type.pipe';
import { SortByTimestampPipe } from './pipes/sort/sort-by-timestamp-pipe';
import { LoginService } from '../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerDataService } from '../services/player-data.service';
import { GameplayHistoryEntry } from '../definitions';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../services/game.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    NgxSnakeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FilterByEventTypePipe,
    SortByTimestampPipe,
  ],
  templateUrl: './game-page.component.html',
  styleUrl: './game-page.component.css',
})

export class GamePageComponent implements OnInit, OnDestroy {
  @ViewChild('game', { static: true }) game: NgxSnakeComponent;

  selectedColorPalette: string = 'normal';
  playerName: string = '';
  calculatedPoints: number = 0;
  status: string = 'Ready';
  time: string = '00:00';

  private _playerDataSubscription: Subscription;
  private _gameStatusSubscription: Subscription;
  private _scoreSubscription: Subscription;
  private _timeSubscription: Subscription;

  constructor(
    private _http: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private _loginService: LoginService,
    private _playerDataService: PlayerDataService,
    private _gameService: GameService,

  ) {
    this._gameService.setGameStatus('Ready');
  }

  ngOnInit() {
    if (!this._loginService.isLogged) {
      this._gameService.setGameStatus('Log out');
      this._router.navigate(['/intro-page']);
      return;
    }
    this._playerDataSubscription = this._playerDataService.playerData$.subscribe(data => {
      this.playerName = data.name;
    });

    this._gameStatusSubscription = this._gameService.gameStatus$.subscribe(status => {
      this.status = status;
      this.addToGameplayHistory(status);
    });

    this._scoreSubscription = this._gameService.score$.subscribe(score => {
      this.calculatedPoints = score;
    });

    this._timeSubscription = this._gameService.time$.subscribe(time => {
      this.time = time;
    });

    this._route.paramMap.subscribe(params => {
      this.selectedColorPalette = params.get('colors') || 'normal';
    });
  }

  ngOnDestroy() {
    if (this._playerDataSubscription) {
      this._playerDataSubscription.unsubscribe();
    }
    if (this._gameStatusSubscription) {
      this._gameStatusSubscription.unsubscribe();
    }
    if (this._scoreSubscription) {
      this._scoreSubscription.unsubscribe();
    }
    if (this._timeSubscription) {
      this._timeSubscription.unsubscribe();
    }
  }

  updatePalette() {
    this._router.navigate(['/snake-game', { colors: this.selectedColorPalette }]);
  }

  gameplayHistory: GameplayHistoryEntry[] = [];
  filterEventType: string = 'all';
  sortOrder: 'latest' | 'oldest' = 'latest';

  private addToGameplayHistory(action: string) {
    const timestamp = new Date();
    this.gameplayHistory.push({ timestamp, action });
  }

  public showGameplayHistory: boolean = false;
  public toggleGameplayHistoryVisibility(): void {
    this.showGameplayHistory = !this.showGameplayHistory;
  }

  startGame() {
     if (this.status === 'Game Over') {
      this.resetGame();
    }
    else if (this.status === 'Started') {
      return;
    } else if (this.status === 'Ready') {
      this.calculatedPoints = 0;
      this._gameService.setScore(0);
      this._gameService.setTime('00:00');
    } else if (this.status === 'Started') {
    this.game.actionStart();
      return;
    }
    this.addToGameplayHistory('Game Started');
    this._gameService.setGameStatus('Started');
    this.game.actionStart();
  }

  stopGame() {
    this.game.actionStop();
    this._gameService.setGameStatus('Paused');
    this.addToGameplayHistory('Game Paused');
  }

  resetGame() {
    this.calculatedPoints = 0;
    this.game.actionReset();
    this._gameService.setGameStatus('Ready');
    this._gameService.resetGame();
    this.addToGameplayHistory('Game Reset');
  }

  eat(event) {
    this.calculatedPoints += 10;
    this._gameService.setScore(this.calculatedPoints);
    this.addToGameplayHistory('Food Eaten');
  }

  gameOver(event) {
    this.game.actionStop();
    this._gameService.setGameStatus('Game Over');
    this.addToGameplayHistory('Game Over');

    const playerData = this._playerDataService.getPlayerData();
    const scoreData = {
      name: playerData.name,
      score: this.calculatedPoints,
      game: 'snake'
    };
    this._http.post('http://localhost:8080/scores', scoreData, {
      headers: {
        'auth-token': playerData.token
      }
    }).subscribe({
      next: (response) => {
        console.log('Score submitted successfully');
      },
      error: (error) => {
        console.error('Error submitting score:', error);
      }
    });
  }
}


