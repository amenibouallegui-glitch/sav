import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Claim, CreateClaimRequest } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl = 'http://localhost:5001/api/claims'; // Adjust to your API URL

  constructor(private http: HttpClient) {}

  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(this.baseUrl);
  }

  getClaimsByClient(clientId: string): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.baseUrl}/client/${clientId}`);
  }

  getClaim(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${this.baseUrl}/${id}`);
  }

  createClaim(claim: CreateClaimRequest): Observable<Claim> {
    return this.http.post<Claim>(this.baseUrl, claim);
  }

  updateClaim(id: string, claim: Partial<Claim>): Observable<Claim> {
    return this.http.put<Claim>(`${this.baseUrl}/${id}`, claim);
  }

  deleteClaim(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}