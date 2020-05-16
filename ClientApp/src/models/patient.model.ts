import { UserModel } from './user.model';

export class PatientModel extends UserModel {
    RegistryDate: Date = undefined;
}
