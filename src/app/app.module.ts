import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListagemOrcamentosComponent } from './pages/listagem-orcamentos/listagem-orcamentos.component';
import { CriacaoOrcamentoComponent } from './pages/manter-orcamento/manter-orcamento.component';

@NgModule({
  declarations: [
    AppComponent,
    ListagemOrcamentosComponent,
    CriacaoOrcamentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
