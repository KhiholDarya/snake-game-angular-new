import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../definitions';

@Injectable({
  providedIn: 'root',
})
export class PlayerDataService {
  private _playerData: User = this._loadPlayerDataFromStorage();

  private _playerDataSubject = new BehaviorSubject<User>(this._playerData);

  public playerData$ = this._playerDataSubject.asObservable();

  private _loadPlayerDataFromStorage(): User {
    const storedPlayerData = localStorage.getItem('playerData');
    return storedPlayerData ? JSON.parse(storedPlayerData) : { name: '', token: '' };
  }

  public getPlayerData() {
    return this._playerDataSubject.value;
  }

  public setPlayerData(player: User) {
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
