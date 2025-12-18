import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://dms-vn1p.onrender.com/api/auth';
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const user = localStorage.getItem('dms_user');
        if (user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    register(userData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    resetPassword(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, data);
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((res: any) => {
                localStorage.setItem('dms_token', res.token);
                localStorage.setItem('dms_user', JSON.stringify(res.user));
                this.currentUserSubject.next(res.user);
            })
        );
    }

    logout() {
        localStorage.removeItem('dms_token');
        localStorage.removeItem('dms_user');
        this.currentUserSubject.next(null);
    }

    getToken() {
        return localStorage.getItem('dms_token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('dms_token');
    }
}
