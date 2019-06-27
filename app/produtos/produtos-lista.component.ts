import {Component} from '@angular/core';
import {PRODUTOS} from './produto.mock';
import {Produto} from './produto.model';

import { TestService } from './test.service';
import { AuthService } from './auth.service';

@Component({
    moduleId: module.id,
    selector : 'produtos-lista',
    templateUrl: 'produtos-lista.component.html'
})
export class ProdutosListaComponent {
    produtos: Produto[] = PRODUTOS;

    message: string;

  constructor(private testService: TestService,
              private authService: AuthService) { }

  test401() {
    this.testService.getData()
      .subscribe((response: any) => {
        this.message = `Worked with status = ${response.status}`;
      },
      error => this.message = `Failed with status = ${error.status}`);
  }

  test401Multiple() {
    let dataObservable$ = this.testService.getData();
    let lookupObservable$ = this.testService.getLookup();

  }
}
