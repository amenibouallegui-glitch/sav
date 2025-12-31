import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>SAV Pro</h1>
          <p>Service Après-Vente</p>
          <p class="login-subtitle">Connectez-vous à votre espace</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              type="email" 
              formControlName="email"
              placeholder="votre@email.com"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input 
              id="password"
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary login-btn"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="isLoading" class="spinner"></span>
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        
        <div class="demo-accounts">
          <h3>Comptes de démonstration</h3>
          <div class="demo-buttons">
            <button class="btn btn-secondary btn-sm" (click)="loginAsAdmin()">
              Responsable SAV
            </button>
            <button class="btn btn-secondary btn-sm" (click)="loginAsClient()">
              Technicien
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur de connexion';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loginAsAdmin() {
    this.loginForm.patchValue({
      email: 'admin@demo.com',
      password: 'password123'
    });
  }

  loginAsClient() {
    this.loginForm.patchValue({
      email: 'client@demo.com',
      password: 'password123'
    });
  }
}