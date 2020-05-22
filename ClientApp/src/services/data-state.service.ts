import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from 'src/interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class DataStateService {

  private readonly user = new BehaviorSubject<IUser>(null);
  public readonly User$: Observable<IUser> = this.user.asObservable();

  public get User(): IUser {
    return this.user.getValue();
  }

  public set User(user: IUser) {
    if (!this.User) {
      this.setUserProps(user);
    }
    this.user.next(user);
  }

  private userProps: string[];
  public get UserProps(): string[] {
    return this.userProps;
  }

  private readonly userRole = new BehaviorSubject<string>(null);
  public readonly UserRole$ = this.userRole.asObservable();

  public get UserRole(): string {
    return this.userRole.getValue();
  }

  public set UserRole(role: string) {
    this.userRole.next(role);
  }

  private setUserProps(user: IUser): void {
    const defaultFields = ['userName', 'registryDate'];
    this.userProps = Object.keys(user).filter((p) => !defaultFields.includes(p));
  }
}
