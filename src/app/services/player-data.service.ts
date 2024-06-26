import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerDataService {
  private _playerData = {
    name: '',
    token: ''
  };

  private _playerDataSubject = new BehaviorSubject<{ name: string, token: string }>(this._loadPlayerDataFromStorage());

  public playerData$ = this._playerDataSubject.asObservable();

  private _loadPlayerDataFromStorage(): { name: string, token: string } {
    const storedPlayerData = localStorage.getItem('playerData');
    return storedPlayerData ? JSON.parse(storedPlayerData) : { name: '', token: '' };
  }

  public getPlayerData() {
    return this._playerDataSubject.value;
  }

  public setPlayerData(player: { name: string, token: string }) {
    this._playerData = player;
    this._playerDataSubject.next(player);
    localStorage.setItem('playerData', JSON.stringify(player));
  }

  public reset() {
    this._playerData = { name: '', token: '' };
    this._playerDataSubject.next(this._playerData);
    localStorage.removeItem('playerData');
  }

  public hasPlayerData(): boolean {
    const playerData = this.getPlayerData();
    return playerData.name !== '' && playerData.token !== '';
  }
}
