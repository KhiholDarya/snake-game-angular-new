import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _userIsLogged = false;

  constructor() {
    const storedLoggedStatus = localStorage.getItem('isLogged');
    this._userIsLogged = storedLoggedStatus === 'true';
  }

  public get isLogged() { return this._userIsLogged; }

  public login() {
    this._userIsLogged = true;
    localStorage.setItem('isLogged', 'true');
  }

  public logout() {
    this._userIsLogged = false;
    localStorage.setItem('isLogged', 'false');
  }
}
