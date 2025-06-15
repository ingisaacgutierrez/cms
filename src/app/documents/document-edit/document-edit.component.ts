import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
  this.route.params.subscribe((params: Params) => {
    const id = params['id'];

    if (!id) {
      this.editMode = false;
      this.document = new Document('', '', '', '', []);
      return;
    }

    this.originalDocument = this.documentService.getDocument(id);

    if (!this.originalDocument) {
      return;
    }

    this.editMode = true;
    this.document = JSON.parse(JSON.stringify(this.originalDocument));
  });
}


  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const newDocument = new Document(
      this.originalDocument ? this.originalDocument.id : '',
      form.value.name,
      form.value.description,
      form.value.url,
      []
    );

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}