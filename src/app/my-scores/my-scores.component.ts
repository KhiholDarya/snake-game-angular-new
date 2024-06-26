import { Component, OnInit } from '@angular/core';
import { ScoresService } from '../services/scores.service';
import { PlayerDataService } from '../services/player-data.service';
import { Score } from '../definitions';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-scores',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './my-scores.component.html',
  styleUrls: ['./my-scores.component.css'],
})
export class MyScoresComponent implements OnInit {
  scores: Score[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private _router: Router,
    private _scoresService: ScoresService,
    private _playerDataService: PlayerDataService
  ) { }

  ngOnInit(): void {
    this.loadScores();
    setInterval(() => {
      this.loadScores();
    }, 30000); // Update scores every 30 seconds
  }

  loadScores() {
    const playerName = this._playerDataService.getPlayerData().name;

    this._scoresService.scores$.subscribe(scores => {
      this.scores = scores.filter(score => score.name === playerName);
      this.sortScores();
    });
    this._scoresService.load().subscribe();
  }

   sortScores() {
    this.scores.sort((a, b) => {
      return this.sortDirection === 'asc' ? a.score - b.score : b.score - a.score;
    });
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortScores();
  }

  loadAllScores() {
    this._router.navigate(['/scores']);
  }
}
