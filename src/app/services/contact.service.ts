import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'token'
    })
  }
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  public getAllContacts(): Observable<ResponseModel> {
    return this.http.get<ResponseModel>(`${this.baseUrl}/Contacts`);
  }

  public addContact(contact: Contact): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/Contacts`,
      {
        name: contact.name,
        address: contact.address,
        phone: contact.phone,
        curp: contact.curp,
        active: contact.active
      },
      this.httpOptions
    );
  }

  public updateContact(contact: Contact): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Contacts/${contact.id}`,
      {
        id: contact.id,
        regDate: contact.regDate,
        name: contact.name,
        address: contact.address,
        phone: contact.phone,
        curp: contact.curp,
        active: contact.active
      },
      this.httpOptions
    );
  }

  public deleteContact(contact: Contact): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/Contacts/DeleteContact`,
      {
        id: contact.id,
        regDate: contact.regDate,
        name: contact.name,
        address: contact.address,
        phone: contact.phone,
        curp: contact.curp,
        active: contact.active
      },
      this.httpOptions
    );
  }
}
