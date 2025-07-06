import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number = 0;
  documentListChangedEvent = new Subject<Document[]>();

  private baseUrl = 'http://localhost:3000/documents';

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments(): void {
    this.http.get<Document[]>(this.baseUrl)
      .subscribe(
        (documents) => {
          this.documents = documents ?? [];
          this.maxDocumentId = this.getMaxId();
          this.documents.sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          );
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.error('Error fetching documents:', error);
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id ?? '0', 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find(doc => doc.id === id);
  }

  addDocument(document: Document): void {
    if (!document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Document>(this.baseUrl, document, { headers: headers })
      .subscribe(
        (newDocument) => {
          this.documents.push(newDocument);
          this.sortAndSend();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document): void {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<Document>(`${this.baseUrl}/${originalDocument.id}`, newDocument, { headers: headers })
      .subscribe(
        (updatedDocument) => {
          this.documents[pos] = updatedDocument;
          this.sortAndSend();
        }
      );
  }

  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.baseUrl}/${document.id}`)
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  private sortAndSend() {
    this.documents.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }
}



