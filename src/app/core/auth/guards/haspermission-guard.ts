import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { switchMap } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class HasPermissionGuard implements CanActivate {

    constructor(
      private _router: Router,
      private _authService: AuthService,
      private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can activate
     *
     * @param route
     * @param state
     */
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean
     {
         const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
         return this._check(redirectUrl, route);
     }
 
     /**
      * Can activate child
      *
      * @param childRoute
      * @param state
      */
     canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
     {
         const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
         return this._check(redirectUrl, childRoute);
     }

    /**
     * Check the authenticated status
     *
     * @param redirectURL
     * @private
     */
     private _check(redirectURL: string, route: ActivatedRouteSnapshot): Observable<boolean>
     {
         // Check the authentication status
         return this._authService.check()
          .pipe(
              switchMap((authenticated) => {

                  // If the user is not authenticated...
                  if ( !authenticated )
                  {
                      // Redirect to the sign-in page
                      this._router.navigate(['sign-in'], {queryParams: {redirectURL}});

                      // Prevent the access
                      return of(false);
                  }

                  // If the user has permission to access resource
                  this._userService.get().subscribe(user => { 

                    const authorities = user.role;
                    const needAuthorities = route.data.authorities as Array<string> ?? [];
            
                    for (const needAuthority of needAuthorities) {
                        if (!authorities.includes(needAuthority)) {
                          
                            // Redirect to the sign-in page
                            this._router.navigate(['sign-in'], 
                              { queryParams: { redirectTo: redirectURL, error: 'You do not have permission to access this resource.' }});
                              
                            // Prevent the access
                            return of(false);
                        }
                    }

                  });

                // Allow the access
                return of(true);
              })
          );
     }
}
