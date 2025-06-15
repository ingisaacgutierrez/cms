import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact = new Contact('', '', '', '', '', []);
  editMode: boolean = false;
  groupContacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        // Nuevo contacto
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', []);
        this.groupContacts = [];
        return;
      }

      this.originalContact = this.contactService.getContact(id);
      if (!this.originalContact) return;

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      this.groupContacts = this.contact.group ? [...this.contact.group] : [];
    });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const value = form.value;
    const newContact: Contact = new Contact(
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigateByUrl('/contacts');
  }

  onCancel(): void {
    this.router.navigateByUrl('/contacts');
  }

  onRemoveItem(index: number): void {
    if (index >= 0 && index < this.groupContacts.length) {
      this.groupContacts.splice(index, 1);
    }
  }
}
