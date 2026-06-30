import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GymBrand } from '../../models/review.model';

@Injectable({ providedIn: 'root' })
export class GymBrandService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/gym-brands`;

  getAllBrands(): Observable<GymBrand[]> {
    return this.http.get<GymBrand[]>(this.apiUrl);
  }

  getBrandsByCountry(country: string): Observable<GymBrand[]> {
    return this.http.get<GymBrand[]>(this.apiUrl, { params: { country } });
  }

  getCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/countries`);
  }

  getBrandById(id: number): Observable<GymBrand> {
    return this.http.get<GymBrand>(`${this.apiUrl}/${id}`);
  }
}
