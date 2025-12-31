import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clients',
  template: `
    <div class="clients-page fadeIn">
      <div class="page-header">
        <div>
          <h1>Gestion des clients</h1>
          <p>Gérer les informations de vos clients</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          Nouveau client
        </button>
      </div>
      
      <!-- Create/Edit Form -->
      <div class="card" *ngIf="showCreateForm || selectedClient">
        <div class="card-header">
          <h3>{{ selectedClient ? 'Modifier le client' : 'Nouveau client' }}</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #clientForm="ngForm">
            <div class="grid grid-cols-2">
              <div class="form-group">
                <label for="firstName">Prénom</label>
                <input 
                  id="firstName"
                  type="text" 
                  [(ngModel)]="formData.firstName"
                  name="firstName"
                  required
                  placeholder="Prénom du client"
                >
              </div>
              
              <div class="form-group">
                <label for="lastName">Nom</label>
                <input 
                  id="lastName"
                  type="text" 
                  [(ngModel)]="formData.lastName"
                  name="lastName"
                  required
                  placeholder="Nom du client"
                >
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  id="email"
                  type="email" 
                  [(ngModel)]="formData.email"
                  name="email"
                  required
                  placeholder="email@exemple.com"
                >
              </div>
              
              <div class="form-group">
                <label for="phone">Téléphone</label>
                <input 
                  id="phone"
                  type="tel" 
                  [(ngModel)]="formData.phone"
                  name="phone"
                  required
                  placeholder="+33 1 23 45 67 89"
                >
              </div>
              
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="address">Adresse</label>
                <input 
                  id="address"
                  type="text" 
                  [(ngModel)]="formData.address"
                  name="address"
                  required
                  placeholder="Adresse complète"
                >
              </div>
              
              <div class="form-group">
                <label for="city">Ville</label>
                <input 
                  id="city"
                  type="text" 
                  [(ngModel)]="formData.city"
                  name="city"
                  required
                  placeholder="Ville"
                >
              </div>
              
              <div class="form-group">
                <label for="postalCode">Code postal</label>
                <input 
                  id="postalCode"
                  type="text" 
                  [(ngModel)]="formData.postalCode"
                  name="postalCode"
                  required
                  placeholder="75000"
                >
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!clientForm.form.valid || isLoading">
                {{ isLoading ? 'Enregistrement...' : (selectedClient ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Clients Table -->
      <div class="card" *ngIf="!showCreateForm && !selectedClient">
        <div class="card-header">
          <h3>Liste des clients ({{ clients.length }})</h3>
        </div>
        <div class="card-body">
          <div *ngIf="isLoading" class="loading">
            <div class="spinner"></div>
          </div>
          
          <div *ngIf="!isLoading && clients.length === 0" class="empty-state">
            <p>Aucun client enregistré</p>
          </div>
          
          <table class="table" *ngIf="!isLoading && clients.length > 0">
            <thead>
              <tr>
                <th>Client</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Ville</th>
                <th class="hidden-mobile">Créé le</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let client of clients">
                <td>
                  <div class="client-info">
                    <div class="client-avatar">{{ client.firstName[0] }}{{ client.lastName[0] }}</div>
                    <div>
                      <p class="font-semibold">{{ client.firstName }} {{ client.lastName }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ client.email }}</td>
                <td>{{ client.phone }}</td>
                <td>{{ client.city }}</td>
                <td class="hidden-mobile text-sm">{{ formatDate(client.createdAt) }}</td>
                <td>
                  <span class="badge" [ngClass]="client.isActive ? 'badge-success' : 'badge-error'">
                    {{ client.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" (click)="editClient(client)">
                      Modifier
                    </button>
                    <button class="btn btn-secondary btn-sm" (click)="toggleClientStatus(client)">
                      {{ client.isActive ? 'Désactiver' : 'Activer' }}
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
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  selectedClient: Client | null = null;
  showCreateForm = false;
  isLoading = false;
  
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  };

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.clientService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.selectedClient) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

  createClient() {
    this.isLoading = true;
    this.clientService.createClient(this.formData).subscribe({
      next: (client) => {
        this.clients.push(client);
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating client:', error);
        this.isLoading = false;
      }
    });
  }

  updateClient() {
    if (!this.selectedClient) return;
    
    this.isLoading = true;
    this.clientService.updateClient(this.selectedClient.id, this.formData).subscribe({
      next: (updatedClient) => {
        const index = this.clients.findIndex(c => c.id === updatedClient.id);
        if (index >= 0) {
          this.clients[index] = updatedClient;
        }
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating client:', error);
        this.isLoading = false;
      }
    });
  }

  editClient(client: Client) {
    this.selectedClient = client;
    this.formData = {
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      city: client.city,
      postalCode: client.postalCode
    };
  }

  toggleClientStatus(client: Client) {
    this.clientService.updateClient(client.id, { isActive: !client.isActive }).subscribe({
      next: (updatedClient) => {
        const index = this.clients.findIndex(c => c.id === updatedClient.id);
        if (index >= 0) {
          this.clients[index] = updatedClient;
        }
      },
      error: (error) => {
        console.error('Error updating client status:', error);
      }
    });
  }

  cancelForm() {
    this.resetForm();
  }

  resetForm() {
    this.showCreateForm = false;
    this.selectedClient = null;
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: ''
    };
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }
}