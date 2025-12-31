import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervention, CreateInterventionRequest } from '../models/intervention.model';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {
  private baseUrl = 'http://localhost:5002/api/interventions'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  getInterventions(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(this.baseUrl);
  }

  getIntervention(id: string): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.baseUrl}/${id}`);
  }

  createIntervention(intervention: CreateInterventionRequest): Observable<Intervention> {
    return this.http.post<Intervention>(this.baseUrl, intervention);
  }

  updateIntervention(id: string, intervention: Partial<Intervention>): Observable<Intervention> {
    return this.http.put<Intervention>(`${this.baseUrl}/${id}`, intervention);
  }

  deleteIntervention(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}