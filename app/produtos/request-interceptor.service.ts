
import {throwError as observableThrowError,  Observable ,  BehaviorSubject } from 'rxjs';

import {take, filter, catchError, switchMap, finalize} from 'rxjs/operators';
import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse } from "@angular/common/http";

import { AuthService } from "./auth.service";

@Injectable()
export class RequestInterceptorService implements HttpInterceptor {

    isRefreshingToken: boolean = false;
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(private injector: Injector) {}

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }})
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        const authService = this.injector.get(AuthService);

        return next.handle(this.addToken(req, authService.getAuthToken())).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 400:
                            return this.handle400Error(error);
                        case 401:
                            return this.handle401Error(req, next);
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    handle400Error(error) {
        if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
            return this.logoutUser();
        }

        return observableThrowError(error);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject.next(null);

            const authService = this.injector.get(AuthService);
            
            return authService.refreshToken().pipe(
                switchMap((newToken: string) => {
                    if (newToken) {
                        this.tokenSubject.next(newToken);
                        return next.handle(this.addToken(this.getNewRequest(req), newToken));
                    }

                    return this.logoutUser();
                }),
                catchError(error => {
                    return this.logoutUser();
                }),
                finalize(() => {
                    this.isRefreshingToken = false;
                }),);
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(this.getNewRequest(req), token));
                }),);
        }
    }

    getNewRequest(req: HttpRequest<any>): HttpRequest<any> {
        if (req.url.indexOf('getData') > 0) {
            return new HttpRequest('GET', 'http://private-4002d-testerrorresponses.apiary-mock.com/getData');
        }

        return new HttpRequest('GET', 'http://private-4002d-testerrorresponses.apiary-mock.com/getLookup');
    }

    logoutUser() {
        return observableThrowError("");
    }
}
