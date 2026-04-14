import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MeasurementApiRequest, MeasurementHistory } from '../models/measurement.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  private readonly API = `${environment.apiUrl}/api/Measurement`;

  constructor(private http: HttpClient) {}

  convert(req: MeasurementApiRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/convert`, req);
  }

  add(req: MeasurementApiRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/add`, req);
  }

  subtract(req: MeasurementApiRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/subtract`, req);
  }

  divide(req: MeasurementApiRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/divide`, req);
  }

  compare(req: MeasurementApiRequest): Observable<any> {
    return this.http.post<any>(`${this.API}/compare`, req);
  }

  getHistory(): Observable<MeasurementHistory[]> {
    return this.http.get<MeasurementHistory[]>(`${this.API}/history`);
  }

  getHistoryByOperation(operation: string): Observable<MeasurementHistory[]> {
    return this.http.get<MeasurementHistory[]>(`${this.API}/history/operation`, {
      params: { operation }
    });
  }

  getOperationCount(): Observable<number> {
    return this.http.get<number>(`${this.API}/count`);
  }
}
