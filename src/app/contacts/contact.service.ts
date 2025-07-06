import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];
  maxContactId: number = 0;
  private baseUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts(): void {
    this.http.get<Contact[]>(this.baseUrl)
      .subscribe(
        (contacts) => {
          this.contacts = contacts ?? [];
          this.maxContactId = this.getMaxId();
          this.sortAndSend();
        },
        (error) => console.error('Error fetching contacts:', error)
      );
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.find(contact => contact.id === id);
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(contact: Contact): void {
    if (!contact) return;

    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Contact>(this.baseUrl, contact, { headers })
      .subscribe(
        (newContact) => {
          this.contacts.push(newContact);
          this.sortAndSend();
        }
      );
  }

  updateContact(original: Contact, updated: Contact): void {
    if (!original || !updated) return;

    const pos = this.contacts.findIndex(c => c.id === original.id);
    if (pos < 0) return;

    updated.id = original.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<Contact>(`${this.baseUrl}/${original.id}`, updated, { headers })
      .subscribe(
        (updatedContact) => {
          this.contacts[pos] = updatedContact;
          this.sortAndSend();
        }
      );
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete(`${this.baseUrl}/${contact.id}`)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend(): void {
    this.contacts.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    this.contactListChangedEvent.next(this.contacts.slice());
  }
}

