import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../../services/claim.service';
import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claims',
  template: `
    <div class="claims-page fadeIn">
      <div class="page-header">
        <div>
          <h1>Réclamations SAV</h1>
          <p>Gérer les réclamations et demandes de service après-vente</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          Nouvelle réclamation
        </button>
      </div>
      
      <!-- Create/Edit Form -->
      <div class="card" *ngIf="showCreateForm || selectedClaim">
        <div class="card-header">
          <h3>{{ selectedClaim ? 'Modifier la réclamation' : 'Nouvelle réclamation' }}</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #claimForm="ngForm">
            <div class="grid grid-cols-2">
              <div class="form-group">
                <label for="title">Titre</label>
                <input 
                  id="title"
                  type="text" 
                  [(ngModel)]="formData.title"
                  name="title"
                  required
                  placeholder="Titre de la réclamation"
                >
              </div>
              
              <div class="form-group">
                <label for="issueType">Type de problème</label>
                <select 
                  id="issueType"
                  [(ngModel)]="formData.issueType"
                  name="issueType"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Defect">Défaut produit</option>
                  <option value="Malfunction">Dysfonctionnement</option>
                  <option value="Damage">Dommage</option>
                  <option value="Installation">Installation</option>
                  <option value="Other">Autre</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="priority">Priorité</label>
                <select 
                  id="priority"
                  [(ngModel)]="formData.priority"
                  name="priority"
                  required
                >
                  <option value="">Sélectionner une priorité</option>
                  <option value="Low">Faible</option>
                  <option value="Medium">Moyenne</option>
                  <option value="High">Élevée</option>
                  <option value="Critical">Critique</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="clientId">Client</label>
                <select 
                  id="clientId"
                  [(ngModel)]="formData.clientId"
                  name="clientId"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  <!-- Options will be populated from clients list -->
                </select>
              </div>
              
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="description">Description</label>
                <textarea 
                  id="description"
                  [(ngModel)]="formData.description"
                  name="description"
                  required
                  placeholder="Description détaillée du problème"
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!claimForm.form.valid || isLoading">
                {{ isLoading ? 'Enregistrement...' : (selectedClaim ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Claims Table -->
      <div class="card" *ngIf="!showCreateForm && !selectedClaim">
        <div class="card-header">
          <h3>Liste des réclamations ({{ claims.length }})</h3>
        </div>
        <div class="card-body">
          <div *ngIf="isLoading" class="loading">
            <div class="spinner"></div>
          </div>
          
          <div *ngIf="!isLoading && claims.length === 0" class="empty-state">
            <p>Aucune réclamation enregistrée</p>
          </div>
          
          <table class="table" *ngIf="!isLoading && claims.length > 0">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Client</th>
                <th>Type</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th class="hidden-mobile">Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of claims">
                <td>
                  <div class="claim-info">
                    <p class="font-semibold">{{ claim.title }}</p>
                    <p class="text-sm">{{ claim.description | slice:0:50 }}...</p>
                  </div>
                </td>
                <td>
                  <span *ngIf="claim.client">{{ claim.client.firstName }} {{ claim.client.lastName }}</span>
                </td>
                <td>{{ getIssueTypeLabel(claim.issueType) }}</td>
                <td>
                  <span class="badge" [ngClass]="getPriorityBadgeClass(claim.priority)">
                    {{ claim.priority }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadgeClass(claim.status)">
                    {{ claim.status }}
                  </span>
                </td>
                <td class="hidden-mobile text-sm">{{ formatDate(claim.createdAt) }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" (click)="editClaim(claim)">
                      Modifier
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  selectedClaim: Claim | null = null;
  showCreateForm = false;
  isLoading = false;
  
  formData = {
    title: '',
    description: '',
    issueType: '',
    priority: '',
    clientId: ''
  };

  constructor(private claimService: ClaimService) {}

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.isLoading = true;
    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.selectedClaim) {
      this.updateClaim();
    } else {
      this.createClaim();
    }
  }

  createClaim() {
    this.isLoading = true;
    this.claimService.createClaim(this.formData).subscribe({
      next: (claim) => {
        this.claims.push(claim);
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating claim:', error);
        this.isLoading = false;
      }
    });
  }

  updateClaim() {
    if (!this.selectedClaim) return;
    
    this.isLoading = true;
    this.claimService.updateClaim(this.selectedClaim.id, this.formData).subscribe({
      next: (updatedClaim) => {
        const index = this.claims.findIndex(c => c.id === updatedClaim.id);
        if (index >= 0) {
          this.claims[index] = updatedClaim;
        }
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating claim:', error);
        this.isLoading = false;
      }
    });
  }

  editClaim(claim: Claim) {
    this.selectedClaim = claim;
    this.formData = {
      title: claim.title,
      description: claim.description,
      issueType: claim.issueType,
      priority: claim.priority,
      clientId: claim.clientId
    };
  }

  cancelForm() {
    this.resetForm();
  }

  resetForm() {
    this.showCreateForm = false;
    this.selectedClaim = null;
    this.formData = {
      title: '',
      description: '',
      issueType: '',
      priority: '',
      clientId: ''
    };
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

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Critical': return 'badge-error';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-success';
      default: return 'badge-info';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Resolved': return 'badge-success';
      case 'InProgress': return 'badge-warning';
      case 'Pending': return 'badge-info';
      case 'Closed': return 'badge-error';
      default: return 'badge-info';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}