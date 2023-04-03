import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'auth-validate-email',
  templateUrl: './validate-email.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthValidateEmailComponent implements OnInit {

    /**
     * Constructor
     */
     constructor(
      private _authService: AuthService,
      private _route: ActivatedRoute,
      private _router: Router
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
    }


    /**
     * Resend activation code
     */
     resendActivationCode() {
      const email = this._route.snapshot.queryParamMap.get('email');
      const resendAccountActivationCodeRequest: { email: string; } = { email };

      this._authService.resendActivationCode(resendAccountActivationCodeRequest)
          .subscribe(
              (response) => {
                  console.log(response)

                  if (response.sent) {

                      // Navigate to the confirmation required page
                      this._router.navigateByUrl('/confirmation-required');
                  } else {
                    }
              }
          );
  }
}
