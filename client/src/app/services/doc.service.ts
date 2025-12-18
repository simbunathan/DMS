import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class DocService {
    private apiUrl = 'http://localhost:5000/api/documents';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        return new HttpHeaders({
            'Authorization': `Bearer ${this.authService.getToken()}`
        });
    }

    getDocuments(): Observable<any> {
        return this.http.get(this.apiUrl, { headers: this.getHeaders() });
    }

    uploadDocument(formData: FormData): Observable<any> {
        return this.http.post(`${this.apiUrl}/upload`, formData, { headers: this.getHeaders() });
    }

    deleteDocument(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
