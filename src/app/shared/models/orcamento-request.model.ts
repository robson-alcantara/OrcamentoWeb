import { OrcamentoItemRequest } from './orcamento-item-request.model';

export interface OrcamentoRequest {
  clienteId: number;
  veiculoId: number;
  itens: OrcamentoItemRequest[];
}
