export interface User
{
    firstName: string;
    lastName: string;
    email: string;
    accountActivated: boolean;
    role: string;
    avatar?: string;
    status?: string;
}
