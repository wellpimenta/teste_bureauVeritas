import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { tstWellington } from './app.component';
import { ProdutosModule } from './produtos/produtos.module'
import { TestService } from "./produtos/test.service";
import { AuthService } from './produtos/auth.service';
import { RequestInterceptorService } from './produtos/request-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';


@NgModule({
    declarations: [
        tstWellington
      ],
      imports: [
        ProdutosModule,
        BrowserModule
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptorService, multi: true },
        TestService,
        AuthService,
        HttpClient
      ],
      bootstrap: [tstWellington]
})
export class AppModule {}

