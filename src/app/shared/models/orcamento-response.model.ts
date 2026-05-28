import { OrcamentoItemResponse } from './orcamento-item-response.model';

export interface OrcamentoResponse {
  id: string;
  clienteId: number;
  veiculoId: number;
  itens: OrcamentoItemResponse[];
  valorTotal: number;
  status: string;
  dataCriacao: string;
}
