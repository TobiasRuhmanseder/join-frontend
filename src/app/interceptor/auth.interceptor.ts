import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // If we have a token, we set it to the header
    request = request.clone({
      setHeaders: { Authorization: `Token ${token}` }
    });
  }

  return next(request).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // Handle HTTP errors
        if (err.status === 401) {
          router.navigateByUrl('/login');
        } else {
          // Handle other HTTP error codes
          console.error('HTTP error:', err);
        }
      } else {
        // Handle non-HTTP errors
        console.error('An error occurred:', err);
      }
      // Re-throw the error to propagate it further
      return throwError(() => err);
    })
  );
};
