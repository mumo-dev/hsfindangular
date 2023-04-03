import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
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
        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        const passwordResetCode = this._route.snapshot.queryParamMap.get('code');
        const email = this._route.snapshot.queryParamMap.get('email');
        const password = this.resetPasswordForm.get('password').value;
        const resetPasswordRequest: { email: string; passwordResetCode: string; password: string } = { email, passwordResetCode, password };

        this._authService.resetPassword(resetPasswordRequest)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {

                    if (response.activated) {
                        
                        this.alert = {
                            type   : 'success',
                            message: 'Your password has been reset.'
                        };

                        this._router.navigateByUrl('/sign-in');
                    } 
                    else {

                        // Set the alert
                        this.alert = {
                            type   : 'error',
                            message: response.message
                        };

                        if (response.message === 'Password verification code has expired') {
                            const forgotPasswordRequest: { email: string } = { email };
                            
                            this._authService.forgotPassword(forgotPasswordRequest)
                            .subscribe(
                                (response) => {
                
                                    if (response.success) {
                                        
                                        this.alert = {
                                            type   : 'success',
                                            message: 'Your password reset token had expired! Check your email you\'ll receive instructions on how to reset your password.'
                                        };
                                    } else {
                
                                        this.alert = {
                                            type   : 'error',
                                            message: 'Email not found! Are you sure you are already a member?'
                                        };
                                    }
                                }
                            );
                          }
                    }
                }
            );
    }
}
