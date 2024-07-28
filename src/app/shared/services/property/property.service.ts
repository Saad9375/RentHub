import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property } from '../../models/property.model';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient) {}

  getPropertyList() {
    return this.http.get<Property[]>('http://localhost:3000/propertyList');
  }

  updatePropertyList(property: Property) {
    return this.http.patch<Property>(
      'http://localhost:3000/propertyList/' + property.id,
      property
    );
  }

  addProperty(newProperty: Property) {
    return this.http.post<Property[]>(
      'http://localhost:3000/propertyList',
      newProperty
    );
  }

  getSelectedPropertyDetails(id: string) {
    return this.http.get<Property>(`http://localhost:3000/propertyList/${id}`);
  }
}
