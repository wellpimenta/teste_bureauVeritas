import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosListaComponent } from './produtos-lista.component';
@NgModule({ 
    imports : [ 
        CommonModule 
    ],
     declarations : [
        ProdutosListaComponent
     ],
     exports : [ ProdutosListaComponent]
})
export class ProdutosModule {}
