import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
})

export class ContactDetailComponent implements OnInit {
  contact: Contact;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.contactSelectedEvent.subscribe(
      (contact: Contact) => {
        this.contact = contact;
      }
    );
  }
}
