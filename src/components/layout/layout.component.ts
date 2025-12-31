import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-layout',
  template: `
    <div class="app-layout">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2>SAV Pro</h2>
          <p class="subtitle">Service Après-Vente</p>
        </div>
        
        <ul class="nav-menu">
          <li>
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="icon">📊</span>
              Tableau de bord
            </a>
          </li>
          <li>
            <a routerLink="/clients" routerLinkActive="active">
              <span class="icon">👥</span>
              Clients
            </a>
          </li>
          <li>
            <a routerLink="/claims" routerLinkActive="active">
              <span class="icon">📝</span>
              Réclamations SAV
            </a>
          </li>
          <li>
            <a routerLink="/warranty" routerLinkActive="active">
              <span class="icon">🛡️</span>
              Garanties
            </a>
          </li>
          <li>
            <a routerLink="/interventions" routerLinkActive="active">
              <span class="icon">🔧</span>
              Interventions
            </a>
          </li>
          <li>
            <a routerLink="/articles" routerLinkActive="active">
              <span class="icon">📦</span>
              Pièces détachées
            </a>
          </li>
          <li>
            <a routerLink="/reports" routerLinkActive="active">
              <span class="icon">📈</span>
              Rapports SAV
            </a>
          </li>
        </ul>
        
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="user-avatar">{{ currentUser?.firstName?.[0] }}{{ currentUser?.lastName?.[0] }}</div>
            <div class="user-details">
              <p class="user-name">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</p>
              <p class="user-role">{{ currentUser?.role }}</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" (click)="logout()">
            Déconnexion
          </button>
        </div>
      </nav>
      
      <main class="main-content">
        <header class="top-bar">
          <div class="breadcrumb">
            <span>{{ getCurrentPageTitle() }}</span>
          </div>
        </header>
        
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentPageTitle(): string {
    const url = this.router.url;
    if (url.includes('dashboard')) return 'Tableau de bord';
    if (url.includes('clients')) return 'Gestion des clients';
    if (url.includes('claims')) return 'Réclamations SAV';
    if (url.includes('warranty')) return 'Gestion des garanties';
    if (url.includes('interventions')) return 'Interventions techniques';
    if (url.includes('articles')) return 'Pièces détachées';
    if (url.includes('reports')) return 'Rapports SAV';
    return 'SAV Pro';
  }
}