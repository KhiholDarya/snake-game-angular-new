import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { PlayerDataService } from '../services/player-data.service';
import { GameService } from '../services/game.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [
    AppComponent,
    CommonModule,
    ReactiveFormsModule,

  ],
  templateUrl: './intro-page.component.html',
  styleUrl: './intro-page.component.css'
})
export class IntroPageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _loginService: LoginService,
    private _playerDataService: PlayerDataService,
    private _gameService: GameService,
    private _http: HttpClient,
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._loadPlayerData();
  }

  private _initForm(): void {
    this.form = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      token: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      colorPalette: ['normal']
    });
  }

  private _loadPlayerData(): void {
    const playerData = this._playerDataService.getPlayerData();
    if (playerData) {
      this.form.patchValue({
        name: playerData.name,
        token: playerData.token,
      });
    }
  }

  onStartClicked(): void {
    if (this.form.valid) {
      const userData = { ...this.form.value };
      this._http.post('http://localhost:8080/check-token', { token: userData.token }).subscribe({
        next: (response: any) => {
          this._loginService.login();
          this._playerDataService.setPlayerData({ name: userData.name, token: userData.token });
          this._router.navigate(['/snake-game', { colors: this.form.value.colorPalette }]);
        },
        error: (error) => {
          console.error('Invalid token:', error);
        }
      });
    }
  }
}
