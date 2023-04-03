import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-activate',
    templateUrl  : './activate.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthActivateComponent implements OnInit
{
    activated: boolean;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _route: ActivatedRoute
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.activateAccount();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Activate account
     */
     activateAccount() {
        const code = this._route.snapshot.queryParamMap.get('code');
        const email = this._route.snapshot.queryParamMap.get('email');
        const accountActivationRequest: { email: string; activationCode: string; } = { email, activationCode: code };

        // Activate
        this._authService.activate(accountActivationRequest)
            .subscribe(
                (response) => {

                    this.activated = response.activated;
                }
            );
    }
}
