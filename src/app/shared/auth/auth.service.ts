import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from './User.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.prod';

const SIGN_UP_URL =
  'https://paducah-bookit-api.herokuapp.com/api/v1/users/create';
const SIGN_IN_URL =
  'https://paducah-bookit-api.herokuapp.com/api/v1/users/login';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpTimer: any;
  userToken: string = null;
  currUser = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  //   Sign UP!
  signUp(email: string, password: string) {
    return this.http.post<any>(SIGN_UP_URL, {
      email,
      password,
    });
  }

  //   Sign In!
  signIn(email: string, password: string) {
    return this.http
      .post<any>(SIGN_IN_URL, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          // Use "object destructuring" to get acess to all response values
          const { email, id } = res.payload.user;
          const { expiry, value } = res.payload.token;
          const expiresIn = new Date(expiry).getTime() - Date.now();
          // Pass the response values into handleAuth method
          this.handleAuth(email, id, value, expiresIn);
        })
      );
  }

  // Sign Out!
  signOut() {
    // send a request to logout
    this.http
      .delete('https://paducah-bookit-api.herokuapp.com/api/v1/users/logout')
      .subscribe((res: any) => {
        console.log('RES LOGOUT', res);
        if(res.success){
          this.currUser.next(null);

          localStorage.removeItem('userData');
  
          if (this.tokenExpTimer) clearTimeout(this.tokenExpTimer);
  
          this.router.navigate(['auth']);
        }else{
          // prompt the user that logged out didn't work
        }
      });
    // clear the current user from the app
    // navigate to the auth
  }

  // Auto Sign In
  autoSignIn() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const { email, id, _token, _tokenExpirationDate } = userData;

    const loadedUser = new User(
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.currUser.next(loadedUser);

      const expDur =
        new Date(_tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignOut(expDur);
    }
  }

  // Auto Sign Out
  autoSignOut(expDuration) {
    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  }

  handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    // Create Expiration Date for Token
    const expDate = new Date(new Date().getTime() + expiresIn);

    // Create a new user based on the info passed in . . . and emit that user
    const formUser = new User(email, userId, token, expDate);
    this.currUser.next(formUser);

    // Set a new timer for expiration token
    this.autoSignOut(expiresIn);

    // Save the new user to localStorage
    localStorage.setItem('userData', JSON.stringify(formUser));
  }
}
