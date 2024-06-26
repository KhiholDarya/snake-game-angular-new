import { Component, OnInit } from '@angular/core';
import { ScoresService } from '../services/scores.service';
import { Score } from '../definitions';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css'
})
export class ScoresComponent implements OnInit {

  public topScores: Score[] = [];
  public isLoggedIn: boolean = false;

  constructor(
    private _scoresService: ScoresService,
    private _loginService: LoginService,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._scoresService.scores$.subscribe(scores => {
      this.topScores = scores.sort((a, b) => b.score - a.score).slice(0, 10);
    });
    this._scoresService.load().subscribe();

    this.isLoggedIn = this._loginService.isLogged;
    }

    loadMyScores() {
      this._router.navigate(['/my-scores']);
    }
}
