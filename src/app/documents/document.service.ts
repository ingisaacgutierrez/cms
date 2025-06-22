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

  private firebaseUrl = 'https://isaacg-cms-default-rtdb.firebaseio.com/documents'; 

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getDocuments(): void {
    this.http.get<Document[]>(this.firebaseUrl).subscribe(
    
      (documents: Document[]) => {
        this.documents = documents ?? []; 
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
     
      (error: any) => {
        console.error('Error fetching documents from Firebase:', error);
      }
    );
  }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      const currentId = parseInt(document.id ?? '0');
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDocument(id: string): Document | undefined {
  return this.documents.find(doc => doc.id === id);
}

addDocument(newDocument: Document): void {
  if (!newDocument) return;

  this.maxDocumentId++;
  newDocument.id = this.maxDocumentId.toString();
  this.documents.push(newDocument);
  this.documentListChangedEvent.next(this.documents.slice());
}

updateDocument(original: Document, updated: Document): void {
  if (!original || !updated) return;

  const pos = this.documents.findIndex(d => d.id === original.id);
  if (pos < 0) return;

  updated.id = original.id;
  this.documents[pos] = updated;
  this.documentListChangedEvent.next(this.documents.slice());
}

deleteDocument(document: Document): void {
  if (!document) return;

  const pos = this.documents.indexOf(document);
  if (pos < 0) return;

  this.documents.splice(pos, 1);
  this.documentListChangedEvent.next(this.documents.slice());
}



}

