import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document = new Document('', '', '', '', []); 
  editMode: boolean = false;

  constructor() {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const newDocument = new Document(
      '', 
      form.value.name,
      form.value.description,
      form.value.url,
      []
    );
    console.log('Documento guardado:', newDocument);
  }

  onCancel() {
    console.log('Cancelado');
  }
}