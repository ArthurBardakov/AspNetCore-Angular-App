import { ISignInUp } from './ISignInUp';

export interface IRegister extends ISignInUp {
    lastName: string;
    firstName: string;
    role: boolean | string;
    confirmPassword: string;
}
