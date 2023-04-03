import { Route } from '@angular/router';
import { AuthValidateEmailComponent } from 'app/modules/auth/validate-email/validate-email.component';

export const authValidateEmailRoutes: Route[] = [
    {
        path     : '',
        component: AuthValidateEmailComponent
    }
];
