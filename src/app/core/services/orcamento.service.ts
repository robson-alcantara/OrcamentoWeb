import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrcamentoRequest } from '../../shared/models/orcamento-request.model';
import { OrcamentoResponse } from '../../shared/models/orcamento-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrcamentoService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  criarOrcamento(payload: OrcamentoRequest): Observable<OrcamentoResponse> {
    return this.http.post<OrcamentoResponse>(`${this.baseUrl}/orcamentos`, payload);
  }

  getOrcamentos(): Observable<OrcamentoResponse[]> {
    return this.http.get<OrcamentoResponse[]>(`${this.baseUrl}/orcamentos`);
  }

  updateOrcamento(id: string, payload: OrcamentoRequest): Observable<OrcamentoResponse> {
    return this.http.put<OrcamentoResponse>(`${this.baseUrl}/orcamentos/${id}`, payload);
  }

  removerOrcamento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/orcamentos/${id}`);
  }
}
