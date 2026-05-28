import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListagemOrcamentosComponent } from './pages/listagem-orcamentos/listagem-orcamentos.component';
import { CriacaoOrcamentoComponent } from './pages/manter-orcamento/manter-orcamento.component';

const routes: Routes = [
  { path: '', component: CriacaoOrcamentoComponent },
  { path: 'orcamentos', component: ListagemOrcamentosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
