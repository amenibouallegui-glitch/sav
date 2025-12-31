import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article, CreateArticleRequest } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = 'http://localhost:5003/api/articles'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.baseUrl);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.baseUrl}/${id}`);
  }

  createArticle(article: CreateArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.baseUrl, article);
  }

  updateArticle(id: string, article: Partial<Article>): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, article);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}