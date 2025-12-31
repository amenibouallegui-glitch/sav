import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-articles',
  template: `
    <div class="articles-page fadeIn">
      <div class="page-header">
        <div>
          <h1>Pièces détachées</h1>
          <p>Gérer le stock des pièces détachées et articles SAV</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          Nouvel article
        </button>
      </div>
      
      <!-- Create/Edit Form -->
      <div class="card" *ngIf="showCreateForm || selectedArticle">
        <div class="card-header">
          <h3>{{ selectedArticle ? 'Modifier l\'article' : 'Nouvel article' }}</h3>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #articleForm="ngForm">
            <div class="grid grid-cols-2">
              <div class="form-group">
                <label for="name">Nom de l'article</label>
                <input 
                  id="name"
                  type="text" 
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  placeholder="Nom de la pièce détachée"
                >
              </div>
              
              <div class="form-group">
                <label for="partNumber">Référence</label>
                <input 
                  id="partNumber"
                  type="text" 
                  [(ngModel)]="formData.partNumber"
                  name="partNumber"
                  required
                  placeholder="REF-12345"
                >
              </div>
              
              <div class="form-group">
                <label for="brand">Marque</label>
                <input 
                  id="brand"
                  type="text" 
                  [(ngModel)]="formData.brand"
                  name="brand"
                  required
                  placeholder="Marque du fabricant"
                >
              </div>
              
              <div class="form-group">
                <label for="category">Catégorie</label>
                <select 
                  id="category"
                  [(ngModel)]="formData.category"
                  name="category"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="Moteur">Moteur</option>
                  <option value="Électronique">Électronique</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Filtres">Filtres</option>
                  <option value="Accessoires">Accessoires</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="price">Prix (€)</label>
                <input 
                  id="price"
                  type="number" 
                  [(ngModel)]="formData.price"
                  name="price"
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                >
              </div>
              
              <div class="form-group">
                <label for="stock">Stock actuel</label>
                <input 
                  id="stock"
                  type="number" 
                  [(ngModel)]="formData.stock"
                  name="stock"
                  required
                  placeholder="0"
                  min="0"
                >
              </div>
              
              <div class="form-group">
                <label for="minimumStock">Stock minimum</label>
                <input 
                  id="minimumStock"
                  type="number" 
                  [(ngModel)]="formData.minimumStock"
                  name="minimumStock"
                  required
                  placeholder="5"
                  min="0"
                >
              </div>
              
              <div class="form-group">
                <label for="supplier">Fournisseur</label>
                <input 
                  id="supplier"
                  type="text" 
                  [(ngModel)]="formData.supplier"
                  name="supplier"
                  required
                  placeholder="Nom du fournisseur"
                >
              </div>
              
              <div class="form-group">
                <label for="location">Emplacement</label>
                <input 
                  id="location"
                  type="text" 
                  [(ngModel)]="formData.location"
                  name="location"
                  required
                  placeholder="A1-B2-C3"
                >
              </div>
              
              <div class="form-group" style="grid-column: 1 / -1;">
                <label for="description">Description</label>
                <textarea 
                  id="description"
                  [(ngModel)]="formData.description"
                  name="description"
                  required
                  placeholder="Description détaillée de l'article"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="cancelForm()">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="!articleForm.form.valid || isLoading">
                {{ isLoading ? 'Enregistrement...' : (selectedArticle ? 'Modifier' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Articles Table -->
      <div class="card" *ngIf="!showCreateForm && !selectedArticle">
        <div class="card-header">
          <h3>Stock des articles ({{ articles.length }})</h3>
        </div>
        <div class="card-body">
          <div *ngIf="isLoading" class="loading">
            <div class="spinner"></div>
          </div>
          
          <div *ngIf="!isLoading && articles.length === 0" class="empty-state">
            <p>Aucun article en stock</p>
          </div>
          
          <table class="table" *ngIf="!isLoading && articles.length > 0">
            <thead>
              <tr>
                <th>Article</th>
                <th>Référence</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Emplacement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let article of articles">
                <td>
                  <div class="article-info">
                    <p class="font-semibold">{{ article.name }}</p>
                    <p class="text-sm">{{ article.brand }}</p>
                  </div>
                </td>
                <td class="font-mono text-sm">{{ article.partNumber }}</td>
                <td>{{ article.category }}</td>
                <td>{{ article.price | currency:'EUR':'symbol':'1.2-2':'fr' }}</td>
                <td>
                  <div class="stock-info">
                    <span [ngClass]="getStockClass(article)">{{ article.stock }}</span>
                    <span class="text-xs text-gray-500">/ {{ article.minimumStock }} min</span>
                  </div>
                </td>
                <td class="font-mono text-sm">{{ article.location }}</td>
                <td>
                  <span class="badge" [ngClass]="getStockBadgeClass(article)">
                    {{ getStockStatus(article) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-secondary btn-sm" (click)="editArticle(article)">
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
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  selectedArticle: Article | null = null;
  showCreateForm = false;
  isLoading = false;
  
  formData = {
    name: '',
    description: '',
    partNumber: '',
    brand: '',
    category: '',
    compatibleProducts: [],
    price: 0,
    stock: 0,
    minimumStock: 5,
    supplier: '',
    location: ''
  };

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.isLoading = true;
    this.articleService.getArticles().subscribe({
      next: (articles) => {
        this.articles = articles;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.selectedArticle) {
      this.updateArticle();
    } else {
      this.createArticle();
    }
  }

  createArticle() {
    this.isLoading = true;
    this.articleService.createArticle(this.formData).subscribe({
      next: (article) => {
        this.articles.push(article);
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating article:', error);
        this.isLoading = false;
      }
    });
  }

  updateArticle() {
    if (!this.selectedArticle) return;
    
    this.isLoading = true;
    this.articleService.updateArticle(this.selectedArticle.id, this.formData).subscribe({
      next: (updatedArticle) => {
        const index = this.articles.findIndex(a => a.id === updatedArticle.id);
        if (index >= 0) {
          this.articles[index] = updatedArticle;
        }
        this.resetForm();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating article:', error);
        this.isLoading = false;
      }
    });
  }

  editArticle(article: Article) {
    this.selectedArticle = article;
    this.formData = {
      name: article.name,
      description: article.description,
      partNumber: article.partNumber,
      brand: article.brand,
      category: article.category,
      compatibleProducts: article.compatibleProducts,
      price: article.price,
      stock: article.stock,
      minimumStock: article.minimumStock,
      supplier: article.supplier,
      location: article.location
    };
  }

  cancelForm() {
    this.resetForm();
  }

  resetForm() {
    this.showCreateForm = false;
    this.selectedArticle = null;
    this.formData = {
      name: '',
      description: '',
      partNumber: '',
      brand: '',
      category: '',
      compatibleProducts: [],
      price: 0,
      stock: 0,
      minimumStock: 5,
      supplier: '',
      location: ''
    };
  }

  getStockClass(article: Article): string {
    if (article.stock <= article.minimumStock) {
      return 'text-red-600 font-semibold';
    } else if (article.stock <= article.minimumStock * 2) {
      return 'text-yellow-600 font-semibold';
    }
    return 'text-green-600 font-semibold';
  }

  getStockBadgeClass(article: Article): string {
    if (article.stock <= article.minimumStock) {
      return 'badge-error';
    } else if (article.stock <= article.minimumStock * 2) {
      return 'badge-warning';
    }
    return 'badge-success';
  }

  getStockStatus(article: Article): string {
    if (article.stock <= article.minimumStock) {
      return 'Stock faible';
    } else if (article.stock <= article.minimumStock * 2) {
      return 'Stock moyen';
    }
    return 'En stock';
  }
}