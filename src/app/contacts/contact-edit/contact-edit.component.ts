import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        this.contact = new Contact('', '', '', '', '', []);
        return;
      }

      this.originalContact = this.contactService.getContact(this.id);

      if (!this.originalContact) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onSubmit(form: any): void {
    const value = form.value;

    const newContact = new Contact(
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

  onDrop(event: CdkDragDrop<Contact[]>): void {
  const selectedContact = event.item.data;
  this.addToGroup(selectedContact);
}

addToGroup(contact: Contact): void {
  if (!contact) return;
  const invalidGroupContact = this.isInvalidContact(contact);
  if (invalidGroupContact) return;
  this.groupContacts.push(contact);
}

isInvalidContact(newContact: Contact): boolean {
  if (!newContact) return true;
  if (this.contact && newContact.id === this.contact.id) return true;
  return this.groupContacts.some(c => c.id === newContact.id);
}

onRemoveItem(index: number): void {
  if (index >= 0 && index < this.groupContacts.length) {
    this.groupContacts.splice(index, 1);
  }
}

}

