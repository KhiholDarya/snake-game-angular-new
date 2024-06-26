import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score } from '../definitions';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  private _endpoint = 'http://localhost:8080/snake';
  private _scoresSubject = new BehaviorSubject<Score[]>([]);
  public scores$ = this._scoresSubject.asObservable();

  constructor(private _http: HttpClient) {}

  load(): Observable<Score[]> {
    const options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
      }),
    };
    return this._http
      .get<Score[]>(this._endpoint, options)
      .pipe(tap((scores) => this._scoresSubject.next(scores)));
  }

  public setScores(scores: Score[]): void {
    this._scoresSubject.next(scores);
  }

  public getScores(): Score[] {
    return this._scoresSubject.getValue();
  }
}
