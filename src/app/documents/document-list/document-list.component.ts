import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})

export class DocumentListComponent {
  documents: Document[] = [
  new Document('1', 'PDF Manual', 'User manual', 'https://example.com/manual.pdf', null),
  new Document('2', 'Technical Guide', 'System technical guide', 'https://example.com/guide.pdf', null),
  new Document('3', 'Contract', 'Legal service contract', 'https://example.com/contract.pdf', null),
  new Document('4', 'Report', 'Annual report', 'https://example.com/report.pdf', null)
];


  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
