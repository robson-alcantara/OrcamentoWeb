import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrcamentoService } from '../../core/services/orcamento.service';
import { OrcamentoResponse } from '../../shared/models/orcamento-response.model';

@Component({
  selector: 'app-listagem-orcamentos',
  templateUrl: './listagem-orcamentos.component.html',
  styleUrls: ['./listagem-orcamentos.component.css']
})
export class ListagemOrcamentosComponent implements OnInit {
  carregando = false;
  erro = '';
  orcamentos: OrcamentoResponse[] = [];

  constructor(
    private readonly router: Router,
    private readonly orcamentoService: OrcamentoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.erro = '';
    this.carregando = true;
    this.orcamentoService.getOrcamentos().subscribe({
      next: (items) => {
        this.orcamentos = items || [];
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar orçamentos.';
        this.carregando = false;
      }
    });
  }

  iniciarEdicao(o: OrcamentoResponse): void {
    this.erro = '';
    this.router.navigate(['/'], { state: { orcamento: o } });
  }

  visualizar(o: OrcamentoResponse): void {
    this.erro = '';
    this.router.navigate(['/'], { state: { orcamento: o, visualizando: true } });
  }

  remover(o: OrcamentoResponse): void {
    if (!window.confirm(`Deseja remover o orçamento ${o.id}?`)) {
      return;
    }

    this.erro = '';
    this.orcamentoService.removerOrcamento(o.id).subscribe({
      next: () => {
        this.carregar();
      },
      error: () => {
        this.erro = 'Não foi possível remover o orçamento.';
      }
    });
  }
}
