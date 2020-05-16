import { UserModel } from './user.model';

export class DoctorModel extends UserModel {
    Specialization: string = null;
    YearsOfExperience: number = null;
}
