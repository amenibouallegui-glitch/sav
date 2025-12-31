import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { ClaimService } from '../../services/claim.service';
import { InterventionService } from '../../services/intervention.service';
import { ArticleService } from '../../services/article.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard fadeIn">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de votre service après-vente</p>
      </div>
      
      <div class="stats-grid grid grid-cols-4">
        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-icon clients">👥</div>
              <div class="stat-info">
                <h3>{{ stats.totalClients }}</h3>
                <p>Clients actifs</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-icon claims">🔧</div>
              <div class="stat-info">
                <h3>{{ stats.totalClaims }}</h3>
                <p>Réclamations SAV</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-icon interventions">⚙️</div>
              <div class="stat-info">
                <h3>{{ stats.totalInterventions }}</h3>
                <p>Interventions tech.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stat-card card">
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-icon articles">📦</div>
              <div class="stat-info">
                <h3>{{ stats.totalArticles }}</h3>
                <p>Pièces en stock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="priority-alerts grid grid-cols-3 mb-6">
        <div class="alert-card card">
          <div class="card-body">
            <div class="alert-content urgent">
              <div class="alert-icon">🚨</div>
              <div class="alert-info">
                <h4>{{ stats.urgentClaims }}</h4>
                <p>Réclamations urgentes</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="alert-card card">
          <div class="card-body">
            <div class="alert-content warranty">
              <div class="alert-icon">⏰</div>
              <div class="alert-info">
                <h4>{{ stats.expiringWarranties }}</h4>
                <p>Garanties expirant</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="alert-card card">
          <div class="card-body">
            <div class="alert-content stock">
              <div class="alert-icon">📉</div>
              <div class="alert-info">
                <h4>{{ stats.lowStockItems }}</h4>
                <p>Stock faible</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content grid grid-cols-2">
        <div class="card">
          <div class="card-header">
            <h3>Réclamations SAV récentes</h3>
            <p>Dernières demandes de service après-vente</p>
          </div>
          <div class="card-body">
            <div *ngIf="isLoading" class="loading">
              <div class="spinner"></div>
            </div>
            <div *ngIf="!isLoading && recentClaims.length === 0" class="empty-state">
              <p>Aucune réclamation récente</p>
            </div>
            <div *ngIf="!isLoading && recentClaims.length > 0" class="claims-list">
              <div *ngFor="let claim of recentClaims" class="claim-item">
                <div class="claim-content">
                  <h4>{{ claim.title }}</h4>
                  <p class="claim-type">{{ getIssueTypeLabel(claim.issueType) }}</p>
                  <p class="claim-client" *ngIf="claim.client">
                    {{ claim.client.firstName }} {{ claim.client.lastName }}
                  </p>
                  <p class="claim-date">{{ formatDate(claim.createdAt) }}</p>
                </div>
                <div class="claim-status">
                  <span class="badge badge-sm" [ngClass]="getPriorityBadgeClass(claim.priority)">
                    {{ claim.priority }}
                  </span>
                  <span class="badge" [ngClass]="getClaimBadgeClass(claim.status)">
                    {{ claim.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h3>Interventions techniques du jour</h3>
            <p>Interventions SAV programmées aujourd'hui</p>
          </div>
          <div class="card-body">
            <div *ngIf="isLoading" class="loading">
              <div class="spinner"></div>
            </div>
            <div *ngIf="!isLoading && todayInterventions.length === 0" class="empty-state">
              <p>Aucune intervention programmée</p>
            </div>
            <div *ngIf="!isLoading && todayInterventions.length > 0" class="interventions-list">
              <div *ngFor="let intervention of todayInterventions" class="intervention-item">
                <div class="intervention-content">
                  <h4>{{ intervention.title }}</h4>
                  <p class="intervention-type">{{ getInterventionTypeLabel(intervention.interventionType) }}</p>
                  <p class="intervention-client" *ngIf="intervention.client">
                    {{ intervention.client.firstName }} {{ intervention.client.lastName }}
                  </p>
                  <p class="intervention-technician">{{ intervention.technicianName }}</p>
                  <p class="intervention-time">{{ formatTime(intervention.scheduledDate) }}</p>
                </div>
                <div class="intervention-status">
                  <span class="badge" [ngClass]="getInterventionBadgeClass(intervention.status)">
                    {{ intervention.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalClients: 0,
    totalClaims: 0,
    totalInterventions: 0,
    totalArticles: 0,
    urgentClaims: 0,
    expiringWarranties: 0,
    lowStockItems: 0
  };
  
  recentClaims: any[] = [];
  todayInterventions: any[] = [];
  isLoading = true;

  constructor(
    private clientService: ClientService,
    private claimService: ClaimService,
    private interventionService: InterventionService,
    private articleService: ArticleService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    forkJoin({
      clients: this.clientService.getClients(),
      claims: this.claimService.getClaims(),
      interventions: this.interventionService.getInterventions(),
      articles: this.articleService.getArticles()
    }).subscribe({
      next: (data) => {
        this.stats = {
          totalClients: data.clients.filter(c => c.isActive).length,
          totalClaims: data.claims.length,
          totalInterventions: data.interventions.length,
          totalArticles: data.articles.filter(a => a.isActive).length,
          urgentClaims: data.claims.filter(c => c.priority === 'Critical' || c.priority === 'High').length,
          expiringWarranties: 0, // À calculer selon la logique métier
          lowStockItems: data.articles.filter(a => a.stock <= (a.minimumStock || 5)).length
        };
        
        this.recentClaims = data.claims
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
          
        const today = new Date().toISOString().split('T')[0];
        this.todayInterventions = data.interventions.filter(i => 
          i.scheduledDate.startsWith(today)
        );
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  getClaimBadgeClass(status: string): string {
    switch (status) {
      case 'Resolved': return 'badge-success';
      case 'InProgress': return 'badge-warning';
      case 'Pending': return 'badge-info';
      case 'Closed': return 'badge-error';
      default: return 'badge-info';
    }
  }

  getInterventionBadgeClass(status: string): string {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'InProgress': return 'badge-warning';
      case 'Scheduled': return 'badge-info';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-info';
    }
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-success';
      default: return 'badge-info';
    }
  }

  getIssueTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'Defect': 'Défaut produit',
      'Malfunction': 'Dysfonctionnement',
      'Damage': 'Dommage',
      'Installation': 'Installation',
      'Other': 'Autre'
    };
    return labels[type] || type;
  }

  getInterventionTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'Repair': 'Réparation',
      'Maintenance': 'Maintenance',
      'Installation': 'Installation',
      'Diagnostic': 'Diagnostic',
      'Replacement': 'Remplacement'
    };
    return labels[type] || type;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}