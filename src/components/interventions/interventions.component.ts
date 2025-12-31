import { Component, OnInit } from '@angular/core';
import { InterventionService } from '../../services/intervention.service';
import { Intervention } from '../../models/intervention.model';

@Component({
  selector: 'app-interventions',
  template: `
    <div class="interventions-page fadeIn">
      <div class="page-header">
        <div>
          <h1>Interventions techniques</h1>
          <p>Planifier et gérer les interventions SAV</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          Nouvelle intervention
        </button>
      </div>
      
      <!-- Create/Edit Form -->
      <div class="card" *ngIf="showCreateForm || selectedIntervention">
        <div class="card-header">
          <h3>{{ selectedIntervention ? 'Modifier l\'intervention' : 'Nouvelle intervention' }}</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #interventionForm="ngForm">
            <div class="grid grid-cols-2">
              <div class="form-group">
                <label for="title">Titre</label>
                <input 
                  id="title"
                  type="text" 
                  [(ngModel)]="formData.title"
                  name="title"
                  required
                  placeholder="Titre de l'intervention"
                >
              </div>
              
              <div class="form-group">
                <label for="interventionType">Type d'intervention</label>
                <select 
                  id="interventionType"
                  [(ngModel)]="formData.interventionType"
                  name="interventionType"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Repair">Réparation</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Installation">Installation</option>
                  <option value="Diagnostic">Diagnostic</option>
                  <option value="Replacement">Remplacement</option>
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
              
              <div class="form-group">
                <label for="technicianName">Technicien</label>
                <input 
                  id="technicianName"
                  type="text" 
                  [(ngModel)]="formData.technicianName"
                  name="technicianName"
                  required
                  placeholder="Nom du technicien"
                >
              </div>
              
              <div class="form-group">
                <label for="scheduledDate">Date programmée</label>
                <input 
                  id="scheduledDate"
                  type="datetime-local" 
                  [(ngModel)]="formData.scheduledDate"
                  name="scheduledDate"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="estimatedDuration">Durée estimée (minutes)</label>
                <input 
                  id="estimatedDuration"
                  type="number" 
                  [(ngModel)]="formData.estimatedDuration"
                  name="estimatedDuration"
                  required
                  placeholder="120"
                  min="15"
                  step="15"
                >
              </div>
              
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="description">Description</label>
                <textarea 
                  id="description"
                  [(ngModel)]="formData.description"
                  name="description"
                  required
                  placeholder="Description de l'intervention à effectuer"
                  rows="4"
                ></textarea>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!interventionForm.form.valid || isLoading">
                {{ isLoading ? 'Enregistrement...' : (selectedIntervention ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Interventions Table -->
      <div class="card" *ngIf="!showCreateForm && !selectedIntervention">
        <div class="card-header">
          <h3>Liste des interventions ({{ interventions.length }})</h3>
        </div>
        <div class="card-body">
          <div *ngIf="isLoading" class="loading">
            <div class="spinner"></div>
          </div>
          
          <div *ngIf="!isLoading && interventions.length === 0" class="empty-state">
            <p>Aucune intervention programmée</p>
          </div>
          
          <table class="table" *ngIf="!isLoading && interventions.length > 0">
            <thead>
              <tr>
                <th>Intervention</th>
                <th>Client</th>
                <th>Type</th>
                <th>Technicien</th>
                <th>Date programmée</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let intervention of interventions">
                <td>
                  <div class="intervention-info">
                    <p class="font-semibold">{{ intervention.title }}</p>
                    <p class="text-sm">{{ intervention.description | slice:0:50 }}...</p>
                  </div>
                </td>
                <td>
                  <span *ngIf="intervention.client">{{ intervention.client.firstName }} {{ intervention.client.lastName }}</span>
                </td>
                <td>{{ getInterventionTypeLabel(intervention.interventionType) }}</td>
                <td>{{ intervention.technicianName }}</td>
                <td class="text-sm">{{ formatDateTime(intervention.scheduledDate) }}</td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadgeClass(intervention.status)">
                    {{ getStatusLabel(intervention.status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" (click)="editIntervention(intervention)">
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
  styleUrls: ['./interventions.component.scss']
})
export class InterventionsComponent implements OnInit {
  interventions: Intervention[] = [];
  selectedIntervention: Intervention | null = null;
  showCreateForm = false;
  isLoading = false;
  
  formData = {
    title: '',
    description: '',
    interventionType: '',
    clientId: '',
    technicianName: '',
    technicianId: '',
    scheduledDate: '',
    estimatedDuration: 120
  };

  constructor(private interventionService: InterventionService) {}

  ngOnInit() {
    this.loadInterventions();
  }

  loadInterventions() {
    this.isLoading = true;
    this.interventionService.getInterventions().subscribe({
      next: (interventions) => {
        this.interventions = interventions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading interventions:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.selectedIntervention) {
      this.updateIntervention();
    } else {
      this.createIntervention();
    }
  }

  createIntervention() {
    this.isLoading = true;
    const interventionData = {
      ...this.formData,
      technicianId: 'tech-' + Date.now() // Generate a temporary ID
    };
    
    this.interventionService.createIntervention(interventionData).subscribe({
      next: (intervention) => {
        this.interventions.push(intervention);
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating intervention:', error);
        this.isLoading = false;
      }
    });
  }

  updateIntervention() {
    if (!this.selectedIntervention) return;
    
    this.isLoading = true;
    this.interventionService.updateIntervention(this.selectedIntervention.id, this.formData).subscribe({
      next: (updatedIntervention) => {
        const index = this.interventions.findIndex(i => i.id === updatedIntervention.id);
        if (index >= 0) {
          this.interventions[index] = updatedIntervention;
        }
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating intervention:', error);
        this.isLoading = false;
      }
    });
  }

  editIntervention(intervention: Intervention) {
    this.selectedIntervention = intervention;
    this.formData = {
      title: intervention.title,
      description: intervention.description,
      interventionType: intervention.interventionType,
      clientId: intervention.clientId,
      technicianName: intervention.technicianName,
      technicianId: intervention.technicianId,
      scheduledDate: intervention.scheduledDate,
      estimatedDuration: intervention.estimatedDuration
    };
  }

  cancelForm() {
    this.resetForm();
  }

  resetForm() {
    this.showCreateForm = false;
    this.selectedIntervention = null;
    this.formData = {
      title: '',
      description: '',
      interventionType: '',
      clientId: '',
      technicianName: '',
      technicianId: '',
      scheduledDate: '',
      estimatedDuration: 120
    };
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

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'Scheduled': 'Programmée',
      'InProgress': 'En cours',
      'Completed': 'Terminée',
      'Cancelled': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'InProgress': return 'badge-warning';
      case 'Scheduled': return 'badge-info';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-info';
    }
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}