import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private _gameStatus = new BehaviorSubject<string>('Ready');
  private _score = new BehaviorSubject<number>(0);
  private _time = new BehaviorSubject<string>('00:00');

  public gameStatus$ = this._gameStatus.asObservable();
  public score$ = this._score.asObservable();
  public time$ = this._time.asObservable();

  private timerSubscription: Subscription;
  private startTime: number;
  private elapsedTime: number = 0;

  setGameStatus(status: string) {
    this._gameStatus.next(status);
    if (status === 'Started') {
      this.startTimer();
    } else if (status === 'Paused' || status === 'Game Over') {
      this.stopTimer();
    }
  }

  setScore(score: number) {
    this._score.next(score);
  }

  setTime(time: string) {
    this._time.next(time);
  }

  resetGame() {
    this._gameStatus.next('Ready');
    this._score.next(0);
    this._time.next('00:00');
    this.elapsedTime = 0;
    this.stopTimer();
  }

  private startTimer() {
    this.startTime = Date.now() - this.elapsedTime;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime = Date.now() - this.startTime;
      this._time.next(this.formatTime(this.elapsedTime));
    });
  }

  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
