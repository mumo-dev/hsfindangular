import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { HasPermissionGuard } from './core/auth/guards/haspermission-guard';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    // {path: '', pathMatch : 'full', redirectTo: 'example'},

    {
        path       : '',
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: '', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
            {path: 'user/account/activation', loadChildren: () => import('app/modules/auth/activate/activate.module').then(m => m.AuthActivateModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)},
            {path: 'validate-email', loadChildren: () => import('app/modules/auth/validate-email/validate-email.module').then(m => m.AuthValidateEmailModule)},
        ]
    },

    // Confirmation required route
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
        ]
    },

    // Landing routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
        ]
    },

    // Landlord routes
    // Property routes
    {
        path       : '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        // data: { authorities: ['LANDLORD'] },
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'p', loadChildren: () => import('app/modules/landlord/property/property.module').then(m => m.PropertyModule)},
        ]
    },

    // Listing routes
    {
        path       : '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        // data: { authorities: ['LANDLORD'] },
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {path: 'l', loadChildren: () => import('app/modules/landlord/listings/listings.module').then(m => m.ListingsModule)},
        ]
    }
];
