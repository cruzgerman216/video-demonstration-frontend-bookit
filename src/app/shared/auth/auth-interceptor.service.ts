import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.currUser.pipe(
      take(1),
      exhaustMap((user) => {
        // Make sure we have a user
        if (!user || req.url.includes("http://openlibrary.org/search.json?q=")) return next.handle(req);

        // Modify the reqest to attach the access token
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: "Bearer " + user.token
          }
        })
        // Return the modified request
        return next.handle(modifiedReq);
      })
    );
  }
}
