import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PlayerDataService } from '../services/player-data.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerDataGuard implements CanActivate {

  constructor(
    private _playerDataService: PlayerDataService,
    private _router: Router
  ) {}

  canActivate(): boolean {
    if (this._playerDataService.hasPlayerData()) {
      return true;
    } else {
      this._router.navigate(['/intro-page']);
      return false;
    }
  }
}
