import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrcamentoService } from '../../core/services/orcamento.service';
import { OrcamentoRequest } from '../../shared/models/orcamento-request.model';
import { OrcamentoResponse } from '../../shared/models/orcamento-response.model';

@Component({
  selector: 'app-criacao-orcamento',
  templateUrl: './manter-orcamento.component.html',
  styleUrls: ['./manter-orcamento.component.css']
})
export class CriacaoOrcamentoComponent implements OnInit {
  salvando = false;
  mensagemSucesso = '';
  mensagemErro = '';
  resposta?: OrcamentoResponse;
  editando = false;
  orcamentoId?: string;

  form = this.fb.group({
    clienteId: [null, [Validators.required, Validators.min(1)]],
    veiculoId: [null, [Validators.required, Validators.min(1)]],
    itens: this.fb.array([this.criarItemForm()])
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly orcamentoService: OrcamentoService
  ) {}

  ngOnInit(): void {
    this.resetarFormulario();

    const estado = this.router.getCurrentNavigation()?.extras.state as { orcamento?: OrcamentoResponse } | undefined;
    const orcamento = estado?.orcamento ?? (window.history.state as { orcamento?: OrcamentoResponse }).orcamento;

    if (orcamento) {
      this.carregarParaEdicao(orcamento);
    }
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  adicionarItem(): void {
    this.itens.push(this.criarItemForm());
  }

  removerItem(index: number): void {
    if (this.itens.length === 1) {
      return;
    }
    this.itens.removeAt(index);
  }

  cancelarEdicao(): void {
    this.editando = false;
    this.orcamentoId = undefined;
    this.resetarFormulario();
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.resposta = undefined;
  }

  enviar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.resposta = undefined;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensagemErro = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    const payloadAtualizacao = this.form.value as OrcamentoRequest;
    this.salvando = true;

    const operacao = this.editando && this.orcamentoId
      ? this.orcamentoService.updateOrcamento(this.orcamentoId, payloadAtualizacao)
      : this.orcamentoService.criarOrcamento(payloadAtualizacao);

    operacao.subscribe({
      next: (response) => {
        this.mensagemSucesso = this.editando
          ? 'Orçamento atualizado com sucesso.'
          : 'Orçamento cadastrado com sucesso.';
        this.salvando = false;

        if (this.editando && this.orcamentoId) {
          this.resposta = response;
          this.carregarParaEdicao(response);
          console.log('Resposta da atualização:', response);
          return;
        }

        this.editando = false;
        this.orcamentoId = undefined;
        this.resetarFormulario();
        this.resposta = response;
      },
      error: (error: HttpErrorResponse) => {
        this.salvando = false;
        this.mensagemErro = this.editando
          ? this.extrairMensagemErro(error, 'atualizar o orçamento')
          : this.extrairMensagemErro(error, 'cadastrar o orçamento');
      }
    });
  }

  calcularTotalFormulario(): number {
    return this.itens.controls.reduce((total, control) => {
      const quantidade = Number(control.get('quantidade')?.value || 0);
      const valorUnitario = Number(control.get('valorUnitario')?.value || 0);
      return total + quantidade * valorUnitario;
    }, 0);
  }

  private carregarParaEdicao(orcamento: OrcamentoResponse): void {
    this.editando = true;
    this.orcamentoId = orcamento.id;
    this.form.reset({
      clienteId: orcamento.clienteId,
      veiculoId: orcamento.veiculoId,
      itens: []
    });

    this.itens.clear();

    if (orcamento.itens?.length) {
      orcamento.itens.forEach((item) => {
        this.itens.push(this.fb.group({
          id: [item.id],
          descricao: [item.descricao, [Validators.required]],
          quantidade: [item.quantidade, [Validators.required, Validators.min(1)]],
          valorUnitario: [item.valorUnitario, [Validators.required, Validators.min(0.01)]]
        }));
      });
      return;
    }

    this.itens.push(this.criarItemForm());
  }

  private resetarFormulario(): void {
    this.form.reset({
      clienteId: null,
      veiculoId: null,
      itens: []
    });

    this.itens.clear();
    this.itens.push(this.criarItemForm());
  }

  private criarItemForm(): FormGroup {
    return this.fb.group({
      id: [null],
      descricao: ['', [Validators.required]],
      quantidade: [1, [Validators.required, Validators.min(1)]],
      valorUnitario: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  private extrairMensagemErro(error: HttpErrorResponse, acao: string): string {
    const errors = error?.error?.errors;
    if (!errors) {
      return `Não foi possível ${acao}.`;
    }

    const mensagens = Object.keys(errors)
      .map((key) => `${key}: ${errors[key].join(', ')}`)
      .join(' | ');

    return mensagens || `Dados inválidos para ${acao}.`;
  }
}
