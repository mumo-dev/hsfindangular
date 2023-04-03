import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { TOKEN_AUTH_PASSWORD, TOKEN_AUTH_USERNAME } from './auth-constants';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(forgotPasswordRequest: { email: string; }): Observable<any>
    {
        return this._httpClient.post('/api/v1/users/account/forgotpassword', forgotPasswordRequest);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(resetPasswordRequest : { email: string; passwordResetCode: string; password: string}): Observable<any>
    {
        return this._httpClient.post('/api/v1/users/account/resetpassword', resetPasswordRequest);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + btoa(TOKEN_AUTH_USERNAME + ':' + TOKEN_AUTH_PASSWORD)
            })
          };
          
        return this._httpClient.post('/api/v1/users/login', credentials, httpOptions).pipe(
            switchMap((response: any) => {
                
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                const user: User = { firstName: response.firstName,lastName: response.lastName,accountActivated: response.accountActivated,role:response.role,email:response.email};
                this._userService.update({
                    ...user
                }).subscribe();

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
    */
    signUp(user: { firstName: string; lastName: string; email: string; password: string; }): Observable<any>
    {
        return this._httpClient.post('/api/v1/users/landlord/register', user);
    }

     /**
      * Activate
      *
      * @param accountActivationRequest
    */
    activate(accountActivationRequest: { email: string; activationCode: string; }): Observable<any>
    {
        return this._httpClient.post('/api/v1/users/account/activate', accountActivationRequest);
    }

    /**
     * Resend activation code
     *
     * @param resendAccountActivationCodeRequest
    */
    resendActivationCode(resendAccountActivationCodeRequest: { email: string; }): Observable<any>
    {
        return this._httpClient.post('/api/v1/users/account/resendactivationcode', resendAccountActivationCodeRequest);
    }
  
    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
